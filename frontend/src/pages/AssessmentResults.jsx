import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { assessmentService } from '../services'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ProgressBar from '../components/common/ProgressBar'
import Badge from '../components/common/Badge'
import { formatDate } from '../utils/helpers'
import { FiAward, FiRepeat } from 'react-icons/fi'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts'

const COLORS = ['#6366f1','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#ec4899','#14b8a6','#f97316']

export default function AssessmentResults() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    assessmentService.getMyResults()
      .then(res => setResults(res.data.results || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  const chartData = results.map(r => ({ name: r.domain, score: r.percentage }))

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assessment Results</h1>
          <p className="text-gray-500 text-sm mt-1">Your domain-wise skill proficiency scores</p>
        </div>
        <Link to="/assessment" className="btn-primary flex items-center gap-2 text-sm">
          <FiRepeat className="w-4 h-4" /> Retake
        </Link>
      </div>

      {results.length === 0 ? (
        <div className="card text-center py-12">
          <FiAward className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">You haven't taken any assessments yet.</p>
          <Link to="/assessment" className="btn-primary mt-4 inline-block">Start Assessment</Link>
        </div>
      ) : (
        <>
          {/* Bar chart */}
          <div className="card">
            <h2 className="font-semibold text-gray-900 mb-4">Score Overview</h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => [`${v}%`, 'Score']} />
                <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Result cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            {results.map((r, i) => (
              <div key={i} className="card">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-900 capitalize">{r.domain}</p>
                    <p className="text-xs text-gray-400">{formatDate(r.createdAt)}</p>
                  </div>
                  <Badge
                    variant={r.percentage >= 70 ? 'success' : r.percentage >= 50 ? 'warning' : 'danger'}
                  >
                    {r.percentage >= 70 ? '🏆 Good' : r.percentage >= 50 ? '📈 Fair' : '📚 Needs Work'}
                  </Badge>
                </div>
                <ProgressBar value={r.percentage} />
                <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                  <span>Correct: {r.correctAnswers}/{r.totalQuestions}</span>
                  <span className="font-bold text-gray-700">{r.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
