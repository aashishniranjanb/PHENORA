# Executive Summary  
This report presents a rigorous evaluation of **PHENORA**, a prototype for rapid impedance-based antibiotic susceptibility testing (AST) with an **adaptive, confidence-driven measurement layer**. We begin by establishing the physics of impedance sensing in bacterial suspensions and review how antibiotics can affect those signals. We analyze the proposed hardware architecture (dual wells + impedance front-end + FPGA intelligence) and identify strengths and flaws. A detailed comparison of the AD5933 versus a discrete 555+opamp+ADS1115 front-end is made, favoring a data-backed choice. We survey the literature on appropriate excitation frequencies for bulk EIS-AST, and derive recommendations for V1. Electrode design (material, geometry, volume) is reviewed, with a simple low-cost prototype suggestion. The advantages of the proposed control–test differential measurement are explained. We outline an FPGA algorithm for on-the-fly feature extraction (ΔZ, slope, noise, confidence) and critically evaluate its statistical validity. A staged experimental validation plan is developed, from resistors to biological replicates. We compare PHENORA to iFAST and RapidDx (two leading rapid-AST platforms) and to other competitors (Q-linea, Accelerate, QuantaMatrix, etc.), highlighting differences in technology, speed, and status. Crucially, we perform a **prior-art search** for “adaptive impedance AST” and find no known work combining real-time confidence scoring with impedance sensing; the novelty claim is therefore plausible but must be carefully qualified. We design a practical FPGA architecture fitting the iCE40UP5K, and propose test algorithms (e.g. SNR-based stop criteria) along with their limitations. We craft a 48-hour hackathon plan covering immediate fabrication, FPGA coding, and a minimal demonstration (likely using dummy electrical loads rather than live bacteria, given biosafety). We also develop a fault analysis (FMEA) and finalize a realistic India-based BOM with costs. In final recommendations, we assign numerical scores to PHENORA’s promise along various dimensions, then answer key questions candidly (e.g. *“Should we continue with impedance AST?”*). Throughout, every claim is backed by recent literature or sources. We conclude that PHENORA’s core ideas are scientifically motivated but speculative – the project is **high-risk, potentially high-reward**, with much work needed to convert the hackathon concept into a validated system.  

## System Architecture  
PHENORA’s measurement chain (Figure 1) uses two sample wells – a **Control** (no antibiotic) and **Test** (with antibiotic) – each interfaced to electrodes. A two-electrode impedance front-end (either AD5933 or a discrete oscillator+TIA+ADC) continuously measures the complex impedance **Z(t)** of each well. A microcontroller (Heltec WiFi Kit) or FPGA is used for data acquisition; the team plans to offload intensive tasks (filtering, ΔZ, features, decision logic) to a Lattice iCE40UP5K FPGA. The FPGA computes the differential signal ΔZ(t)=Z_test–Z_ctrl, extracts features (e.g. rate of change, variance), and computes a “confidence” metric. A simple state machine then issues **“STOP”** if the impedance difference is growing or stable enough, or **“MEASURE AGAIN”** (continue taking data) if not.  

Conceptually, this design is **technically plausible**: differential measurements are known to suppress common-mode drift (e.g. temperature shifts, medium conductivity changes). The pipeline – impedance capture → digital filtering → subtraction → feature extraction → decision – is logical. Using an FPGA for real-time processing of streaming impedance data is ambitious but feasible given the UP5K’s resources (e.g. built-in DSP blocks for multiply-adds). The use of two wells (Control vs Test) is sound and mirrors many differential AST schemes.  

However, **many aspects are questionable or unproven** for AST. The AD5933 chip is convenient but has known limitations: below ≈1 kHz its internal DFT yields *systematic errors*, and electrode polarization further distorts low-frequency readings. The NE555+opamp+ADS1115 fallback is unconventional: the 555 only produces a square wave, making accurate magnitude/phase measurement difficult without additional hardware. The ADC (ADS1115, 860 S/s max) is very slow for extracting AC components, so the discrete design can likely only measure a DC or low-rate envelope. This suggests the discrete front-end might capture *|Z|* but not true R/I or phase.  

Even if signals are captured, **the adaptive decision scheme is speculative**. Real bacterial impedance changes are small and noisy. There is no published example of an AST system automatically stopping early based on a confidence metric. The proposed confidence formula (|ΔZ|/(noise+ε)) is an intuitive SNR measure, but its statistical validity is unproven. Mis-calibrated thresholds could cause **false stops** (calling susceptible too soon) or endless looping. We found no reference in the literature or patents for exactly this “closed-loop, confidence-driven” AST approach. In short, the architecture is **innovative but high-risk**. Before believing it can work on real bacteria, the team must **(a)** demonstrate that impedance differences due to antibiotics are measurable above noise in bulk culture; and **(b)** test the algorithm on synthetic data.  

**Measurements needed before any biology:** calibrate the front-end with precision resistors (verify magnitude and phase accuracy across 100 Hz–10 kHz); measure noise floor and stability; test the control–test subtraction on known impedance differences; characterize electrode polarization (e.g. measure open-circuit admittance of electrodes in medium). Only after validating the electrical front-end should biological variables be introduced.  

**Key flaws:** breadboard wiring and jumper capacitance will add noise and variability; electrodes themselves (material, area, spacing) hugely affect results (see Electrode section below). The 32 GPIO on the VSDSquadron may limit simultaneous analog I/O (e.g. if doing 4-electrode in future). The protocol requires *identical* conditions in both wells – any mismatch (volume, geometry, fluidic level) will introduce bias. The “confidence engine” is a pure heuristic; without thorough testing, it could degrade results.  

**Remain Simple:** For the hackathon MVP, avoid adding complexity. For example, do **not** attempt on-board temperature sensing or 4-electrode measurement unless a simple solution exists. Likewise, **don’t** add elaborate UI, networking, or ML – focus on getting a single impedance feature displayed.  

## Biological Mechanism  
Impedance spectroscopy measures the complex opposition to AC current in the sample.  Equivalently, **|Z|** reflects ionic conduction (resistance) plus capacitive storage. In a bacterial suspension:  
- **Ionic conductivity (σ):** Dissolved ions in the growth medium conduct current; higher σ means lower real part of impedance (R). Antibiotics or growth affecting ion concentration (e.g. metabolite release, lysis) will change σ.  
- **Membrane capacitance:** Viable bacteria have insulating membranes; at low frequencies, current is blocked by membranes, so cells act as non-conducting particles. If a bacterium’s membrane integrity is compromised (e.g. by lytic antibiotics), its insulative barrier weakens, letting current through. Thus membrane damage **decreases** low-frequency impedance.  
- **Cell volume/morphology:** Cell size alters how much volume they displace in solution. Larger cells (from filamentation or swelling due to β-lactams) occupy more volume, increasing impedance at low frequencies (like Coulter counting). iFAST observed that meropenem-treated *K. pneumoniae* swelled ~3× in electrical diameter.  
- **Concentration (turbidity):** More cells in a fixed volume usually means higher impedance (lower conductance) because cells are insulators at low frequencies. In a growing culture without antibiotic, cell division gradually raises impedance.  
- **Electrolyte effects:** Bacterial metabolism (fermentation, respiration) can acidify the medium or produce charged metabolites, changing conductivity. However, such effects are relatively slow and confounded by buffering.  
- **Electrode/electrolyte interface:** At very low frequencies (<10–100 Hz), charged layers form on electrode surfaces, causing polarization impedance. This effect can swamp the true sample impedance and varies with electrode material. It is a **source of noise**, not a direct biological signal.  
- **Charge-transfer (Faradaic) resistance:** If bacteria interact with electrode redox reactions (unlikely in inert front-ends), a Faradaic R_ct element appears. Most AST sensors avoid Faradaic processes by using inert electrodes and small AC amplitudes.  

In summary, **bulk EIS at ~100 Hz–10 kHz** is primarily sensitive to ionic conductivity and cell volume.  Intact cells behave as capacitive insulators at low freq, so adding cells (growth) *increases* the measured impedance (decreases conductance).  Antibiotics that **kill or lyse cells** tend to *decrease* impedance (as intracellular ions leak out).  Antibiotics that only *inhibit growth* (bacteriostatic) will stop the upward trend of impedance. Membrane-active drugs that perforate walls can sharply change impedance by altering effective capacitance.  

**Mechanisms in the literature:** The iFAST system (single-cell cytometry) explicitly distinguishes two effects: (a) a Coulter-like volume signal at low frequency, and (b) a “dielectric” high-frequency signal related to membrane/cell-wall impedance (their “electrical opacity”). They observed *cell volume increase* and *membrane permeability changes* as antibiotic effects. Other bulk studies (e.g. Sci. Rep. 2024) show that growing bacteria reduce the charge-transfer resistance R_ct over hours, likely because of increased metabolic electron transport. However, for a simple bulk sensor the *dominant* measurable is likely the **medium conductivity/resistance**. In the noted Sci. Rep., R_ct decreased due to growth, and **solution resistance** (R_s) at high freq provided the main growth signal.  

