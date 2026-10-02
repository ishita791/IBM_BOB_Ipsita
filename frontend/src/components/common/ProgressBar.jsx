import { getProgressColor } from '../../utils/helpers'

export default function ProgressBar({ value = 0, label, showLabel = true, color, size = 'md' }) {
  const clamped = Math.min(100, Math.max(0, value))
  const barColor = color || getProgressColor(clamped)
  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' }

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-xs text-gray-600">{label}</span>}
          <span className="text-xs font-medium text-gray-700 ml-auto">{clamped}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-100 rounded-full overflow-hidden ${heights[size]}`}>
        <div
          className={`${heights[size]} rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  )
}
