import { Material, ProcurementOption, JourneyStep } from '../types';

export const dashboardMetrics = {
  totalCO2: 8420,
  cbamCost: 2340,
  complianceScore: 87,
};

export const comparisonData = [
  {
    category: 'Traditional Sourcing',
    co2: 12500,
  },
  {
    category: 'Optimized Sourcing',
    co2: 8420,
  },
];

export const suppliers = [
  'Tvornica Cementa Kakanj (TCK)',
];

export const materialTypes = [
  'Kakanj Cement Standard (CEM II)',
  'Kakanj Cement Profi (CEM I)',
  'Kakanj Sivi',
] as const;

export const emissionsData: Record<string, number> = {
  'Kakanj Cement Standard (CEM II)-Tvornica Cementa Kakanj (TCK)': 720,
  'Kakanj Cement Profi (CEM I)-Tvornica Cementa Kakanj (TCK)': 680,
  'Kakanj Sivi-Tvornica Cementa Kakanj (TCK)': 750,
};

export const journeySteps: JourneyStep[] = [
  {
    id: 1,
    title: 'Raw Material Extraction',
    location: 'Limestone Quarry, Kakanj',
    icon: 'mountain',
    emissions: 120,
    status: 'low',
  },
  {
    id: 2,
    title: 'Production Facility',
    location: 'Tvornica Cementa Kakanj (TCK)',
    icon: 'factory',
    emissions: 620,
    status: 'high',
  },
  {
    id: 3,
    title: 'Transport & Logistics',
    location: 'Route: Kakanj → Sarajevo',
    icon: 'truck',
    emissions: 80,
    status: 'low',
  },
  {
    id: 4,
    title: 'Delivery & Distribution',
    location: 'Destination Site, Sarajevo',
    icon: 'hard-hat',
    emissions: 0,
    status: 'low',
  },
];