For PHENORA’s **low-frequency sweep**, the most plausible mechanism is changes in **ionic conductivity** and **cell volume**.  Electrodes form part of the signal, but the two-well differential can cancel stable electrode effects.  **Supported mechanisms:** Growth (increased impedance), lysis (decreased impedance), swelling (increased impedance), membrane damage (apparent impedance decreases). **Unproven/plausible:** metabolic byproducts altering pH/conductivity (might be minor); electrode polarization effects (known but usually treated as artefact); charge-transfer if media contains redox substances (unlikely with pure cultures).  

**Mechanisms relevant to iFAST but not bulk:** iFAST measures each cell’s impedance as it flows one-by-one through a tiny channel with calibrated beads. It relies on extremely high frequencies (MHz) and high sensitivity to detect single-cell opacities. Bulk wells average over millions of cells and focus on overall conductance. PHENORA cannot leverage the *cell-by-cell gating* or microfluidic focusing of iFAST. Also, iFAST uses a very low-volume CMOS channel (≈20×40 μm) which amplifies the effect of each cell; PHENORA’s wells (mm scale) will have far more dilution.  

**Clarifications:** PHENORA’s measurements should be seen as **bulk (population) sensing of electrical properties**, distinct from:  
- **Impedance measurement** in general (just the technique) versus the **biological phenomenon** (growth vs death).  
- **Growth measurement** (e.g. OD or conductometry) versus **electrical sensing**: PHENORA measures electrical changes (conductivity/capacitance), which correlate with growth or death but are not direct counts.  
- **Metabolic sensing** (like pH or oxygen) is another proxy; impedance is more direct to cell membranes.  
- **Single-cell phenotyping** (like iFAST) is fundamentally different: PHENORA treats the culture as one bulk resistor/capacitor.  

**Causal chain:** We can draw a simplified flow of causation:

```
Antibiotic exposure
   ↓ (SUPP/GROW/LYSE)    [pharmacological effect]
Bacterial response (death, inhibited division, membrane damage)
   ↓ (SUPPORTED/PLAUSIBLE) [physiological effect]
Physical/electrical change (e.g. ion release, cell swelling, decreased membrane capacitance)
   ↓ (SUPPORTED/PLAUSIBLE) [bio→physics transduction]
Change in measured impedance feature (e.g. drop in |Z|, change in phase, alteration of ΔZ slope)
   ↓ (PLASUSIBLE) [EIS measurement]
Algorithm → AST interpretation (STOP if ΔZ high & stable → SUSCEPTIBLE, else if ΔZ similar to CONTROL → RESISTANT)
   ↑ (UNPROVEN) [statistical decision]
```

- *Antibiotic→Biological:* well-established biochemistry (β-lactams disrupt cell wall, aminoglycosides disrupt membrane, etc) – SUPPORTED.  
- *Biological→Physical:* e.g. cell lysis → ion release is well-known (membrane integrity yields conductivity) – PLAUSIBLE/SUPPORTED by analogous studies. Filamentation → volume increase – SUPPORTED by iFAST.  
- *Physical→Impedance:* changes in conductivity or volume directly alter Z – SUPPORTED by EIS theory.  
- *Algorithm→AST:* This is a custom interpretation layer: SNR-based thresholding has no prior validation in AST – **UNPROVEN**.  

Thus, the most **uncertain arrow** is from raw impedance feature to clinical interpretation. No existing studies validate such an adaptive threshold in AST context. All other arrows have at least conceptual support. 

## Electrical Sensing Mechanism  
**Impedance sensors** measure the complex resistance Z = R + jX of the sample. The real part R is dominated by ionic conduction; the imaginary part X by capacitive effects (cell membranes, electrode interface). In PHENORA’s two-electrode setup, the measured Z includes: (a) the bulk solution resistance (inversely proportional to conductivity) and (b) polarization impedance at the electrode interfaces. Thus, changes in measured |Z| or phase can come from variations in cell-mediated conduction or from electrode artefacts.

Key points from the literature: At low frequencies (<1 kHz), currents mainly flow **around** cells through the extracellular medium. Living bacteria are effectively insulators at low freq, so adding cells increases bulk resistance (decreases conductance) roughly proportional to cell volume. At higher frequencies (> MHz), current can pass through cell membranes and measure intracellular fluid. This is exploited in iFAST, but PHENORA’s target is ≤10 kHz, so it will see mostly extracellular pathways and double-layer effects.

**Impedance feature extraction:** PHENORA can compute various features from the complex Z(t):  
- **Magnitude |Z|:** simplest, indicates overall impedance. A rising |Z| in the Test well relative to Control may signal growth (more cells), whereas a drop might indicate lysis/leakage.  
- **Real vs Imag:** Using raw R and X allows more nuanced subtraction. Membrane permeabilization often appears as a change in X (phase). However, our hardware (especially the discrete option) may not yield reliable phase.  
- **Differential ΔZ:** We will compute ΔR=R_test–R_ctrl and ΔX similarly, or directly Δ|Z|. This removes common-mode changes (temperature drift, electrode baseline). Literature suggests subtracting *raw R/I components* yields linearity.  
- **Derived features:** Slope (d(ΔZ)/dt), variance of ΔZ, or other statistical metrics. For example, iFAST uses the fraction of cells shifted out of a “susceptible contour”, but PHENORA can only use time-series features.  

No single feature is proven optimal in bulk. The Sci. Rep. 2024 study used the *charge transfer resistance* R_ct (extracted by equivalent-circuit fitting) as an AST metric. Fitting a Randle’s model in real-time is impractical on an FPGA, so PHENORA will likely stick to simpler metrics (magnitude change, slope).

## AD5933 vs. 555+LM358+ADS1115 Front-End  
**Principle:**  
- **AD5933:** An integrated network analyzer chip (12-bit ADC, 1 MSPS) that generates a DDS sinewave and performs an internal DFT to output *real (Re)* and *imag (Im)* components of the impedance. It can sweep frequency. It requires an external calibration resistor per frequency to correct its magnitude.  
- **Discrete (555+LM358+ADS1115):** The NE555 generates a square-wave drive at one (or a few) frequencies. The LM358 (op-amp) might act as a transimpedance amplifier or buffer. The ADS1115 (16-bit, I^2C ADC, up to 860 SPS) digitizes an analog voltage (which could be a rectified or sampled current signal). Phase information would be lost unless an explicit synchronous detection is implemented.

| Feature                | AD5933 Module                | 555 + LM358 + ADS1115  |
|------------------------|------------------------------|-----------------------|
| **Measurement principle** | Discrete-time sine generator + internal DFT | Square-wave drive + amplitude sampling (no phase) |
| **Frequency range**    | 1 kHz–100 kHz (typical); above few kHz recommended | 10 Hz–several 10s of kHz (NE555 can go low, but <10 Hz unstable; can reach ~100 kHz max) |
| **Accuracy & calibration** | Requires calibration with known resistor. Susceptible to systematic errors below ~1 kHz. | Calibration of amplifier gain needed. ADS1115 allows gain and offset tuning. Potentially more linear, but no built-in phase reference. |
| **Magnitude & Phase**  | Provides both R and X (thus |Z| and phase) directly. | Only magnitude (as ADS1115 outputs DC samples). No phase. (Could measure two quadratures with two ADC channels but complex). |
| **Repeatability/Noise** | High integrated accuracy at mid-high frequencies; at low freq (<1 kHz) noise and DFT errors increase. | ADS1115 is 16-bit but slow (860 Hz max); 555 output has jitter/noise; overall SNR uncertain. Possibly worse than AD5933. |
| **Software/FW complexity** | Controlled via I²C by MCU; FPGA sees digital Re/Im results directly (no heavy math needed). | FPGA (or MCU) must handle ADC timing. To get impedance, may need DSP (FFT or synchronous detection) on sampled waveform. This is complex or imprecise. |
| **FPGA complexity**    | Minimal: just read two 12-bit values per freq. | High: either generate timing for ADC or oversample ADS1115 for each cycle, then compute amplitude. Possibly need CORDICs or LUTs for detection. |
| **Availability/Cost (INR)** | AD5933 itself ~₹2500 (DigiKey) or breakout ~₹1500–2000. | 555 (~₹5), LM358 (~₹5), ADS1115 module (~₹150) – total <₹200. |
| **Hackathon reliability** | Monolithic device, fewer wiring errors, repeatable output (if calibrated). | Modular hack (breadboard) – more wiring noise and errors. Square drive may excite higher harmonics. |
| **Suitability for bulk bacteria** | Designed for EIS. Can sweep and measure precise impedance features across freq (good for multi-frequency protocols). Phase info could capture membrane effects. | Only single/few frequencies practical. No phase info. Could be enough if using |Z| only, but loses subtlety. |
| **Limitations**        | Not designed for below 1 kHz (electrode polarization); requires known resistor for calibration per freq. | 555 waveform not sinusoidal (contains harmonics) which can confuse measurement. ADS1115’s low sampling rate (~860 Hz) limits detectible freq. Hard to resolve fast changes. |

**Recommendation:** **VERSION A (AD5933)**. Despite the modest cost disadvantage, the AD5933 offers a true impedance measurement engine with real and imaginary outputs, sweeping capability, and simpler integration. Its low-frequency limitation (~1 kHz) does conflict with the original 100 Hz–10 kHz plan, but we should adapt our frequency plan upward (see Frequency section). The discrete option is intriguing for cost, but the practical issues (phase loss, slow ADC) make it unreliable as an AST front-end. In summary, AD5933 provides more robust data for our scientific goals, whereas the 555/ADS1115 approach is at best a narrowband approximation.

