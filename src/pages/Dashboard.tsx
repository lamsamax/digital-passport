import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Cloud, Euro, Award } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import { dashboardMetrics, comparisonData } from '../data/mockData';

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h2>
        <p className="text-slate-600">Track your carbon footprint and CBAM compliance in real-time</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Total CO2 Emissions"
          value={dashboardMetrics.totalCO2.toLocaleString()}
          unit="kg"
          icon={Cloud}
          trend="down"
          trendValue="32.8%"
          iconColor="bg-slate-600"
        />
        <MetricCard
          title="Estimated CBAM Cost"
          value={dashboardMetrics.cbamCost.toLocaleString()}
          unit="EUR"
          icon={Euro}
          trend="down"
          trendValue="28.5%"
          iconColor="bg-emerald-500"
        />
        <MetricCard
          title="Green Compliance Score"
          value={dashboardMetrics.complianceScore}
          unit="/100"
          icon={Award}
          trend="up"
          trendValue="12 pts"
          iconColor="bg-emerald-600"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Sourcing Impact Comparison
          </h3>
          <p className="text-sm text-slate-600">
            CO2 emissions reduction through EcoTrace optimization
          </p>
        </div>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              dataKey="category"
              tick={{ fill: '#64748b', fontSize: 14 }}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            <YAxis
              label={{ value: 'CO2 Emissions (kg)', angle: -90, position: 'insideLeft', fill: '#64748b' }}
              tick={{ fill: '#64748b', fontSize: 14 }}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />
            <Bar
              dataKey="co2"
              name="CO2 Emissions (kg)"
              fill="#10b981"
              radius={[8, 8, 0, 0]}
              barSize={80}
            />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
          <p className="text-sm font-medium text-emerald-900">
            <span className="font-bold">4,080 kg CO2</span> saved by using EcoTrace-optimized sourcing.
            That's equivalent to planting <span className="font-bold">185 trees</span> annually.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h4 className="font-bold text-slate-900 mb-4">Recent Scans</h4>
          <div className="space-y-3">
            {[
              { material: 'Cement Batch #A4472', supplier: 'Cementara Kakanj', status: 'Valid' },
              { material: 'Steel Rebar #B2319', supplier: 'ArcelorMittal Zenica', status: 'Valid' },
              { material: 'Aluminum Profile #C8821', supplier: 'Import China', status: 'Invalid' },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-slate-900 text-sm">{item.material}</p>
                  <p className="text-xs text-slate-500">{item.supplier}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.status === 'Valid'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h4 className="font-bold text-slate-900 mb-4">Top Suppliers by Compliance</h4>
          <div className="space-y-4">
            {[
              { name: 'Cementara Kakanj', score: 94, city: 'Kakanj' },
              { name: 'ArcelorMittal Zenica', score: 89, city: 'Zenica' },
              { name: 'HeidelbergCement Lukavac', score: 85, city: 'Lukavac' },
            ].map((supplier, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-slate-900 text-sm">{supplier.name}</p>
                    <p className="text-xs text-slate-500">{supplier.city}</p>
                  </div>
                  <span className="font-bold text-emerald-600">{supplier.score}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full transition-all"
                    style={{ width: `${supplier.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
