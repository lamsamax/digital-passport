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
    category: 'EcoTrace Optimized',
    co2: 8420,
  },
];

export const suppliers = [
  'Cementara Kakanj',
  'ArcelorMittal Zenica',
  'Import China',
  'HeidelbergCement Lukavac',
  'Turkish Steel Import',
];

export const materialTypes = ['Cement', 'Steel', 'Aluminum'] as const;

export const emissionsData: Record<string, number> = {
  'Cement-Cementara Kakanj': 820,
  'Cement-HeidelbergCement Lukavac': 760,
  'Cement-Import China': 950,
  'Steel-ArcelorMittal Zenica': 1850,
  'Steel-Turkish Steel Import': 2100,
  'Steel-Import China': 2300,
  'Aluminum-ArcelorMittal Zenica': 1200,
  'Aluminum-Import China': 1650,
  'Aluminum-Turkish Steel Import': 1400,
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
    location: 'Cementara Kakanj Factory',
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
    title: 'Construction Site',
    location: 'Project Site, Sarajevo',
    icon: 'hard-hat',
    emissions: 0,
    status: 'low',
  },
];

export const procurementOptions: ProcurementOption[] = [
  {
    name: 'Import Steel (China)',
    basePrice: 5500,
    co2Emissions: 2300,
    cbamTax: 2070,
    totalCost: 7570,
    risk: 'High Risk',
  },
  {
    name: 'Local Steel (ArcelorMittal Zenica)',
    basePrice: 6200,
    co2Emissions: 1850,
    cbamTax: 0,
    totalCost: 6200,
    risk: 'Recommended',
  },
];
