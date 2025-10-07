import { TrendingUp, TrendingDown } from 'lucide-react';

export default function StatCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  iconColor = 'blue'
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    pink: 'bg-pink-100 text-pink-600',
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-slate-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-slate-900">{value}</p>

          {change !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {changeType === 'positive' && (
                <>
                  <TrendingUp size={16} className="text-green-600" />
                  <span className="text-sm font-medium text-green-600">
                    +{change}%
                  </span>
                </>
              )}
              {changeType === 'negative' && (
                <>
                  <TrendingDown size={16} className="text-red-600" />
                  <span className="text-sm font-medium text-red-600">
                    {change}%
                  </span>
                </>
              )}
              {changeType === 'neutral' && (
                <span className="text-sm text-slate-500">{change}%</span>
              )}
            </div>
          )}
        </div>

        {Icon && (
          <div className={`p-3 rounded-lg ${colorClasses[iconColor]}`}>
            <Icon size={24} />
          </div>
        )}
      </div>
    </div>
  );
}
