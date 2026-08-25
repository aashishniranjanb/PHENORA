# PHENORA Simulation Scope

This document specifies the scientific equations and assumptions behind the impedance modeling.

## 1. Equivalent Circuit Model

The sensor is modeled as a modified Randles equivalent circuit:

$$
Z(f) = R_s + \frac{R_{ct}}{1 + j 2\pi f R_{ct} C_{dl}}
$$

Where:
- $R_s$: Solution resistance (influenced by medium conductivity and temperature).
- $R_{ct}$: Charge-transfer resistance at the electrode-solution interface.
- $C_{dl}$: Double-layer capacitance at the electrodes.
- $f$: Excitation frequency (Hz).

## 2. Maxwell-Fricke effective medium approximation

Bacterial cells act as non-conductive inclusions in a conductive medium. The effective conductivity $\sigma_{eff}$ of the suspension is given by:

$$
\sigma_{eff} = \sigma_m \frac{1 - \phi}{1 + \frac{\phi}{2}}
$$

Where:
- $\sigma_m$: Conductivity of the medium (without cells).
- $\phi$: Volume fraction of cells (directly proportional to cell concentration $N(t)$).

## 3. Biological Trajectory & Antibiotic Susceptibility

Cell concentration $N(t)$ over time follows a logistic growth trajectory:

$$
N(t) = \frac{K}{1 + A e^{-r t}}
$$

Where:
- $K$: Carrying capacity.
- $r$: Growth rate parameter.
- $A$: Initial population constant.

### Antibiotic Perturbation:
- **Control Well:** Healthy growth ($r = r_{normal}$).
- **Test Well (Susceptible):** Inhibited growth ($r = r_{inhibited}$ or negative growth).
- **Test Well (Resistant):** Growth closely matches the control ($r \approx r_{normal}$).

## 4. Temperature Dependence

Medium conductivity increases with temperature due to ion mobility:

$$
\sigma_m(T) = \sigma_0 [1 + \alpha (T - T_0)]
$$

Where $\alpha \approx 0.02 \, \text{K}^{-1}$ is the temperature coefficient. Solution resistance $R_s$ is inversely proportional to conductivity:

$$
R_s(T) = \frac{k_{cell}}{\sigma_m(T)}
```
Where $k_{cell}$ is the electrode cell constant.

