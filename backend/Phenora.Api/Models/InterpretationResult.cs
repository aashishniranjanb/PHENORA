namespace Phenora.Api.Models
{
    public class InterpretationResult
    {
        public string Organism { get; set; } = string.Empty;
        public string Antibiotic { get; set; } = string.Empty;
        public double Measurement { get; set; }
        public string Unit { get; set; } = string.Empty;
        public string Interpretation { get; set; } = string.Empty;
        public string Source { get; set; } = string.Empty;
        public bool Valid { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}
