Dataset Documentation
Dataset Title:
Physiological Parameters of Urine Samples for Health Monitoring and Analysis
Dataset Summary:
This dataset contains physiochemical attributes of urine samples collected from 13 individuals, designed for use in health diagnostics, biomedical signal processing, and machine learning applications. Each sample was obtained in sterile containers, and the data were manually recorded after analysis using calibrated sensors and visual inspection. The dataset aims to support UTI prediction, anomaly detection, and sensor validation tasks.
Column Descriptions:
Column Name	Description
Id	Unique identifier for each sample
Gender	Gender of the individual
Age	Age of the individual (in years)
PH Value 	Acidity or alkalinity of urine (measured via sensor)
Color 	Color of urine as visually observed (e.g., light yellow, clear, dark yellow)
Clarity 	Transparency level (e.g., clear, slightly cloudy, cloudy)
Specific Gravity	Density of urine compared to water 
Blood/Tissue	Presence of blood/tissue (0 = absent, 1 = present) 
Ammonia 	Ammonia concentration in urine (estimated value)
                                                                      
Instructions for Using the Dataset:
1. Download the CSV file from IEEE DataPort.
2. Load the file using data analysis tools such as:
   - Python: using pandas.read_csv()
   - R: using read.csv()
   - Excel or Google Sheets
3. Columns such as pH, Specific Gravity, and Ammonia can be used as continuous variables for regression or classification models.
4. Categorical features like Color, Clarity, and Gender can be encoded using Label Encoding or One-Hot Encoding for ML applications.
5. Potential applications include:
   - Urinary Tract Infection (UTI) prediction
   - Health monitoring system development
   - Real-time anomaly detection using IoT
   - Training ML classifiers using physiochemical features
Recommended Tools for Analysis:
- Python Libraries:
  - pandas, matplotlib, scikit-learn, seaborn
- Exploratory Data Analysis (EDA):
  - Check distribution of pH, ammonia, and clarity
  - Correlation between age and ammonia/pH
- Machine Learning Use Cases:
  - Supervised learning for health prediction
  - Clustering to identify abnormal patterns

Citation & Licensing:
Please cite this dataset using the citation format provided by IEEE DataPort. The dataset is intended for non-commercial, academic use under standard IEEE DataPort licensing.