import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { recommendationService, assessmentService } from '../services'
import { calcProfileCompletion, formatDate } from '../utils/helpers'
import StatCard from '../components/common/StatCard'
import ProgressBar from '../components/common/ProgressBar'
import LoadingSpinner from '../components/common/LoadingSpinner'
import Badge from '../components/common/Badge'
import {
  FiAward, FiBarChart2, FiBook, FiClipboard,
  FiTrendingUp, FiUser, FiArrowRight,
} from 'react-icons/fi'
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, Tooltip,
} from 'recharts'

export default function Dashboard() {
  const { user } = useAuth()
  const [recommendation, setRecommendation] = useState(null)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      recommendationService.getLatest().catch(() => ({ data: null })),
      assessmentService.getMyResults().catch(() => ({ data: [] })),
    ]).then(([recRes, resRes]) => {
      setRecommendation(recRes.data?.recommendation || null)
      setResults(resRes.data?.results || [])
    }).finally(() => setLoading(false))
  }, [])

  const profilePct = calcProfileCompletion(user?.profile)

  // Build radar data from assessment results
  const radarData = results.slice(0, 6).map(r => ({
    domain: r.domain,
    score: r.percentage || 0,
  }))

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {formatDate(new Date())} — Your AI-powered career dashboard
          </p>
        </div>
        <Link to="/career-recommendation" className="btn-primary flex items-center gap-2 text-sm">
          Get Recommendations <FiArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Profile completion banner */}
      {profilePct < 80 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-4">
          <div className="flex-1">
            <p className="text-amber-800 font-medium text-sm">Complete your profile to improve recommendations</p>
            <p className="text-amber-700 text-xs mt-1">Profile is {profilePct}% complete</p>
            <ProgressBar value={profilePct} showLabel={false} color="bg-amber-400" size="sm" className="mt-2" />
          </div>
          <Link to="/profile" className="text-sm font-medium text-amber-700 whitespace-nowrap hover:underline">
            Complete now →
          </Link>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Profile Completion"
          value={`${profilePct}%`}
          icon={FiUser}
          color="primary"
          subtitle="Fill to improve AI accuracy"
        />
        <StatCard
          title="Assessments Taken"
          value={results.length}
          icon={FiClipboard}
          color="purple"
          subtitle="Domain skill tests"
        />
        <StatCard
          title="Recommended Career"
          value={recommendation?.career || 'Not yet'}
          icon={FiAward}
          color="green"
          subtitle={recommendation ? `${Math.round(recommendation.confidence * 100)}% confidence` : 'Take assessment first'}
        />
        <StatCard
          title="Skill Match"
          value={recommendation ? `${recommendation.skillMatchPercent ?? 0}%` : '—'}
          icon={FiBarChart2}
          color="yellow"
          subtitle="For recommended career"
        />
      </div>

      {/* Main 2-col grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Skill radar chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Skill Assessment Scores</h2>
            <Link to="/assessment" className="text-xs text-primary-600 hover:underline">Take assessment →</Link>
          </div>
          {radarData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="domain" tick={{ fontSize: 11 }} />
                <Radar
                  dataKey="score" stroke="#6366f1"
                  fill="#6366f1" fillOpacity={0.25}
                  strokeWidth={2}
                />
                <Tooltip formatter={(v) => [`${v}%`, 'Score']} />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
              <FiClipboard className="w-8 h-8 mb-2" />
              <p className="text-sm">No assessment data yet</p>
              <Link to="/assessment" className="mt-2 text-xs text-primary-600 hover:underline">Take your first quiz →</Link>
            </div>
          )}
        </div>

        {/* Career recommendation card */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Latest AI Recommendation</h2>
            <Link to="/career-recommendation" className="text-xs text-primary-600 hover:underline">View full →</Link>
          </div>
          {recommendation ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
                  <FiAward className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-lg">{recommendation.career}</p>
                  <Badge variant="success">{Math.round(recommendation.confidence * 100)}% confidence</Badge>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Skill Match</p>
                <ProgressBar value={recommendation.skillMatchPercent ?? 0} />
              </div>
              {recommendation.matchingSkills?.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-2">Matching Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {recommendation.matchingSkills.slice(0, 6).map(s => (
                      <Badge key={s} variant="success" size="xs">{s}</Badge>
                    ))}
                  </div>
                </div>
              )}
              {recommendation.missingSkills?.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-2">Skills to Learn</p>
                  <div className="flex flex-wrap gap-1.5">
                    {recommendation.missingSkills.slice(0, 5).map(s => (
                      <Badge key={s} variant="warning" size="xs">{s}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
              <FiAward className="w-8 h-8 mb-2" />
              <p className="text-sm">No recommendation yet</p>
              <Link to="/career-recommendation" className="mt-2 text-xs text-primary-600 hover:underline">
                Generate recommendation →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Recent assessment results */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Recent Assessment Results</h2>
          <Link to="/assessment/results" className="text-xs text-primary-600 hover:underline">View all →</Link>
        </div>
        {results.length > 0 ? (
          <div className="space-y-3">
            {results.slice(0, 5).map((r, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-32 text-sm font-medium text-gray-700 truncate capitalize">{r.domain}</div>
                <div className="flex-1">
                  <ProgressBar value={r.percentage || 0} showLabel={false} size="sm" />
                </div>
                <div className="w-12 text-right text-sm font-semibold text-gray-700">{r.percentage}%</div>
                <Badge variant={r.percentage >= 70 ? 'success' : r.percentage >= 50 ? 'warning' : 'danger'} size="xs">
                  {r.percentage >= 70 ? 'Good' : r.percentage >= 50 ? 'Fair' : 'Needs work'}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm text-center py-6">No results yet. <Link to="/assessment" className="text-primary-600 hover:underline">Take an assessment</Link></p>
        )}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { to: '/assessment',            icon: FiClipboard,  label: 'Take Assessment',   color: 'bg-purple-50 text-purple-600' },
          { to: '/career-recommendation', icon: FiAward,      label: 'AI Recommendation', color: 'bg-primary-50 text-primary-600' },
          { to: '/roadmap',               icon: FiBook,       label: 'Learning Roadmap',  color: 'bg-green-50 text-green-600' },
          { to: '/progress',              icon: FiTrendingUp, label: 'Track Progress',    color: 'bg-orange-50 text-orange-600' },
        ].map(({ to, icon: Icon, label, color }) => (
          <Link key={to} to={to} className="card flex flex-col items-center gap-3 text-center hover:shadow-md transition-shadow p-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-gray-700">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
