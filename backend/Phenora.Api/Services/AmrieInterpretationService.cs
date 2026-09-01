using System;
using AMR_Engine;
using Phenora.Api.Models;

namespace Phenora.Api.Services
{
    public class AmrieInterpretationService
    {
        private readonly InterpretationConfiguration _config;

        public AmrieInterpretationService()
        {
            _config = InterpretationConfiguration.DefaultConfiguration();
        }

        public InterpretationResult Interpret(AstMeasurement measurement)
        {
            var result = new InterpretationResult
            {
                Organism = measurement.Organism,
                Antibiotic = measurement.Antibiotic,
                Measurement = measurement.Measurement,
                Unit = measurement.Unit,
                Source = "AMRIE",
                Valid = false
            };

            if (!measurement.ValidatedMeasurement)
            {
                result.Message = "computational demonstration only - unvalidated measurement";
            }

            try
            {
                // Map frontend codes to AMRIE codes (Basic example mapping)
                string amrieOrganism = MapOrganism(measurement.Organism);
                string amrieAntibiotic = MapAntibiotic(measurement.Antibiotic);
                string amrieMeasurement = measurement.Measurement.ToString(System.Globalization.CultureInfo.InvariantCulture);

                string interpretation = IsolateInterpretation.GetSingleInterpretation(
                    _config,
                    amrieOrganism,
                    amrieAntibiotic,
                    amrieMeasurement);

                // Strip comments if any
                interpretation = IsolateInterpretation.RemoveComments(interpretation);

                result.Interpretation = interpretation;
                result.Valid = true;
            }
            catch (Exception ex)
            {
                result.Message = $"Error during interpretation: {ex.Message}";
                result.Interpretation = "ERROR";
            }

            return result;
        }

        private string MapOrganism(string organism)
        {
            // Fallback map if needed, otherwise rely on caller providing the right WHONET code
            switch (organism.ToUpperInvariant())
            {
                case "E_COLI":
                case "E. COLI":
                case "ESCHERICHIA COLI":
                    return "eco";
                case "S_AUREUS":
                case "S. AUREUS":
                case "STAPHYLOCOCCUS AUREUS":
                    return "sau";
                default:
                    // Return as-is, assuming caller provided a valid 3-letter code
                    return organism;
            }
        }

        private string MapAntibiotic(string antibiotic)
        {
            // AMRIE uses WHONET codes. E.g. AMP_NM for Ampicillin MIC.
            switch (antibiotic.ToUpperInvariant())
            {
                case "AMP":
                    return "AMP_NM"; // Assuming MIC for demonstration
                case "CIP":
                    return "CIP_NM";
                case "CRO":
                    return "CRO_NM";
                default:
                    // Return as-is, assuming caller provided a valid code
                    return antibiotic;
            }
        }
    }
}
