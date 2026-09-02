# PHENORA Flash — reference implementation

Physics-grounded simulation of a multi-channel bioimpedance diagnostic platform.
**All data is synthetic.** No clinical validity is claimed or implied.

## Run

```bash
python3 build_cohort.py   # generate 480 synthetic cartridges, train, calibrate  (~60 s)
python3 run_demo.py       # one unknown specimen, full autonomous loop           (~10 s)
python3 validate.py       # V1-V4 validation study                               (~40 s)
```

## Layout

| File | Layer | Contents |
|---|---|---|
| `phenora/physics.py` | 0 | forward models: Cole, Randles+CPE+Warburg, Gompertz growth, electrode polarisation |
| `phenora/acquire.py` | 1 | sub-band multisine, Schroeder phases, ADC/PGA chain, Goertzel bank |
| `phenora/analyze.py` | 2 | Kramers-Kronig gate, DRT, Cole/Randles/electrolyte fits, growth kinetics |
| `phenora/twin.py` | 3-4 | EKF state estimate, ensemble forecast, time-to-threshold |
| `phenora/pipeline.py` | 5-7 | cartridge, staged features, conformal panel, EIG planner |
| `PHENORA_FLASH_SPEC.md` | — | frozen architecture, feasibility verdicts, corrected checklist |

Outputs: `figures/`, `demo_output.txt`, `validation_output.txt`, `cohort_report.json`.

## Headline findings

1. Bulk EIS of a raw specimen cannot see bacteria at clinical concentrations
   (|dZ/Z| ~ 1.5e-7 vs ~1e-3 noise floor). Confirmed by ablation: 18.8% vs 16.7% chance.
2. All diagnostic information comes from recognition chemistry and growth biology.
   GROWTH + AST alone reaches 94.8%; adding bulk slightly hurts.
3. The twin's forecast intervals are badly miscalibrated (41% at nominal 95%) due to a
   missing lag state. Forecast confidence numbers must not ship until fixed.
4. Conformal coverage holds marginally (93.8% vs 90% target) but fails per class
   (69.2% on K. pneumoniae). Mondrian variant required.
