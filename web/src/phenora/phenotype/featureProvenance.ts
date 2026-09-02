import { FeatureStatus, PhenotypeFeature, ProvenanceLevel } from "../types";

export function createFeature(
  name: string,
  value: string | number,
  unit: string,
  source: string,
  calculation: string,
  status: FeatureStatus,
  version: string
): PhenotypeFeature {
  return {
    name,
    value: typeof value === 'number' ? Number(value.toFixed(2)) : value, // Keep numbers reasonably precise
    unit,
    source,
    calculation,
    status,
    provenance: mapStatusToProvenance(status),
    version
  };
}

function mapStatusToProvenance(status: FeatureStatus): ProvenanceLevel {
  switch (status) {
    case 'RAW_DIRECT':
      return 'MEASURED';
    case 'DERIVED':
      return 'DERIVED';
    case 'MODEL_INFERRED':
      return 'INFERRED';
    default:
      return 'INFERRED'; // Fallback
  }
}
