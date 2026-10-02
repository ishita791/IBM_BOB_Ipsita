export default function StatCard({ title, value, subtitle, icon: Icon, color = 'primary', trend }) {
  const colorMap = {
    primary:  { bg: 'bg-primary-50',  icon: 'text-primary-600',  val: 'text-primary-700'  },
    green:    { bg: 'bg-green-50',    icon: 'text-green-600',    val: 'text-green-700'    },
    yellow:   { bg: 'bg-yellow-50',   icon: 'text-yellow-600',   val: 'text-yellow-700'   },
    red:      { bg: 'bg-red-50',      icon: 'text-red-600',      val: 'text-red-700'      },
    purple:   { bg: 'bg-purple-50',   icon: 'text-purple-600',   val: 'text-purple-700'   },
  }
  const c = colorMap[color] || colorMap.primary
  return (
    <div className="card flex items-start gap-4">
      {Icon && (
        <div className={`p-3 rounded-xl ${c.bg}`}>
          <Icon className={`w-6 h-6 ${c.icon}`} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-500 truncate">{title}</p>
        <p className={`text-2xl font-bold ${c.val}`}>{value}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        {trend !== undefined && (
          <p className={`text-xs mt-1 ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </p>
        )}
      </div>
    </div>
  )
}