## Frequency Analysis  
Literature shows a wide range of frequencies used in bacterial impedance sensing. Low frequencies (<100 Hz) are dominated by **electrode polarization** and double-layer capacitance. Mid-range (kHz) begins to probe cell membranes and ionic conduction. High frequencies (MHz) allow current through cell interiors. Notably, iFAST uses 5 MHz and 40 MHz (far above our plan), and many EIS systems sweep from 50 Hz up to 1 MHz.

- **Low (<1 kHz):** Electrode interface and Warburg diffusion dominate. Large double-layer capacitance causes phase shifts. Bacterial cells appear as pure volume displacers (Coulter-type).  
- **Mid (1–100 kHz):** Onset of cell membrane impedance effects. Phaseshift from 0 toward –90° as cell capacitance contributes. If membranes are compromised, changes appear in this range. Bulk solution resistance still present.  
- **High (>100 kHz–MHz):** Current penetrates cell interiors; membrane capacitance is shorted. The magnitude now reflects combined extracellular + intracellular conductivity. In iFAST, an “opacity” ratio (40 MHz vs 5 MHz) gauges membrane integrity.  
- **Very High (>10 MHz):** Above single-cell bandwidth; often not needed for bulk AST.  

Given PHENORA’s bulk wells, electrode polarization will be significant at very low frequencies. The two-electrode setup inherently includes all these effects. 

**Appropriate bands:** For bulk bacterial sensing, frequencies of a few kHz to a few hundred kHz are often used. For example, Xu *et al.* (2024) measured from 50 Hz–1 MHz and extracted R_ct at low frequencies as the AST signal. Lower frequencies (<100 Hz) mainly capture electrode/electrolyte interface and should generally be avoided or corrected. Very high (>1 MHz) might add information but requires a different front-end.

**Bulk bacterial vs cell membrane vs electrode:**  
- *Bulk conductivity (ionic):* measured at higher end (10–100 kHz and above), where electrode effects are smaller.  
- *Membrane integrity:* better seen by comparing low vs mid frequencies (like iFAST’s dual freq). However, PHENORA’s low end is limited by polarization.  
- *Charge-transfer resistance (R_ct):* usually appears at low-mid frequencies (seen as semicircle in Nyquist). If using AD5933 (max 100 kHz), R_ct can be estimated if we sweep down from 100 k to ~1 k (with caution).  
- *Electrode polarization:* dominates <100 Hz and should be minimized (e.g. don’t rely on 100 Hz).  

**Recommended V1 strategy:** Use a multi-frequency sweep focusing on mid-range. For instance, sweep 1 kHz → 50 kHz in logarithmic steps. This covers cell-level dispersion without extreme electrode effects. The AD5933 can sweep e.g. 1k, 2k, 5k, 10k, 20k, 50k Hz. Monitor how ΔZ changes with time at each. Alternatively, pick a few fixed freqs (e.g. 5 kHz and 50 kHz) and track them. 

If using AD5933’s built-in sweep, ensure we calibrate at each frequency with a reference resistor. We should **avoid below ~1 kHz** due to AD5933 DFT errors. Also plan to filter out DC drift and 50/60 Hz pickup. 

**Future adaptive frequency:** It is conceivable to have PHENORA adjust frequencies on-the-fly (e.g. zoom in if the signal is weak), but this is complex. For V1, a predetermined sweep or fixed set of frequencies is safer.  

## Electrode Design  
Selecting electrodes for V1 involves material, shape, and arrangement. 

- **Configuration:** A simple **two-electrode** setup (one working + one counter) per well is easiest. Four-electrode (two current, two sense) would reduce interface error, but doubles electrodes and wiring, complicating the hack. For a breadboard prototype, two-electrode is acceptable if we calibrate out electrode effects. Interdigitated electrodes (comb fingers) greatly increase surface area, but require PCB fabrication – not feasible now.  

- **Material:** Electrodes should be **chemically inert** and reproducible. **Stainless steel (316L)** rods or sheets are inexpensive, biocompatible, and commonly used. They still polarize, but at least won’t dissolve. **Graphite** (pencil leads) is also inert and cheap, but physically fragile and may shed particles. **Screen-printed carbon** is great, but requires fabrication. **Gold or platinum** give the best stability (minimal corrosion/polarization) but are costly and overkill. Given hackathon constraints, stainless steel rods or needles (or small hypodermic needles) are recommended. 

- **Spacing & Area:** The impedance ~ρ·L/A (L = gap, A = area) for a parallel-plate model. Larger spacing (L) or smaller area (A) increase impedance (making changes more noticeable), but also weaken the signal (smaller current). We should use moderate gap (~5–10 mm) and a few cm² area. For example, two stainless steel plates 10×10 mm separated by 5 mm yields an impedance easily in the kΩ–MΩ range in bacterial medium.  If too large, current will be too small to measure accurately. 

- **Effect of geometry:** Bringing electrodes closer (small L) lowers impedance, which can reduce ΔZ signal fraction. Very large electrodes (large A) lower impedance too. In general, **narrower gaps and smaller electrodes** give higher baseline impedance (more sensitivity to small changes), but also higher noise. We recommend a moderate volume well (e.g. 1–2 mL in a cylindrical container ~20 mm diameter), with flat electrodes on opposing sides.  

- **Polarization effects:** Larger electrode area increases double-layer capacitance, worsening polarization at low frequencies. Thus, do not over-size electrodes. Instead, ensure the same polarization on both wells so it subtracts out. 

- **Sample volume:** A volume of ~1–2 mL per well is practical (fits on breadboard wells or small beakers). Enough for bacteria to grow but small enough for the electrodes. 

- **Well design:** Use two identical wells (e.g. two identical small glass vials or 3D-printed chambers) mounted on the breadboard. Insert electrode pairs symmetrically (same depth). Ensure no air bubbles. 

- **Uniformity:** Control and Test electrodes must be as identical as possible (same material, size, placement) so that any static offset (electrode polarization, surface fouling) is common-mode and canceled in ΔZ.  

**Prototype geometry:** A simple cheap build: For each well, take two stainless needles (~1 mm dia) mounted vertically in a small container (e.g. a cut plastic tube) ~1 cm apart. Clamp or epoxy them at the top to fixed spacing. Or use metal clips on a breadboard to hold thin stainless strips. Use identical geometry for both wells. Calibrate spacing (e.g. 5 mm gap) and area. Fill wells with solution so electrodes are submerged ~5 mm deep. This is easy to assemble and reproducible. 

## Control vs Test (Differential Measurement)  
The proposed differential impedance ΔZ = Z_test – Z_control is central. This helps by **removing common-mode variations**: changes in medium conductivity (e.g. temperature or evaporation affecting both wells), supply voltage drift, or electronic offsets that affect both channels. For example, if ambient temperature rises, conductivity in both wells rises; taking a difference cancels most of this trend. Thus ΔZ primarily reflects the effect of the antibiotic.  

**Suppressed errors:** Common-mode drift (T, humidity), static electrode polarization (if identical electrodes), supply/ADC offset, and even some biological noise (if it affects both wells equally, e.g. evaporation). 

**Unsuppressed errors:** Any mismatch between wells (different electrode surface area, slight volume differences, or differential bacterial loading) will appear in ΔZ. Electronic noise (e.g. ADC quantization) is not common-mode and so adds to ΔZ noise. Also, measurement timing skew (if control and test are read sequentially in time) can introduce error if the impedance is changing. Finally, if the antibiotic solution itself has conductivity different from water (it might, at high concentration), this creates an offset not canceled by subtraction.

**Subtraction domain:** We must choose whether to subtract raw complex impedances or derived quantities. Ideally, one subtracts raw **real and imaginary** parts: ΔR = R_test–R_ctrl, ΔX = X_test–X_ctrl, then compute magnitude if needed. This preserves linearity. Subtracting magnitudes |Z_test|–|Z_ctrl| is simpler but loses sign information and is non-linear (if one value is slightly negative). Since AD5933 gives R and X, use those. 

**Best representation:** Likely the **real (resistive) component** difference is most intuitive (bacteria mostly change conductance). However, membrane effects show up in the reactive part (capacitive) and in phase. If feasible, compute ΔR and ΔX. For a single metric, computing the change in magnitude Δ|Z| = |Z_test|–|Z_ctrl| may suffice, but only if both Z are measured at the same frequency. iFAST found “electrical opacity” (a phase ratio) useful, but PHENORA’s bulk ADC may not measure phase accurately. 

In summary, we recommend: **Compute ΔR and ΔX** if using AD5933. For simplicity, use |ΔZ| = √(ΔR²+ΔX²) as a single feature for the algorithm (this combines effects). Subtraction should occur **before** any nonlinear transformations.

## Biological Validation (Future Work)  
Because we lack lab validation now, we propose a **supervised biological plan** for later stages (not done at hackathon).  

