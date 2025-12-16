import { useState } from 'react';
import { QrCode, Package, CheckCircle, XCircle, Leaf, Factory, TrendingDown } from 'lucide-react';
import { materialTypes, suppliers, emissionsData } from '../data/mockData';

export default function MaterialPassport() {
  const [formData, setFormData] = useState({
    materialType: 'Cement',
    supplier: 'Cementara Kakanj',
    weight: 10,
  });
  const [showPassport, setShowPassport] = useState(false);
  const [passportData, setPassportData] = useState<any>(null);

  const handleCalculate = () => {
    const key = `${formData.materialType}-${formData.supplier}`;
    const embeddedEmissions = emissionsData[key] || 800;
    const cbamStatus = formData.supplier.includes('Import') ? 'Invalid' : 'Valid';

    setPassportData({
      ...formData,
      embeddedEmissions,
      cbamStatus,
      totalEmissions: embeddedEmissions * formData.weight,
      batchNumber: `BH-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      certificationDate: new Date().toLocaleDateString('en-GB'),
    });
    setShowPassport(true);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Material Passport</h2>
        <p className="text-slate-600">Scan and verify material batch certificates for CBAM compliance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center">
              <QrCode className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Scan Material Batch</h3>
              <p className="text-sm text-slate-500">Enter or scan QR code data</p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Material Type
              </label>
              <select
                value={formData.materialType}
                onChange={(e) => setFormData({ ...formData, materialType: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              >
                {materialTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Supplier
              </label>
              <select
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              >
                {suppliers.map((supplier) => (
                  <option key={supplier} value={supplier}>
                    {supplier}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Weight (tons)
              </label>
              <input
                type="number"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                min="1"
                step="0.1"
              />
            </div>

            <button
              onClick={handleCalculate}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-3 px-6 rounded-lg transition-colors shadow-lg shadow-emerald-500/30"
            >
              Calculate Impact
            </button>
          </div>

          <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-start gap-3">
              <Package className="w-5 h-5 text-slate-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-slate-900 mb-1">QR Code Simulation</p>
                <p className="text-xs text-slate-600">
                  In production, this would scan actual QR codes from material batches and automatically
                  populate the form with embedded certificate data.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {showPassport && passportData ? (
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-xl p-8 text-white">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-700">
                <div>
                  <h3 className="text-2xl font-bold">Digital Passport</h3>
                  <p className="text-slate-400 text-sm">CBAM Certificate</p>
                </div>
                <div
                  className={`px-4 py-2 rounded-lg font-bold ${
                    passportData.cbamStatus === 'Valid'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-red-500 text-white'
                  }`}
                >
                  {passportData.cbamStatus === 'Valid' ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      <span>Valid</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <XCircle className="w-5 h-5" />
                      <span>Invalid</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <p className="text-slate-400 text-xs mb-1">Batch Number</p>
                    <p className="font-bold">{passportData.batchNumber}</p>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <p className="text-slate-400 text-xs mb-1">Certification Date</p>
                    <p className="font-bold">{passportData.certificationDate}</p>
                  </div>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-4 h-4 text-emerald-400" />
                    <p className="text-slate-400 text-xs">Material</p>
                  </div>
                  <p className="font-bold text-lg">{passportData.materialType}</p>
                  <p className="text-slate-300 text-sm mt-1">{passportData.weight} tons</p>
                </div>

                <div className="bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Factory className="w-4 h-4 text-emerald-400" />
                    <p className="text-slate-400 text-xs">Supplier</p>
                  </div>
                  <p className="font-bold">{passportData.supplier}</p>
                </div>

                <div className="bg-emerald-500/20 border border-emerald-500/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Leaf className="w-4 h-4 text-emerald-400" />
                    <p className="text-emerald-400 text-xs font-medium">Embedded Emissions</p>
                  </div>
                  <p className="font-bold text-2xl text-emerald-400">
                    {passportData.embeddedEmissions}
                    <span className="text-sm ml-2">kgCO2/ton</span>
                  </p>
                  <p className="text-slate-300 text-sm mt-2">
                    Total: <span className="font-bold">{passportData.totalEmissions.toLocaleString()} kg CO2</span>
                  </p>
                </div>

                {passportData.cbamStatus === 'Invalid' && (
                  <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-red-400 font-medium text-sm mb-1">CBAM Non-Compliant</p>
                        <p className="text-slate-300 text-xs">
                          This material exceeds EU emission thresholds. Consider sourcing from local
                          certified suppliers to avoid export penalties.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <QrCode className="w-10 h-10 text-slate-400" />
                </div>
                <h4 className="font-bold text-slate-900 mb-2">No Passport Generated</h4>
                <p className="text-sm text-slate-500">
                  Fill in the form and click "Calculate Impact" to generate a digital passport
                </p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingDown className="w-5 h-5 text-emerald-500" />
              <h4 className="font-bold text-slate-900">Compliance Tip</h4>
            </div>
            <p className="text-sm text-slate-600 mb-3">
              Materials from local BiH suppliers typically have lower embedded emissions due to:
            </p>
            <ul className="space-y-2">
              {[
                'Reduced transportation distances',
                'EU-aligned production standards',
                'Access to renewable energy sources',
                'Modern, efficient facilities',
              ].map((tip, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
