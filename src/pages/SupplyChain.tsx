import { Mountain, Factory, Truck, HardHat, ArrowRight, MapPin } from 'lucide-react';
import { journeySteps } from '../data/mockData';

const iconMap: Record<string, any> = {
  mountain: Mountain,
  factory: Factory,
  truck: Truck,
  'hard-hat': HardHat,
};

export default function SupplyChain() {
  const totalEmissions = journeySteps.reduce((sum, step) => sum + step.emissions, 0);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Supply Chain Visualizer</h2>
        <p className="text-slate-600">Track the carbon journey of your materials from source to site</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Product Journey</h3>
            <p className="text-sm text-slate-500">Cement Batch #A4472 - Cementara Kakanj</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-600">Total Emissions</p>
            <p className="text-2xl font-bold text-slate-900">{totalEmissions} <span className="text-lg text-slate-500">kg CO2</span></p>
          </div>
        </div>

        <div className="relative">
          {journeySteps.map((step, index) => {
            const Icon = iconMap[step.icon];
            const isLast = index === journeySteps.length - 1;

            return (
              <div key={step.id} className="relative">
                <div className="flex items-start gap-6 pb-8">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${
                        step.status === 'low'
                          ? 'bg-emerald-500'
                          : 'bg-red-500'
                      }`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    {!isLast && (
                      <div className="relative w-1 h-24 mt-4">
                        <div
                          className={`absolute inset-0 ${
                            step.status === 'low' ? 'bg-emerald-200' : 'bg-red-200'
                          }`}
                        />
                        <div
                          className={`absolute inset-0 ${
                            step.status === 'low' ? 'bg-emerald-500' : 'bg-red-500'
                          }`}
                          style={{
                            clipPath: 'polygon(0 0, 100% 0, 50% 100%, 50% 100%)',
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-lg font-bold text-slate-900 mb-1">{step.title}</h4>
                          <div className="flex items-center gap-2 text-slate-600">
                            <MapPin className="w-4 h-4" />
                            <p className="text-sm">{step.location}</p>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            step.status === 'low'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {step.status === 'low' ? 'Low Carbon' : 'High Carbon'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg p-3 border border-slate-200">
                          <p className="text-xs text-slate-500 mb-1">CO2 Emissions</p>
                          <p className="text-lg font-bold text-slate-900">
                            {step.emissions} <span className="text-sm text-slate-500">kg</span>
                          </p>
                        </div>
                        <div className="bg-white rounded-lg p-3 border border-slate-200">
                          <p className="text-xs text-slate-500 mb-1">Contribution</p>
                          <p className="text-lg font-bold text-slate-900">
                            {((step.emissions / totalEmissions) * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>

                      {step.id === 2 && (
                        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                          <p className="text-xs text-amber-800">
                            <span className="font-bold">High Impact Zone:</span> Consider optimizing
                            production processes or switching to renewable energy sources.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl p-8 text-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold mb-2">Route Visualization</h3>
            <p className="text-slate-300 text-sm">Geographic path from quarry to construction site</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500 rounded-lg">
            <MapPin className="w-4 h-4" />
            <span className="font-medium text-sm">82 km total</span>
          </div>
        </div>

        <div className="bg-slate-700/50 rounded-lg p-8 border border-slate-600 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 400 200">
              <path
                d="M 20 180 Q 100 120, 150 140 T 280 100 Q 330 80, 380 60"
                fill="none"
                stroke="white"
                strokeWidth="4"
                strokeDasharray="8,4"
              />
            </svg>
          </div>

          <div className="relative grid grid-cols-4 gap-4">
            {journeySteps.map((step) => {
              const Icon = iconMap[step.icon];
              return (
                <div key={step.id} className="text-center">
                  <div className="w-12 h-12 bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <p className="text-xs text-slate-300 font-medium">{step.location.split(',')[1] || step.location.split(',')[0]}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 text-center">
            <p className="text-slate-400 text-xs">Map visualization placeholder</p>
            <p className="text-slate-500 text-xs mt-1">Production deployment would integrate real mapping services</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h4 className="font-bold text-slate-900 mb-4">Emission Breakdown</h4>
          <div className="space-y-3">
            {journeySteps.map((step) => (
              <div key={step.id}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-slate-600">{step.title}</p>
                  <p className="text-sm font-bold text-slate-900">{step.emissions} kg</p>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      step.status === 'low' ? 'bg-emerald-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${(step.emissions / totalEmissions) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h4 className="font-bold text-slate-900 mb-4">Optimization Opportunities</h4>
          <div className="space-y-4">
            {[
              {
                title: 'Switch to Electric Transport',
                saving: '64 kg CO2',
                feasibility: 'High',
              },
              {
                title: 'Use Renewable Energy in Production',
                saving: '248 kg CO2',
                feasibility: 'Medium',
              },
              {
                title: 'Optimize Logistics Route',
                saving: '24 kg CO2',
                feasibility: 'High',
              },
            ].map((opportunity, index) => (
              <div
                key={index}
                className="p-4 bg-slate-50 rounded-lg border border-slate-200"
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="font-medium text-slate-900 text-sm">{opportunity.title}</p>
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded">
                    {opportunity.feasibility}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Potential saving: <span className="font-bold text-emerald-600">{opportunity.saving}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
