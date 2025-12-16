import { TrendingDown, TrendingUp, AlertTriangle, CheckCircle, Euro, Cloud, Package } from 'lucide-react';
import { procurementOptions } from '../data/mockData';

export default function SmartProcurement() {
  const saving = procurementOptions[0].totalCost - procurementOptions[1].totalCost;
  const co2Saving = procurementOptions[0].co2Emissions - procurementOptions[1].co2Emissions;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Smart Procurement</h2>
        <p className="text-slate-600">Make data-driven decisions to minimize costs and carbon footprint</p>
      </div>

      <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-xl p-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">Cost & Carbon Analysis</h3>
            <p className="text-emerald-100 text-sm">Comparing 10 tons of steel sourcing options</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 mt-6">
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <p className="text-emerald-100 text-sm mb-1">Total Financial Saving</p>
            <p className="text-3xl font-bold">€{saving.toLocaleString()}</p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <p className="text-emerald-100 text-sm mb-1">CO2 Reduction</p>
            <p className="text-3xl font-bold">{co2Saving} kg</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {procurementOptions.map((option, index) => {
          const isRecommended = option.risk === 'Recommended';
          return (
            <div
              key={index}
              className={`bg-white rounded-xl shadow-lg border-2 ${
                isRecommended ? 'border-emerald-500' : 'border-red-300'
              } overflow-hidden relative`}
            >
              {isRecommended && (
                <div className="absolute top-0 right-0 bg-emerald-500 text-white px-4 py-1 text-xs font-bold rounded-bl-lg">
                  RECOMMENDED
                </div>
              )}

              <div className={`p-6 ${isRecommended ? 'bg-emerald-50' : 'bg-red-50'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`w-12 h-12 ${
                      isRecommended ? 'bg-emerald-500' : 'bg-red-500'
                    } rounded-lg flex items-center justify-center`}
                  >
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900">{option.name}</h3>
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold mt-1 ${
                        isRecommended
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {isRecommended ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <AlertTriangle className="w-3 h-3" />
                      )}
                      {option.risk}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Euro className="w-4 h-4 text-slate-500" />
                      <p className="text-xs text-slate-600">Base Price</p>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">
                      €{option.basePrice.toLocaleString()}
                    </p>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Cloud className="w-4 h-4 text-slate-500" />
                      <p className="text-xs text-slate-600">CO2 Emissions</p>
                    </div>
                    <p className="text-2xl font-bold text-slate-900">
                      {option.co2Emissions}
                      <span className="text-sm text-slate-500 ml-1">kg</span>
                    </p>
                  </div>
                </div>

                <div
                  className={`rounded-lg p-4 ${
                    option.cbamTax > 0 ? 'bg-red-50 border border-red-200' : 'bg-emerald-50 border border-emerald-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-600 mb-1">CBAM Tax</p>
                      <p className={`text-xl font-bold ${option.cbamTax > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                        {option.cbamTax > 0 ? `€${option.cbamTax.toLocaleString()}` : 'Exempt'}
                      </p>
                    </div>
                    {option.cbamTax > 0 ? (
                      <TrendingUp className="w-6 h-6 text-red-500" />
                    ) : (
                      <CheckCircle className="w-6 h-6 text-emerald-500" />
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-slate-600">Total Cost</p>
                    <p className="text-3xl font-bold text-slate-900">
                      €{option.totalCost.toLocaleString()}
                    </p>
                  </div>
                  {!isRecommended && (
                    <p className="text-xs text-red-600 font-medium">
                      €{saving.toLocaleString()} more expensive than local option
                    </p>
                  )}
                  {isRecommended && (
                    <p className="text-xs text-emerald-600 font-medium">
                      Saves €{saving.toLocaleString()} compared to import option
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Cost Breakdown Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-slate-700 mb-3 text-sm">Import Option (China)</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded">
                <span className="text-sm text-slate-600">Base Price</span>
                <span className="font-bold text-slate-900">€5,500</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded">
                <span className="text-sm text-slate-600">CBAM Tax (90€/ton CO2)</span>
                <span className="font-bold text-red-600">+€2,070</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-100 rounded border-t-2 border-slate-300">
                <span className="text-sm font-bold text-slate-900">Total</span>
                <span className="font-bold text-slate-900">€7,570</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-slate-700 mb-3 text-sm">Local Option (ArcelorMittal Zenica)</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded">
                <span className="text-sm text-slate-600">Base Price</span>
                <span className="font-bold text-slate-900">€6,200</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-emerald-50 rounded">
                <span className="text-sm text-slate-600">CBAM Tax</span>
                <span className="font-bold text-emerald-600">€0</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-emerald-100 rounded border-t-2 border-emerald-300">
                <span className="text-sm font-bold text-slate-900">Total</span>
                <span className="font-bold text-emerald-700">€6,200</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-emerald-900 mb-1">Optimal Decision</p>
              <p className="text-sm text-emerald-800">
                By choosing local sourcing from ArcelorMittal Zenica, you save €{saving.toLocaleString()} per order
                while reducing your carbon footprint by {co2Saving} kg CO2. This decision improves both your
                bottom line and sustainability compliance.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Euro className="w-5 h-5 text-blue-600" />
            </div>
            <h4 className="font-bold text-slate-900">Financial Impact</h4>
          </div>
          <p className="text-sm text-slate-600">
            CBAM taxes are calculated at €90 per ton of CO2. High-emission imports face significant penalties.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Cloud className="w-5 h-5 text-emerald-600" />
            </div>
            <h4 className="font-bold text-slate-900">Carbon Footprint</h4>
          </div>
          <p className="text-sm text-slate-600">
            Local BiH suppliers average 20-30% lower emissions due to EU production standards and shorter transport.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-purple-600" />
            </div>
            <h4 className="font-bold text-slate-900">Supply Security</h4>
          </div>
          <p className="text-sm text-slate-600">
            Local sourcing reduces supply chain risks and ensures faster delivery times for construction projects.
          </p>
        </div>
      </div>
    </div>
  );
}
