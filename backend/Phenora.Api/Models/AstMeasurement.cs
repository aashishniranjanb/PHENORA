namespace Phenora.Api.Models
{
    public class AstMeasurement
    {
        public string Organism { get; set; } = string.Empty;
        public string Antibiotic { get; set; } = string.Empty;
        public double Measurement { get; set; }
        public string Unit { get; set; } = string.Empty;
        public bool ValidatedMeasurement { get; set; }
    }
}
