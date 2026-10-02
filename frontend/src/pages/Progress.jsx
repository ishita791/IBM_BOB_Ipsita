import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { assessmentService, recommendationService } from '../services'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ProgressBar from '../components/common/ProgressBar'
import Badge from '../components/common/Badge'
import { formatDate } from '../utils/helpers'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { FiTrendingUp } from 'react-icons/fi'

export default function Progress() {
  const { user } = useAuth()
  const [results, setResults] = useState([])
  const [recommendation, setRecommendation] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      assessmentService.getMyResults().catch(() => ({ data: { results: [] } })),
      recommendationService.getLatest().catch(() => ({ data: null })),
    ]).then(([resRes, recRes]) => {
      setResults(resRes.data?.results || [])
      setRecommendation(recRes.data?.recommendation || null)
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  // Build line chart data: assessments over time
  const lineData = results
    .slice()
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .map(r => ({
      date: formatDate(r.createdAt),
      score: r.percentage,
      domain: r.domain,
    }))

  const avgScore = results.length
    ? Math.round(results.reduce((s, r) => s + r.percentage, 0) / results.length)
    : 0

  const bestDomain = results.length
    ? results.reduce((best, r) => r.percentage > best.percentage ? r : best, results[0])
    : null

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Progress</h1>
        <p className="text-gray-500 text-sm mt-1">Track your learning journey and skill development over time</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card text-center">
          <p className="text-2xl font-bold text-primary-600">{results.length}</p>
          <p className="text-xs text-gray-500 mt-1">Tests Taken</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-green-600">{avgScore}%</p>
          <p className="text-xs text-gray-500 mt-1">Avg Score</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-yellow-600">{bestDomain ? `${bestDomain.percentage}%` : '—'}</p>
          <p className="text-xs text-gray-500 mt-1">Best Score</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-purple-600">
            {recommendation ? `${recommendation.skillMatchPercent ?? 0}%` : '—'}
          </p>
          <p className="text-xs text-gray-500 mt-1">Career Match</p>
        </div>
      </div>

      {/* Score over time */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Assessment Score Trend</h2>
          <FiTrendingUp className="w-5 h-5 text-primary-500" />
        </div>
        {lineData.length > 1 ? (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => [`${v}%`, 'Score']} />
              <Line
                type="monotone" dataKey="score"
                stroke="#6366f1" strokeWidth={2}
                dot={{ fill: '#6366f1', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-400 text-sm text-center py-8">Take at least 2 assessments to see your trend.</p>
        )}
      </div>

      {/* Domain breakdown */}
      <div className="card">
        <h2 className="font-semibold text-gray-900 mb-4">Domain Performance</h2>
        {results.length > 0 ? (
          <div className="space-y-3">
            {results.map((r, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-28 text-sm font-medium text-gray-700 capitalize truncate">{r.domain}</div>
                <div className="flex-1">
                  <ProgressBar value={r.percentage} showLabel={false} size="sm" />
                </div>
                <div className="w-10 text-right text-sm font-bold text-gray-700">{r.percentage}%</div>
                <Badge
                  variant={r.percentage >= 70 ? 'success' : r.percentage >= 50 ? 'warning' : 'danger'}
                  size="xs"
                >
                  {r.percentage >= 70 ? 'Good' : r.percentage >= 50 ? 'Fair' : 'Low'}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400 text-sm">No assessment results yet.</p>
            <Link to="/assessment" className="btn-primary mt-3 inline-block text-sm">Start Assessment</Link>
          </div>
        )}
      </div>

      {/* Career goal progress */}
      {recommendation && (
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">Career Goal Progress</h2>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-1">Goal: <strong>{recommendation.career}</strong></p>
              <ProgressBar value={recommendation.skillMatchPercent ?? 0} label="Skill Match" />
            </div>
          </div>
          {recommendation.missingSkills?.length > 0 ? (
            <div>
              <p className="text-xs text-gray-500 mb-2">Still needed:</p>
              <div className="flex flex-wrap gap-1.5">
                {recommendation.missingSkills.map(s => (
                  <Badge key={s} variant="warning" size="xs">{s}</Badge>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-green-600 font-medium text-sm">🎉 You meet all requirements for {recommendation.career}!</p>
          )}
        </div>
      )}
    </div>
  )
}