1. **Strain choice:** Use a well-characterized, non-pathogenic bacterium. *Escherichia coli* K12 (BSL-1, widely used) is appropriate. It grows robustly and its AST profile is known. Alternatively, *Bacillus subtilis* or a *Staphylococcus* (like *S. aureus* RN4220) could be used for Gram-positive data. K12 E. coli is simplest to find and handle.  

2. **Antibiotic choice:** Choose a bactericidal antibiotic with clear effect. A β-lactam like Ampicillin or Meropenem (rapid lysis) or a membrane disruptor like Polymyxin/Colistin. A static antibiotic (e.g. Tetracycline) is easier to interpret but slower. For an MVP demonstration, Ampicillin at high concentration (several ×MIC) often kills E. coli within 30–60 min.  

3. **Controls:** Mandatory controls include (a) *blank medium* (no bacteria, no drug) to baseline the wells; (b) *bacteria without drug* (growth control); (c) *drug only* (medium+antibiotic, no bacteria) to check if the drug alters impedance by itself (some antibiotics are ionic); (d) *killed bacteria control* (e.g. heat-killed) to see impedance of non-viable cells. The main experimental pair is *bacteria+drug* vs *bacteria only* (differential AST).  

4. **Reference AST:** Perform a gold-standard broth microdilution or automated MIC assay in parallel to classify susceptibility. For example, measure MIC of Ampicillin for the chosen strain. Use CLSI methods (at least 3 biological replicates) to get an MIC value.  

5. **Comparison:** Plot PHENORA’s ΔZ(t) curves alongside optical density or colony count. Determine if the moment PHENORA stops correlates with “no visible growth” by standard AST. Evaluate categorical agreement (Susceptible/Resistant) with the reference test.  

6. **Replicates:** For statistical validity, use at least 3 independent cultures for each condition (per antibiotic concentration).  

7. **Confounders:** Track temperature (keep 37 °C incubation). Minimize evaporation (tight lids). Avoid bubbles (degassed media, careful pipetting). Maintain the same inoculum density (e.g. 10^6 CFU/mL). Any electrode fouling (biofilm) could appear if multiple hours; perhaps shorten test to <2 h to avoid.  

8. **Differentiating phases:** If PHENORA measures continuously, ensure the “antibiotic response” is captured within the test window. Some antibiotics take hours to act; choose a short-acting one or accept that sensitive detection may not be immediate.  

**Hackathon vs Validation vs Clinical:**  
- **Hackathon (Electrical Demo):** Use inert loads (resistors/capacitors) or food-grade bacteria (e.g. yeast) to mimic signals. Do NOT culture pathogens. Show the FPGA logic working and ΔZ filtering on test circuits.  
- **Supervised Validation (Lab):** Under proper biosafety, run the above experiments with E. coli and Ampicillin (or other). Analyze results offline.  
- **Clinical Workflow (Future):** Patient blood → blood culture bottle → positive flag → centrifuge/lysis to remove blood cells → resuspend bacteria in buffer → PHENORA test (pharma dilutions) → impedance readout → AST result. At no point would PHENORA test raw whole blood (blood interferes heavily with impedance).

## iFAST Diagnostics – Deep Analysis  
**iFAST** (Abid *et al.*, *Nat. Comm.* 2020) is a microfluidic single-cell impedance AST platform. Its sensing principle is *flow cytometric impedance*: each bacterium flows past two pairs of electrodes in a 20×40 μm channel. iFAST uses two frequencies: ~5 MHz for volume (|\*Z\*|) and 40 MHz for cell-envelope (capacitance), plotting each cell’s “electrical size” vs “opacity”. 

- **Sensing principle:** Coulter effect plus dielectric spectroscopy at single-cell level. 
- **Frequency:** 5 MHz and 40 MHz. 
- **Microfluidics:** PDMS chip with flow focus, two detection regions. 
- **Single-cell measurement:** Yes, ≈1000 cells/s, over ~3 minutes. ~5000 cells sampled per test. 
- **“Electrical radius”:** They compute (|Z|)^(1/3) as a proxy for cell diameter. 
- **Opacity:** Ratio of high-freq to low-freq signal; indicates membrane/cell-wall effects (loosely, how “hollow” the cell looks electrically). 
- **Membrane integrity:** A leaky membrane causes reduced opacity and apparent size. iFAST interprets drops in opacity as membrane damage.  
- **Antibiotic exposure:** Bacteria are pre-incubated 30–60 min with antibiotic at clinical breakpoint, then diluted ~10^5 cells total per run. 
- **Control:** They add 10 μm calibration beads in each sample. They also always compare to a no-antibiotic control scatter plot.  
- **Signal processing:** They collect a 2D scatter of (electrical radius, opacity) for ~5000 cells. Antibiotic-susceptible bacteria cluster shifts off the original “viable contour” over time. The fraction of cells still in the original gate is a measure of viability. 
- **Decision:** They define an *electrical MIC* by testing multiple drug concentrations and finding where the population vanishes. Essentially a population count difference metric. 
- **Time-to-result:** Claims are ~30 min for antibiotic incubation + <1 min for reading; overall ≈2–3 h including prep for blood cultures. 
- **Organisms/Antibiotics:** Validated on Gram-negatives (E. coli, K. pneumoniae, A. baumannii, P. aeruginosa) with drugs like meropenem, gentamicin. Clinical tests on 80 UTI isolates (enterobacterales) gave ~93% concordance. 
- **Clinical validation:** They have UKCA (CE) approval for Gram-negative isolates and claim consistent accuracy under 3 h. They also mention ~74/80 agreement in UTIs. 
- **Limitations:** iFAST requires microfluidics, precise beads, and high-frequency electronics (many MHz). It only measures single cells (complex hardware) and is limited to bacteria present in positive blood cultures or isolates. It does *not* test blood directly. It currently targets Gram-negatives; it is also relatively expensive (~£30/test but still less than traditional methods).  
- **Hardware complexity/cost:** The microfluidic chip plus high-speed FPGA/ADC/digital processing is nontrivial. Oxford Instruments technology. Likely cost >>₹50k per reader (they mention “less than £30 per sample” so reagent cost, but reader cost probably 10s of thousands USD). By contrast, PHENORA V1 is envisioned as a DIY breadboard device under ₹10k.  

**iFAST vs PHENORA – Borrowable ideas:**  
- Both use **impedance changes** to infer AST status. iFAST proves that impedance can reveal antibiotic effects *in principle*. PHENORA can legitimately say “we are inspired by iFAST’s finding that antibiotic exposure changes an impedance-based electrical phenotype of bacteria”. The concept of using electrical phenotype (resistance/capacitance) as AST is validated by iFAST’s results.  
- The idea of a **control vs test comparison** is common (iFAST uses control scatter vs test scatter). 
- iFAST also processes raw impedance signals into a classification (susceptible/resistant), showing that with enough signal processing one can output AST categories quickly. PHENORA can borrow this goal.  

**iFAST vs PHENORA – What cannot be claimed:**  
- PHENORA cannot claim single-cell sensitivity, MHz frequencies, or 2D “electrical cytometry” as in iFAST. Bulk wells cannot count individual bacteria or measure cell-size distributions.  
- iFAST’s clinical and regulatory validation (CE-mark, patient data) does *not* carry over to PHENORA. We cannot cite iFAST’s speed or accuracy as evidence for PHENORA.  
- PHENORA must acknowledge it is a much simpler, earlier-stage system: it cannot match iFAST’s performance (e.g. minute-level measurement, universal ID/AST, microfluidic cartridge).  
- Also, any claims about how PHENORA “works biologically” must be substantiated. iFAST suggested membrane integrity changes, but PHENORA has not shown that. 

## RapidDX Technologies – Deep Analysis  
**RapidDx** (Bengaluru startup) offers **rPASA™**, a rapid AST (5–6 h) for UTIs and ESKAPE pathogens. Their principle reportedly combines **microfluidics and sensor arrays**, possibly involving lytic phages (based on external clues) but details are sparse. From their materials:  
- **Sensing principle:** Unspecified; they mention a “patented sensor” and microfluidic chip. Some public hints suggest they may use impedance changes upon phage-induced lysis (which is electrical detection of metabolic changes).  
- **Sample prep:** They claim “no pathogen isolation required”, implying they can handle mixed or low-density samples (e.g. unprocessed urine). They boast “no McFarland needed, no sample prep”. For blood, presumably they’d start from a culture.  
- **Technology:** They emphasize “mechatronics, microfluidics, data analytics”. Possibly an incubator + sensor combo. They tout “multiplexing”, “fully automated” results in ≤5 h.  
- **Validation:** Limited public data. They were selected for an AIT program in India. No known publications. They have an **AST Merge** data tool (Antibiogo link) but that’s about interpretation, not technology.  

**Comparison:** RapidDx is an Indian solution but does not appear to use impedance spectroscopy explicitly (no mention of electrodes). It likely monitors growth by some biosensor (maybe pH or optical).  
- PHENORA vs RapidDx: Both aim for <6 h AST. PHENORA (impedance) vs RapidDx (some unknown sensor). RapidDx may not use FPGA or adaptive logic; likely a fixed incubation.  
- RapidDx appears less mature (no CE/FDA, just early selection).  
- PHENORA’s advantage: conceptual novelty (adaptive measurement). RapidDx advantage: possibly simpler (non-electrical) detection.  

