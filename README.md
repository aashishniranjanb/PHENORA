# PHENORA Web Platform & Simulation Engine

This repository hosts the R&D engineering platform for PHENORA, exploring adaptive impedance-based rapid antimicrobial susceptibility testing (AST).

## Directory Structure

```text
PHENORA/
├── docs/                                  # Core design and science documents
│   ├── 01_PROJECT_OVERVIEW.md             # Project hypothesis and status
│   ├── 02_V1_ARCHITECTURE.md              # V1 hardware details
│   ├── 03_BRAND_SYSTEM.md                 # Brand visual guidelines
│   ├── 04_WEBSITE_INFORMATION_ARCHITECTURE.md # Navigation & route details
│   └── 05_SIMULATION_SCOPE.md             # Equations & physics models
├── simulation/
│   └── python/                            # Python computational model
└── web/                                   # Next.js & React Three Fiber web application
```

## Running the Scientific Python Backend

1. Navigate to the simulation folder:
   ```bash
   cd simulation/python
   ```
2. Install dependencies:
   ```bash
   pip install numpy
   ```
3. Generate the default simulation dataset consumed by the web platform:
   ```bash
   python generate_dataset.py
   ```
   This will output the compiled biological growth and equivalent circuit dataset under `web/public/datasets/simulation_data.json`.

## Running the Next.js Web App

1. Navigate to the web folder:
   ```bash
   cd web
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Access the interface locally at `http://localhost:3000`.
5. Build the optimized static bundle:
   ```bash
   npm run build
   ```
