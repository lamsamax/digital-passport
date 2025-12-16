import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down';
  trendValue?: string;
  iconColor?: string;
}

export default function MetricCard({
  title,
  value,
  unit,
  icon: Icon,
  trend,
  trendValue,
  iconColor = 'bg-emerald-500',
}: MetricCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 mb-2">{title}</p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
            {unit && <span className="text-lg text-slate-500">{unit}</span>}
          </div>
          {trend && trendValue && (
            <div className="mt-3 flex items-center gap-1">
              <span
                className={`text-sm font-medium ${
                  trend === 'down' ? 'text-emerald-600' : 'text-red-600'
                }`}
              >
                {trend === 'down' ? '↓' : '↑'} {trendValue}
              </span>
              <span className="text-xs text-slate-500">vs last month</span>
            </div>
          )}
        </div>
        <div className={`${iconColor} w-12 h-12 rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}