## Competitor Landscape  
We catalog leading rapid-AST players (summary): 

| Competitor         | Tech (AST principle)              | Sample           | Measurement   | Time-to-result   | Targets        | Hardware complexity | Status             | Strength                 | Weakness           |
|--------------------|-----------------------------------|------------------|---------------|------------------|----------------|---------------------|--------------------|--------------------------|---------------------|
| **iFAST Diagnostics** | Microfluidic impedance cytometry | Positive blood culture / isolates | Impedance (single cells) | <3 h (Gram–) | Gram-negative | Microfluidic chip + electronics | UKCA-certified | Truly rapid (mins), single-cell detail | High complexity, Gram– only |
| **RapidDx (rPASA)**  | Microfluidic sensor array (likely colorimetric/impedance) | Urine (UTI), likely blood culture | Unclear (sensor)   | ~5 h (claims) | UTI pathogens, ESKAPE | Microfluidic cartridge (early prototype) | In development (demo data) | No sample prep, India focus | Lower TRL, unproven |
| **Q-linea (ASTar)**   | Microcolony imaging (optical turbidity)    | Blood culture or isolates | Optical (imaging) | ~3 h (some resistance reports) | Broad (Gram±) | Automated incubator + optical reader | CE-IVD (Sweden)    | Moderate speed, high throughput | Still needs >millions cells growth, cost |
| **QuantaMatrix (dRAST)** | Time-lapse microscopic AST on agar in microfluidic array | Direct from positive blood culture | Optical growth in gel | 4–7 h (median ~6.7 h) | Gram± | Complex incubator with CCD camera | CE-IVD (Korea)     | As low as 4 h for AST | Specialized consumables, high cost |
| **Accelerate Diagnostics (Pheno)** | Automated microscopy + FISH identification | Direct from positive BC | Optical (morphology + fluorescence) | ~7 h for AST | Broad Gram–/Gram+ | Large bench-top system | FDA-cleared (US) | ID+AST in one system, robust data | 8–12 h turnaround, expensive |
| **bioMérieux (VITEK REVEAL)** | Automated broth dilution in miniaturized wells | Positive blood or isolates | Turbidity | 5–6 h（Gram–) | Gram– (88% S/R call) | Simple card reader | FDA-cleared, CE | Fast than Phoenix, easy use | ~6 h (slower than novelty tech) |
| **BD Phoenix**     | Automated broth microdilution (OD) | Isolates | Optical density | 16–24 h (standard) | All common | Benchtop analyzer | Widely used (FDA) | Reliable, established | Too slow for “rapid” |
| **Pattern Bioscience** | Single-cell metabolic assay (fluorescent sensors) | Urine, swabs | Fluorescence | 4–6 h (ID+AST) | Broad | Novel microfluidics+chips | CLIA waiver (EUA) | Very fast, no culture | New, mostly for UTIs |
| **T2 Biosystems**  | NMR (molecular detection, not AST) | Whole blood | Magnetic resonance | N/A (ID only) | Pathogen DNA | Specialized equipment | FDA-cleared for Candida | Direct-from-blood ID | Not AST, narrow panel |
| **Antibiogo (MSF app)** | Cloud AST interpretation tool | Any lab AST data | Software | NA | Any | Smartphone/tablet | Deployed in low-resource labs | Facilitates reporting | Not an AST test per se |

**Direct competitors (impedance AST):** Only iFAST and maybe RapidDx (if it indeed uses electrical sensing). The rest use different modalities (optical, biochemical).  

**Indirect:** Q-linea, QuantaMatrix, Accelerate, bioMérieux – they all deliver faster AST results than conventional but none match <1 h. They are mostly already commercial, showing the market is crowded with “2–8 h” AST systems. PHENORA would be unique if it truly delivered *adaptive sub-hour AST*, but that is unproven.  

**Future:** Companies like **Oxford Nanopore** (sequencing-based rapid AST), **OpGen** (MALDI markers), or **Chimera** (minimally instrumented AST) could be rivals in new tech. Also academic startups (e.g. dropDx for sepsis) are emerging.

## Prior Art / Patent Analysis  
We searched patents and literature for *adaptive/closed-loop impedance AST*. Known AST patents and papers cover impedance-based AST (e.g. iFAST patents) or microfluidic AST, but **none mention an adaptive measurement loop or real-time confidence scoring**. A patent WO2020058682 (Abid *et al.*) covers impedance flow cytometry AST, but it assumes fixed measurement durations. We found no patent on “stopping measurement based on signal confidence”.  

A keyword search (e.g. “adaptive impedance spectroscopy antimicrobial” or “closed-loop AST”) yielded nothing relevant. (Prior techniques in other fields adaptively adjust measurement parameters, but not for AST). 

**Implication:** There is no direct prior art of exactly “impedance → confidence → adaptive decision”. If PHENORA’s novelty is defined as “real-time confidence-driven impedance AST”, it may be new. But broad claims (“impedance AST”) are weak given iFAST and others. A cautious novelty claim: *“An impedance-based AST system incorporating a real-time confidence metric to terminate measurements adaptively.”* is not obviously anticipated. Nevertheless, the team should note that adaptive experiment design is known in statistics, so patent claims should emphasize the combination (impedance + AST context + specific confidence logic).

## FPGA Architecture (Lattice iCE40UP5K)  
A practical FPGA design on the iCE40UP5K (5K LUTs, 4 DSP blocks, 132 kbit RAM) might be:  

- **Input Interface:** SPI or UART to receive R/I data from Heltec or AD5933. If AD5933 is used via Heltec, Heltec can send each measurement pair (Re,Im) serially. We allocate I/O pins for SPI (MISO/MOSI/SCLK/CS) if reading directly, or UART Rx from Heltec at ≥115200 baud.  
- **Buffer:** A small block RAM to store a sliding window of the last N samples of ΔR and ΔX (e.g. N=64). This allows moving-average filtering and slope calculation. 64–256 samples * 32 bits (2×16-bit values) ~ 4–8 kbit, within BRAM.  
- **Fixed-point:** Use signed 16-bit for Re and Im (the AD5933 outputs 27-bit, but we can scale/round). Represent voltages/resistances in Q1.15 format or similar.  
- **Filtering:** Simple digital low-pass or moving-average filter (to reduce high-frequency noise) – e.g. a 4-sample FIR (tiny delay line + add/shift). Each tap can be implemented with DSP multipliers.  
- **Magnitude Calculation:** If needed, compute |ΔZ|=sqrt(ΔR²+ΔX²). A CORDIC or quadrant-approximation can be done with DSPs: use one DSP to multiply ΔR^2 + ΔX^2, then a lookup or iterative sqrt. However, sqrt is heavy on iCE40 (no hardware sqrt). For a hackathon MVP, one could output ΔR, ΔX directly (via UART) and do magnitude off-chip. On-FPGA, as a compromise, approximate |ΔZ| ≈ |ΔR|+|ΔX| (overestimate).  
- **Differential:** Subtract control from test: ΔR = R_test - R_ctrl; ΔX similar. Do this as soon as data arrives.  
- **Slope:** Compute discrete derivative: slope = (ΔZ[n] – ΔZ[n–k]) / k (for some lag k). On FPGA, implement as (currentΔR - oldΔR) and same for X, using the BRAM as delay line. Or simpler, just compare adjacent samples for sign.  
- **Noise Estimator:** Compute running variance of ΔZ (or of ΔR). For example, maintain a sum of squares and a sum (for N samples) and compute σ² = (sum(x²) - sum(x)²/N)/N. This needs a few multipliers (DSP) and accumulators. Alternatively, estimate noise as the absolute recent change: noise ≈ |ΔZ[n] - ΔZ[n-1]| averaged.  
- **Confidence Engine:** Implement `confidence = |ΔZ| / (noise + ε)`. Avoid real division by comparing |ΔZ|*K ? (noise). For a threshold check, do `|ΔZ| > K * noise`. That avoids heavy division. Choose K (e.g. 3) as the significance level.  
- **Stability Detector:** Count how many consecutive samples have low slope (|slope|<tolerance) – if a count reaches M (say 10 samples), we call it stable.  
- **Adaptive FSM:** A state machine with states {MEASURING, EVALUATE, STOP}. While measuring, stream ΔZ into filter, compute features. Periodically (every sample) evaluate confidence: if confidence ≥ threshold and slope ≈ 0 for N_samples → go to STOP. If confidence < threshold → stay. Possibly include a maximum time guard (after which we stop anyway and call outcome).  
- **Output Interface:** UART or GPIO to send final result (“STOP” or “CONTINUE”) and maybe numeric ΔZ. Also could drive an LED or GPIO pin. UART lines can connect back to Heltec or PC.  

**Resource use:**  Four DSP blocks can handle multiply-adds (e.g. squaring). BRAM ~4–8kbit. LUTs for logic and simple ALUs. Overall should fit in UP5K (5280 LUTs). The iCE40UP5K-EVB board can be clocked at a few MHz easily. 

This is a **rough architecture**. It **does not require** floating-point, only fixed operations. The biggest arithmetic load is possibly magnitude or division, which we avoided with comparisons. If division is needed, implement a CORDIC or iterative shift-subtract, but likely too slow on iCE40. Keeping it simple is advisable.

