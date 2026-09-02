"""
PHENORA Flash - Layer 3/4: the digital twin and the forecaster.

Scope discipline matters here. This is NOT a twin of a patient. It is a
twin of the MEASUREMENT: a small state-space model of what the cartridge
is doing, driven by the same physics as the forward model, corrected by
each new spectrum.

State x = [g, mu]
    g   normalised growth signal (0 -> 1), i.e. how far the well has
        travelled from blank to plateau
    mu  current specific growth rate, treated as a slowly varying
        random walk so the filter can track lag -> exponential -> plateau

Process (logistic):   g' = mu * g * (1 - g)
Observation:          y  = g + v

Because it is a filter and not a regressor, every forecast comes with a
covariance that grows with horizon. That is what makes it honest to put a
number on the screen at +30 min.
"""

import numpy as np


class GrowthTwin:
    def __init__(self, g0=0.02, mu0=0.8, P0=None, q_g=4e-5, q_mu=9e-2, r=None):
        self.x = np.array([g0, mu0], float)
        self.P = np.array([[4e-3, 0.0], [0.0, 4e-1]]) if P0 is None else np.array(P0, float)
        self.Q = np.diag([q_g, q_mu])
        self.r = r          # observation variance; set per-update from QC
        self.history = []

    # -- process model ------------------------------------------------
    @staticmethod
    def _f(x, dt):
        g, mu = x
        g = np.clip(g, 1e-6, 1.2)
        gn = g + dt * mu * g * (1.0 - g)
        return np.array([np.clip(gn, 1e-6, 1.3), mu])

    @staticmethod
    def _F(x, dt):
        g, mu = x
        g = np.clip(g, 1e-6, 1.2)
        return np.array([[1.0 + dt * mu * (1.0 - 2.0 * g), dt * g * (1.0 - g)],
                         [0.0, 1.0]])

    # -- filter -------------------------------------------------------
    def predict(self, dt):
        F = self._F(self.x, dt)
        self.x = self._f(self.x, dt)
        self.P = F @ self.P @ F.T + self.Q * dt
        return self.x.copy(), self.P.copy()

    def update(self, y, trust=1.0):
        """trust in (0,1] from the integrity engine; low trust widens R."""
        R = (self.r if self.r is not None else 2.5e-4) / max(trust, 0.05) ** 2
        H = np.array([[1.0, 0.0]])
        S = float((H @ self.P @ H.T)[0, 0] + R)
        K = (self.P @ H.T / S).ravel()
        innov = float(y - self.x[0])
        self.x = self.x + K * innov
        self.P = (np.eye(2) - np.outer(K, H)) @ self.P
        nis = innov ** 2 / S                     # normalised innovation squared
        return dict(innovation=innov, nis=float(nis), K=K.copy())

    def step(self, t, y, dt, trust=1.0):
        self.predict(dt)
        info = self.update(y, trust)
        self.history.append((t, self.x.copy(), self.P.copy(), info))
        return info

    # -- forecast -----------------------------------------------------
    def forecast_ensemble(self, horizons_h, dt=0.05, n=600, rng=None, q=(2.5, 97.5)):
        """Monte-Carlo forecast. Replaces the linearised (EKF) forecast.

        Diagnosis behind this method: propagating a covariance through the
        Jacobian of a near-exponential map badly UNDER-estimates spread,
        because the map is convex over the range the posterior actually
        covers. Validation showed the linearised 95% band achieving ~30%
        empirical coverage. Sampling the posterior and propagating each
        particle through the true nonlinear dynamics fixes the bias
        without pretending to know more than the filter does.
        """
        rng = rng or np.random.default_rng(0)
        L = np.linalg.cholesky(self.P + 1e-12 * np.eye(2))
        part = self.x + (rng.standard_normal((n, 2)) @ L.T)
        part[:, 0] = np.clip(part[:, 0], 1e-6, 1.3)
        sq = np.sqrt(np.diag(self.Q))
        out, t, ti = [], 0.0, 0
        targets = sorted(horizons_h)
        while ti < len(targets):
            g, mu = part[:, 0], part[:, 1]
            g = np.clip(g + dt * mu * g * (1.0 - g), 1e-6, 1.4)
            mu = mu + rng.standard_normal(n) * sq[1] * np.sqrt(dt)
            part = np.column_stack([g, mu])
            t += dt
            while ti < len(targets) and t >= targets[ti] - 1e-9:
                lo, hi = np.percentile(part[:, 0], q)
                out.append(dict(horizon_h=targets[ti],
                                mean=float(np.mean(part[:, 0])),
                                median=float(np.median(part[:, 0])),
                                sd=float(np.std(part[:, 0])),
                                lo=float(lo), hi=float(hi),
                                confidence=float(np.exp(-(hi - lo) / 0.5))))
                ti += 1
        return out

    def forecast(self, horizons_h, dt=0.05, z=1.96):
        """Propagate the state forward. Returns per-horizon mean and band.

        Forecast uncertainty grows from two sources: the filter's current
        covariance, and process noise accumulated over the horizon. The
        second term dominates at long horizons, which is the honest
        answer to "how far ahead can this thing see".
        """
        x, P = self.x.copy(), self.P.copy()
        out, t = [], 0.0
        targets = sorted(horizons_h)
        ti = 0
        while ti < len(targets):
            F = self._F(x, dt)
            x = self._f(x, dt)
            P = F @ P @ F.T + self.Q * dt
            t += dt
            while ti < len(targets) and t >= targets[ti] - 1e-9:
                sd = float(np.sqrt(max(P[0, 0], 0.0)))
                out.append(dict(horizon_h=targets[ti],
                                mean=float(x[0]),
                                sd=sd,
                                lo=float(x[0] - z * sd),
                                hi=float(x[0] + z * sd),
                                confidence=float(np.exp(-sd / 0.12))))
                ti += 1
        return out

    def time_to_threshold(self, thr=0.5, dt=0.02, t_max=12.0, z=1.96):
        """When will this well cross the detection threshold, and how sure?"""
        x, P, t = self.x.copy(), self.P.copy(), 0.0
        t_hit = t_lo = t_hi = None
        while t < t_max:
            F = self._F(x, dt)
            x = self._f(x, dt)
            P = F @ P @ F.T + self.Q * dt
            t += dt
            sd = np.sqrt(max(P[0, 0], 0.0))
            if t_hi is None and x[0] + z * sd >= thr:
                t_hi = t                      # earliest plausible
            if t_hit is None and x[0] >= thr:
                t_hit = t
            if t_lo is None and x[0] - z * sd >= thr:
                t_lo = t                      # latest plausible
                break
        return dict(t_expected_h=t_hit, t_earliest_h=t_hi, t_latest_h=t_lo,
                    reached=t_hit is not None)

    @property
    def state(self):
        return dict(g=float(self.x[0]), mu=float(self.x[1]),
                    sd_g=float(np.sqrt(self.P[0, 0])),
                    sd_mu=float(np.sqrt(self.P[1, 1])))
