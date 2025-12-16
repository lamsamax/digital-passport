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
          iconColor="bg-emerald-500"
        />
      </div>

      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold mb-1">Heidelberg Net-Zero Target</h3>
            <p className="text-emerald-100 text-sm">Progress to 2030 Carbon Neutrality Goal</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold">74%</p>
            <p className="text-emerald-100 text-sm">to 2030 Target</p>
          </div>
        </div>
        <div className="w-full bg-emerald-800 rounded-full h-3">
          <div className="bg-white h-3 rounded-full transition-all" style={{ width: '74%' }}></div>
        </div>
        <p className="text-emerald-100 text-xs mt-3">Kakanj facility on track to meet corporate sustainability commitments</p>
      </div>

      

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h4 className="font-bold text-slate-900 mb-4">Recent Scans</h4>
        <div className="space-y-3">
          {[
            { material: 'Cement Batch #A4472', supplier: 'Tvornica Cementa Kakanj (TCK)', status: 'Valid' },
            { material: 'Cement Batch #JK87G', supplier: 'Tvornica Cementa Kakanj (TCK)', status: 'Valid' },
            { material: 'Cement Batch #B7HT6', supplier: 'Tvornica Cementa Kakanj (TCK)', status: 'Invalid'  },
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

    </div>
  );
}