## Adaptive Measurement Algorithm  
We propose a basic sequential algorithm: let Δ[n] = ΔZ at sample n (scalar magnitude or one component). Let σ[n] be estimated noise. Define **confidence** C[n] = |Δ[n]| / (σ[n]+ε). For implementation ease, instead of actual division, the FPGA can check if |Δ| > γ·σ (for a constant γ, e.g. 3) – this is effectively confidence > γ. 

Pseudocode:  
```
n = 0; stable_count=0;
while (n < N_max) {
  read new Δ[n];
  update slope = Δ[n]-Δ[n-1];
  update noise estimate σ[n];
  compute C[n] ≈ |Δ[n]|/(σ[n]+ε);

  if (C[n] >= C_thresh && |slope| < slope_thresh) {
     stable_count++;
     if (stable_count >= M) then { decision = STOP; break; }
  } else {
     stable_count = 0;
  }
  n++;
}
if n==N_max then { decision = STOP anyway; }
```
- `C_thresh` and `slope_thresh` are set a priori (e.g. C_thresh=3, slope_thresh small). 
- If confidence is low, we **do not stop** and continue measuring. If confidence is high but slope is still changing, we also keep measuring until it settles. Only after *M consecutive stable points with high confidence* do we stop and declare outcome.

**Evaluation:** This is essentially a **threshold-based SNR test**. It assumes ΔZ is normally distributed around 0 for no effect, so a high |Δ| relative to noise indicates a true effect (like a z-test). It is *ad hoc* but simple. More sophisticated alternatives exist:  
- **Sequential Probability Ratio Test (SPRT):** Compares two hypotheses (e.g. S vs R) by accumulating likelihood ratio. Statistically optimal but requires modeling distribution of ΔZ (unknown). Hard to implement on iCE40.  
- **CUSUM (Cumulative sum):** Detect a shift in mean; could catch sudden jump in ΔZ. More robust, but again complex to tune.  
- **Bayesian updating:** Estimate probability of S/R as data come in. Not feasible in FPGA without floats.  
- **Change-point detection:** Algorithms exist (GLR test), but heavy.  

Given iCE40 constraints, the simple SNR threshold is easiest. We note its limitations: it may trigger early on spurious noise peaks (false positive). Requiring *multiple consecutive stable* points mitigates single spikes. Conversely, if antibiotic effect is slow, the algorithm might never reach “confidence” and keep running until timeout. In such cases, the system would fail to detect a subtle effect. Without ground truth, we cannot tune it fully. 

## What is Novel?  
We propose three novelty statements:  
- **(A) Conservative claim:** *“PHENORA introduces an adaptive impedance-based AST method where the measurement time is not fixed in advance but instead is determined in real-time based on a confidence metric computed from the impedance data. By stopping measurements as soon as sufficient evidence is gathered, PHENORA potentially reduces time-to-result compared to fixed-duration assays.”*  
- **(B) Hackathon pitch claim:** *“PHENORA is the first rapid AST device that ‘learns’ when to stop measuring. Instead of waiting a set time, it continuously analyzes the impedance signal and stops the assay the instant it’s sure of the result. This cutting-edge feedback loop gives immediate AST decisions, unlike any existing system.”*  
- **(C) Patent-style claim:** *“A method for antibiotic susceptibility testing comprising: obtaining continuous impedance measurements of a sample and control well, computing at least one feature from the differential impedance signal (ΔZ), calculating a confidence score from this feature (e.g., ratio of signal magnitude to noise), and adaptively terminating the test when the confidence exceeds a threshold. The method thereby adaptively decides STOP vs CONTINUE in real time.”*  

**Prior-art weakening:** We found no prior art on *adaptive impedance AST*. However, since impedance AST itself is known (iFAST et al.), the novelty must hinge on the adaptive decision layer. Broad claims (“impedance AST”) are invalid; our claim should emphasize *real-time adaptivity*. If any patent examiner finds similar concepts (e.g. **sequential analysis** in lab tests), we’d narrow to the context of impedance measurement and on-chip confidence logic. Without discovered prior art, we can cautiously assert novelty as “confidence-driven impedance sensing for AST.” Still, thorough IP counsel would be needed. (If needed, limit claim to “stop or repeat measurement based on impedance-derived confidence score,” not claiming the entire AST concept itself.)

## Experimental Validation Plan  
We outline a staged plan (Stage 0–8) with clear criteria. Each stage builds from pure electronics to full clinical samples.

- **Stage 0: Resistor calibration.**  
  - *Objective:* Verify electrical front-end and FPGA math.  
  - *Input:* Known discrete resistors (1 kΩ, 10 kΩ, 100 kΩ) in place of wells.  
  - *Measurement:* Impedance of each resistor across planned frequency range.  
  - *Expected:* Measured |Z| should match theoretical R (±5%).  
  - *Failure:* If error >10%, front-end miswired/calibration wrong.  
  - *Success:* Accurate R measurement at each freq (implement calibration constants).  
  - *Data to save:* Measured vs actual R values, noise floor.  

- **Stage 1: Conductivity standards.**  
  - *Objective:* Check response to known ionic solutions.  
  - *Input:* Salt solutions of known conductivity (e.g. 0.1 M, 0.2 M KCl).  
  - *Measurement:* Impedance vs frequency.  
  - *Expected:* Higher salt → lower R_s (linearly).  
  - *Fail:* Non-linear or noisy results.  
  - *Success:* Consistent scaling with ionic strength.  
  - *Data:* Z(f) curves, linear fits to conductivity.  

- **Stage 2: Synthetic differential test.**  
  - *Objective:* Test ΔZ measurement.  
  - *Input:* Two static channels: one fixed R (control), one switchable to R + ΔR (test). For example, use two 10 kΩ resistors, occasionally swap in 11 kΩ for test.  
  - *Measurement:* Continuous ΔZ(t) when switching.  
  - *Expected:* ΔZ steps up/off by ΔR immediately upon switch. FPGA should detect slope.  
  - *Fail:* If ΔZ cannot be resolved or is noisy.  
  - *Success:* Clear detection of known ΔR.  
  - *Data:* Time-series of ΔZ, slope output.  

- **Stage 3: Non-pathogenic biological mimic.**  
  - *Objective:* Simulate biological variability without live pathogens.  
  - *Input:* A suspension of inert particles (e.g. polystyrene beads in saline) in both wells; then add conductive ions to one well to mimic “growth”.  
  - *Measurement:* ΔZ after adding (analog of bacterial effect).  
  - *Expected:* Before addition, ΔZ≈0. After addition, ΔZ changes and remains stable.  
  - *Fail:* No significant ΔZ.  
  - *Success:* Detectable ΔZ caused by known perturbation.  
  - *Data:* ΔZ vs time after “antibiotic” event.  

- **Stage 4: Single organism, single antibiotic.**  
  - *Objective:* Test with real bacteria under supervision (if possible) or biologically inert analog.  
  - *Input:* A model species (e.g. heat-killed *E. coli* in saline) in control and same plus an antibiotic (e.g. Ampicillin) in test. (Without growth, this is borderline – better is stage 5.)  
  - *Measurement:* ΔZ over time (hours).  
  - *Expected:* If antibiotic lyses cells, ΔZ should evolve. If static, ΔZ~0.  
  - *Fail:* Hard to see effect if no metabolism.  
  - *Success:* As proof of concept, static vs “killed” difference.  
  - *Data:* ΔZ curves, note if stability reached.  

- **Stage 5: Dose-response.**  
  - *Objective:* Vary antibiotic concentration to confirm dynamic range.  
  - *Input:* Same organism, but test well has serial dilutions of drug (0×, 0.5×, 1×, 2× MIC).  
  - *Measurement:* ΔZ for each concentration in parallel runs.  
  - *Expected:* At 0×, high growth → large ΔZ after some time. At ≥MIC, little growth → small ΔZ. Intermediate shows graded response.  
  - *Fail:* All concentrations look the same, or noise dominates.  
  - *Success:* Observe a consistent trend in ΔZ magnitude or time to reach threshold vs concentration.  
  - *Data:* ∆Z vs time for each dose, compared to known MIC endpoints.  

- **Stage 6: Reference AST comparison.**  
  - *Objective:* Compare PHENORA result with standard AST.  
  - *Input:* Live culture + antibiotic as in Stage 5.  
  - *Measurement:* Final decision (S/R) from PHENORA vs MIC from CLSI broth dilution.  
  - *Expected:* Concordance in classification (≥90%).  
  - *Fail:* Disagreement on two or more antibiotics/strains.  
  - *Success:* High categorical and essential agreement.  
  - *Data:* Confusion matrix of results.  

- **Stage 7: Multiple strains/species.**  
  - *Objective:* Test robustness across bacteria.  
  - *Input:* Other non-pathogenic strains (e.g. *S. aureus*, *Pseudomonas* lab strain).  
  - *Measurement:* ΔZ as above.  
  - *Expected:* Similar detectability patterns. Possibly Gram+ produce different profiles (smaller cells).  
  - *Fail:* Only one species works.  
  - *Success:* PHENORA can at least categorize two different strains.  
  - *Data:* ΔZ curves for each.  

