export interface Material {
  type: 'Cement' | 'Steel' | 'Aluminum';
  supplier: string;
  weight: number;
  embeddedEmissions: number;
  cbamStatus: 'Valid' | 'Invalid';
}

export interface ProcurementOption {
  name: string;
  basePrice: number;
  co2Emissions: number;
  cbamTax: number;
  totalCost: number;
  risk: 'High Risk' | 'Recommended';
}

export interface JourneyStep {
  id: number;
  title: string;
  location: string;
  icon: string;
  emissions: number;
  status: 'low' | 'high';
}