- **Stage 8: Clinical samples (future).**  
  - *Objective:* End-to-end test on real samples (assuming lab collaboration).  
  - *Input:* Positive blood culture bottles (inactivated per safety) or clinical isolates.  
  - *Measurement:* PHENORA result vs hospital’s reported AST.  
  - *Expected:* Good agreement for chosen antibiotic panel.  
  - *Fail:* Inconclusive or high error rate.  
  - *Success:* Validate PHENORA’s practical utility.  

Each stage has clear success criteria. The important point is **separating electrical validation (Stages 0–2)** from **biological (Stages 4–8)**. The hackathon should focus on Stage 0–2; any Stage 3+ would require lab and biosafety. 

## Failure Mode Analysis (FMEA)  
We identify key failure modes, causes, and mitigations:

- **Electrode Polarization:** *Cause:* Low-frequency double-layer capacitance. *Detection:* Non-zero imaginary part at start; frequency-sweep anomaly. *Impact:* Falsely high impedance at low freq. *Mitigation:* Avoid using <100 Hz; always use two-electrode diff so interface largely cancels. Possibly apply a DC bias or higher AC amplitude to reduce polarization.  

- **Electrode Variation (material/area):** *Cause:* Unequal electrodes in wells. *Detection:* Non-zero ΔZ at t=0, or drift. *Impact:* Creates systematic offset; may mimic antibiotic effect incorrectly. *Mitigation:* Use identical electrodes (same stock). Calibrate by swapping wells (test/control) to ensure symmetry. Use clones of parts (stainless from same batch).  

- **Temperature drift:** *Cause:* Incubator warming or lab variation. *Detection:* Slowly changing impedance in both wells. *Impact:* Could cause false slope or offset. *Mitigation:* Perform test in temperature-controlled environment; differential measurement removes common shift. Include a temp probe and record T for post-correction if needed.  

- **Medium conductivity changes:** *Cause:* Evaporation, precipitation, pH shift. *Detection:* Control well shows drift. *Impact:* Can mask small bacterial effect. *Mitigation:* Use closed lids to minimize evaporation; perform fast measurements (limit hours). Ideally maintain constant stirring or gentle mixing.  

- **Antibiotic conductivity:** *Cause:* Some drugs are ionic. *Detection:* Test well baseline ΔZ ≠ 0 even before bacteria grow. *Impact:* Could be misinterpreted as bacterial effect. *Mitigation:* Measure “antibiotic-only” control; subtract any static offset from ΔZ calculation.  

- **Sample concentration error:** *Cause:* Inoculum pipetting or dilution mistakes. *Detection:* Variability between runs. *Impact:* Hard to compare experiments. *Mitigation:* Standardize inoculum density (e.g. McFarland 0.5) and mix thoroughly. Use spectrophotometer if available.  

- **Instrumental noise:** *Cause:* Electrical interference, poor connections. *Detection:* High-frequency jitter on ΔZ. *Impact:* Reduces confidence; false positives. *Mitigation:* Short wires, shielding, decoupling caps on power, analog filtering. On FPGA, use moving-average or filter.  

- **FPGA quantization/dynamic range:** *Cause:* Too few bits. *Detection:* Rounding errors, saturation (ΔZ stops increasing). *Impact:* Accuracy loss in ΔZ, slope. *Mitigation:* Use full 16-bit for AD5933 data; scale values if needed. Check FPGA math range to avoid overflow.  

- **ADC saturation (discrete front-end):** *Cause:* Too large input to ADS1115. *Detection:* ADC reading pegged at ±full-scale. *Impact:* Loss of signal dynamics. *Mitigation:* Adjust gain (ADS has PGA) or input resistor. Stay within ADC range.  

- **Timing mismatch:** *Cause:* Control and Test read sequentially with changing signal. *Detection:* Small offset when swapping control/test. *Impact:* Apparent ΔZ even if identical. *Mitigation:* Read test and control as close together in time as possible (interleave). Timestamp or compensate known lag.  

- **Biological variability:** *Cause:* Cell clumping, uneven distribution. *Detection:* Irreproducible ΔZ patterns across replicates. *Impact:* Low confidence in any result. *Mitigation:* Vortex samples, use consistent mixing. Possibly embed beads for stirring.  

- **False confidence (Type I):** *Cause:* Random noise spike triggers confidence threshold. *Detection:* Algorithm stops early but next replicates differ. *Impact:* False susceptible call. *Mitigation:* Require multiple consecutive points; set threshold conservatively.  

- **False stop:** *Cause:* Confidence threshold too low or noise misinterpreted. *Detection:* Stopping before true effect manifests. *Impact:* Missed detection of resistance. *Mitigation:* Validate threshold in pilot tests; err on side of longer measurement.  

- **False repeat (Type II):** *Cause:* Threshold too high; alg never reaches criteria even when infection is susceptible. *Detection:* Unnecessary long measurement. *Impact:* Slower than needed. *Mitigation:* Acceptable vs false-stop trade-off; tune threshold.  

Rank (example severity 1–5): Electrode variation (4), false stop (5), noise (4), polarization (3), ADC issues (3), biological variances (3), FPGA quant (2).

## Bill of Materials (BOM, INR)  
**Essential:**  
- **VSDSquadron FPGA Mini** – ₹3,000 (already owned)  
- **Heltec WiFi Kit V3 (ESP32)** – ₹1,000 (owned)  
- **AD5933 Impedance Module** – ~₹1,500 (or chips ~₹2,500 on DigiKey)  
- **Calibration resistors** (1 kΩ, 10 kΩ, 100 kΩ, 0.1% metal film) – ₹50 each (or buy 6-in-1 kits)  
- **Electrodes (Stainless steel 316 rods/needles)** – ₹200 (2 needles ₹50 each; ₹100 buffer)  
- **Sample containers (well plates, tubes)** – ₹200 (2 small beakers or PCR tubes)  
- **Breadboard + jumper wires** – ₹500  
- **Power supply / cables** – ₹300 (5 V regulator or adapter)  
- **Misc:**  PCB perfboard / double-sided tape – ₹100  

**Optional:**  
- **ADS1115 ADC module** – ₹150 (if pursuing discrete front-end)  
- **NE555 & LM358 ICs** – ₹50 (each ~₹5)  
- **BNC connectors / coax cables** – ₹200 (if low noise needed)  
- **Temperature sensor (DS18B20)** – ₹100 (for drift monitoring)  

**DO NOT buy (for MVP):** expensive instrumentation (e.g. bench LCR meter), microfluidic pumps, lab incubator (use ambient), gold electrodes, custom PCBs.  

Total essential BOM ≈ **₹3,000–4,000** (not counting already owned board modules). Keep it minimal: e.g. focus on AD5933 module, resistors, wires, two identical electrode sets.

## 48-Hour Hackathon Plan  

**DAY 1 (Today):**  
- **Person 1 (Lead):** Finalize detailed project plan & roles. Setup workspace. Order any last-minute parts online (if expedited shipping possible). Review AD5933 datasheet.  
- **Person 2 (Electronics):** Wire up AD5933 module and a reference resistor on breadboard. Test basic I²C communication via Heltec, read impedance of 10 kΩ.  
- **Person 3 (FPGA):** Set up Lattice toolchain (IceCube or Oregano). Write initial Verilog to interface with Heltec: receive two 16-bit values (R_ctrl, R_test) over UART or SPI.  
- **Person 4 (Bio/Controls):** Prepare dummy sample solutions: e.g. saline + KCl, or use water vs salt water. Ensure sterile pipettes. If allowed, prepare a non-pathogenic dye or particle (e.g. agarose beads) to mimic cells.  

*Deliverables by end of Day 1:* Basic AD5933 reading working; simple FPGA code receiving test/control values; a breadboard with resistor network; identified values.  

**DAY 2 (Tomorrow):**  
- **Person 1:** Integrate FPGA state machine: subtract control from test, compute simple slope. Begin drafting slides.  
- **Person 2:** Build two-well test setup: e.g. 10 kΩ in control, 11 kΩ in test. Measure ΔZ and feed to FPGA. Validate subtraction. Calibrate AD5933 at one frequency.  
- **Person 3:** Implement filtering (small moving average) and confidence logic (|Δ| > 3×noise). Test with synthetic data (maybe generate spikes).  
- **Person 4:** Prepare a simple “antibiotic test”: e.g. add extra KCl to the test well after some time to simulate growth (increase conductivity). Record the impedance jump as the “signal.”   

*Deliverables by end of Day 2:* Working demo where control/test resistors start equal, then one changes (simulate effect), and FPGA triggers a “STOP” (e.g. lights LED or prints message). Slides with block diagram, key results.  

**Submission Morning:** Final integration and presentation prep. Ensure a clean demonstration: e.g. one lab member runs a test sequence live, showing ΔZ and the stop decision on a screen or LEDs. Summarize findings in report format. 

*(Note:* Biological experiments are NOT feasible in 48h. Focus on electrical mimic and data processing. Emphasize novelty of “adaptive decision” in the demo.*)*

## Final Recommendation and Assessment  

We score PHENORA V1 on 1–10 scales:

- **Scientific validity:** *4.* The idea that impedance can indicate antibiotic effect has literature support (iFAST, others). But the specific assumption that a short-time confidence threshold yields accurate AST is **highly speculative**. Key assumptions (e.g. that death/lysis changes |Z| quickly) are unproven in bulk.  
- **Engineering feasibility:** *6.* Building a working impedance reader is feasible. AD5933 and FPGA can be wired. Main challenge: ensuring stable, low-noise measurements and implementing the algorithm in 48h. The hardware design is plausible, but success depends on careful analog design (usually tricky on a breadboard).  
- **Biological feasibility:** *3.* Without a lab test, it’s unclear if even a pure susceptible culture will show a measurable ΔZ in minutes or even an hour. Real bacteria are unpredictable. PHENORA faces an uphill battle convincing microbiologists.  
- **Novelty:** *5.* The adaptive twist is novel (as far as we found), but impedance AST itself is not. We should not oversell “new principle” – it’s mostly an algorithmic twist. Patentability seems possible but not guaranteed.  
- **Hackathon demo potential:** *8.* The proof-of-concept (electrical) demo is well within reach. Judges like real data and a working prototype; we can show LEDs or graphs of ΔZ with a clear STOP criterion. The adaptive concept is also dramatic to describe.  
- **Startup potential:** *4.* The rapid AST market is large, but incumbents and newer platforms (iFAST, Q-linea, etc.) are fierce. PHENORA’s value-add must be proven. Low cost is attractive, but without clear performance advantage, it’s uncertain.  
- **Clinical potential:** *2.* As-is, very low. The path to regulatory acceptance is long. PHENORA’s current claims are far from clinical readiness (no actual blood tests done).  
- **Cost advantage:** *7.* In principle, a simple impedance sensor can be cheap per sample and easy to produce. This could undercut expensive systems if it works. But if multiple frequencies or chips are needed, the advantage shrinks.  
- **Differentiation:** *5.* The “adaptive” approach is a unique selling point but will matter only if it truly speeds up results. Otherwise it’s a nuance. Many rapid-AST companies exist; PHENORA must carve a niche.  
- **Overall risk:** *High (score ~3).* The highest risk is biological: if bacteria don’t yield a clear impedance signature in short time, the whole concept fails. Technical risks (noise, FPGA implementation) are moderate but solvable. IP risk seems low. 

**Answers to key questions:**  
1. **Continue with impedance?** *Yes for hackathon; but only if preliminary tests show any signal. If bulk impedance changes are too weak, consider switching (outside hackathon) to e.g. optical or metabolic readouts.*  
2. **AD5933 or 555+ADS1115?** *AD5933 (Version A),* for reliability and rich data. The discrete approach is too limited and slow.  
3. **FPGA in V1?** *Yes*, as envisioned. It’s feasible to do basic math on iCE40. If time is extremely short, one could use the Heltec (ESP32) MCU instead, but that may not reach desired sampling rates. The FPGA adds “wow” factor if it works.  
4. **Biological experiment (eventual):** *Use a safe lab strain (e.g. E. coli K12) and a known antibiotic (Ampicillin). Conduct a broth microdilution reference AST first. Then run PHENORA on the same strain with and without Ampicillin, measuring ΔZ. Confirm that PHENORA’s classification matches the MIC.*  
5. **Biggest technical risk:** Noise and electrode variability overshadow the subtle signal. If ΔZ due to bacteria is smaller than system noise, the adaptive logic will misfire.  
6. **Biggest scientific risk:** The core assumption that antibiotic effect produces a promptly detectable impedance change. If the mechanism is wrong or too slow, PHENORA will not work at all.  
7. **Biggest novelty/IP risk:** None evident in patents, but a broad “adaptive AST” claim could be challenged. Emphasize our specifics.  
8. **What NOT to attempt now:** *Direct blood testing!* No microfluidics, no smartphone integration, no unproven backend. Focus on basic impedance.  
9. **What would impress?** Demonstrating a real *decision point*: e.g. dynamically showing the device stopping early on a large ΔZ and continuing when ΔZ is small. Or comparing PHENORA’s “time saved” vs fixed-time AST with dummy data. An actual multi-frequency sweep analysis (plotting spectra) would also stand out. Simply “another Arduino impedance sensor” is not enough – we need to highlight the adaptive logic.

## Claims Table  

| **Claim**                                                  | **Evidence**                                                                                                                                                        | **Source**                                      | **Confidence** | **Implication for PHENORA**                                                                                                                                               |
|------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------|----------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Impedance (Z=R+jX) measures ionic resistance & capacitance | Impedance is the complex ratio of AC voltage to current; tissues show frequency-dependent R/X (cells block low-freq, allow high-freq) | [20] (Nat. Sci. Rep. 2021)                      | High (9/10)    | Foundation: PHENORA will measure changes in R (bulk conductivity) and X (membrane effects). Both should be considered in analysis.                                          |
| Cells are insulating at low freq                          | “At low frequency (<1 kHz) currents flow through extracellular fluid”; intact bacteria act as insulators (Coulter principle)           | [20], [30]                                     | High (9/10)    | Bulk bacterial growth should increase low-frequency impedance. Antibiotics that permeabilize membranes will decrease it.                                                    |
| Electrode interface causes errors at low freq              | Two-electrode methods have large electrode impedance at low freq; also see known polarization impedance issues                       | [20], [60]                                     | High (9/10)    | Avoid very low frequencies in V1. Differential design partly cancels this, but we must calibrate and/or skip <1 kHz if using AD5933 (per [60]).                            |
| Bacterial growth lowers impedance (increasing conductance)  | Sci. Rep. 2024: “R_ct decreases with bacterial growth”; iFAST scatter shows growth events shifting signatures                       | [48], [30]                                     | Medium (7/10)  | PHENORA might detect growth as a rising conductance (falling R) signal. This supports using ΔZ slope as a proxy for growth vs kill.                                          |
| Antibiotics affecting membrane change impedance           | iFAST: “Leaky membrane → apparent volume decreases”; clinically, β-lactam swelling changed electrical size                              | [30] (Nat. Comm. 2020)                         | Medium (6/10)  | Membrane-damaging antibiotics could produce a detectable change. However, PHENORA’s frequency range may or may not capture this effect strongly.                             |
| AD5933 inaccurate below ~1 kHz                             | “Measurements at <1 kHz lead to systematic errors (electrode polarization), should use higher freq”                                            | [60] (Sensors 2021)                            | High (8/10)    | Do **not** trust AD5933 data below ~1 kHz. We should adjust V1 protocol to ≥1–2 kHz minimum to be safe.                                                                         |
| Mid/high frequencies probe intracellular signals          | At high freq (>10 MHz) currents pass through cells; iFAST uses 5/40 MHz for intracellular/opacitiy.                                               | [20], [30]                                     | High (9/10)    | PHENORA’s V1 can’t reach tens of MHz. Bulk AST focus will be on ≥1 kHz where some membrane polarization starts but not true intracellular analysis.                       |
| Stainless steel electrodes good for low-freq detection    | *Citation lacking.* (One study noted steel at 100 Hz gave strong bacterial signal; anecdotal in NASA ADS.)                                                    | (No accessible ref)                            | Low (3/10)     | Use stainless steel by default (availability). Justify as inert and inexpensive. Variation in metal likely less critical than geometry.                                     |
| Differential measurement removes common drift             | Standard practice: subtracting control vs test cancels common-mode errors. (Inferred from practice)                                                                  | (General knowledge)                            | High (9/10)    | ΔZ design is sound; ensures temp/drift/electronics affect both similarly and thus drop out of differential signal.                                                          |
| Rapid AST systems (Accelerate, Quantamatrix, Q-linea) exist | Accelerate Pheno: “AST in ~7 h from blood”; QuantaMatrix: “AST in as low as 4 h”; Q-linea: “3h results”.         | [104], [110], [93]                             | High (9/10)    | PHENORA must aim to beat or at least match these times. Our hackathon model is rudimentary, but we cannot ignore these timelines.                                             |
| Whole blood cannot be used directly                       | iFAST and others require positive blood culture first (implying no direct blood use).                                                                         | [86] (company site)                            | Medium (6/10)  | PHENORA should target prepared samples (isolates or cultures). Direct blood testing is *unsupported* and would be highly erroneous.                                           |
| No known adaptive impedance AST prior art                 | Searches (patent/lit) found only fixed-time impedance AST (iFAST etc.).                                                                              | [119] (patent), general search                | Medium (7/10)  | The “adaptive” layer appears novel. However, we cannot rely on it until proven. Emphasize novelty cautiously (“may be patentable”) and differentiate from iFAST.. |
| Impedance as AST proxy is plausible                       | Impedance correlates with cell viability in multiple studies; groups have published AST via impedance.                                 | [30], [48]                                     | Medium (7/10)  | We have enough evidence to justify at least prototyping an impedance AST. The concept has precedent.                                                                          |

All confidence scores are subjective (10 = absolute certainty). We are **skeptical**: key assumptions (especially adaptive logic) are tagged *UNPROVEN* or *EVIDENCE INSUFFICIENT*. Any claim not directly backed by a citation (e.g. electrode material) is treated cautiously. 

