import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { recommendationService, userService } from '../services'
import { useToast } from '../context/ToastContext'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ProgressBar from '../components/common/ProgressBar'
import Badge from '../components/common/Badge'
import { FiAward, FiRefreshCw, FiArrowRight } from 'react-icons/fi'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'

const COLORS = ['#6366f1','#10b981','#f59e0b','#ef4444','#8b5cf6']

export default function CareerRecommendation() {
  const toast = useToast()
  const [recommendation, setRecommendation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  // Load latest recommendation
  useEffect(() => {
    recommendationService.getLatest()
      .then(res => setRecommendation(res.data?.recommendation || null))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const generateRecommendation = async () => {
    setGenerating(true)
    try {
      const profileRes = await userService.getProfile()
      const user = profileRes.data.user
      const res = await recommendationService.generate({
        userId: user._id,
        skills: [
          ...(user.profile?.skills?.technical || []),
          ...(user.profile?.skills?.programmingLanguages || []),
        ],
        education: user.education,
        experienceYears: user.profile?.experienceYears || 0,
        preferredDomain: user.profile?.preferredDomain || '',
        certifications: user.profile?.certifications || [],
      })
      setRecommendation(res.data.recommendation)
      toast.success('Career recommendation generated!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate recommendation. Make sure your profile is complete.')
    } finally {
      setGenerating(false)
    }
  }

  if (loading) return <LoadingSpinner />

  // Pie chart data from top careers array if returned
  const pieData = recommendation?.topCareers?.slice(0, 5).map((c, i) => ({
    name: c.career,
    value: Math.round(c.confidence * 100),
  })) || []

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Career Recommendation</h1>
          <p className="text-gray-500 text-sm mt-1">ML-powered analysis of your skills and experience</p>
        </div>
        <button
          onClick={generateRecommendation}
          disabled={generating}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          {generating
            ? <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            : <FiRefreshCw className="w-4 h-4" />}
          {generating ? 'Analyzing…' : recommendation ? 'Re-analyze' : 'Generate'}
        </button>
      </div>

      {!recommendation && !generating && (
        <div className="card text-center py-14">
          <FiAward className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-700 mb-2">No recommendation yet</h2>
          <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
            Complete your profile and take skill assessments, then click "Generate" to get your personalized AI career recommendation.
          </p>
          <div className="flex gap-3 justify-center">
            <Link to="/profile" className="btn-outline text-sm">Complete Profile</Link>
            <Link to="/assessment" className="btn-primary text-sm">Take Assessment</Link>
          </div>
        </div>
      )}

      {recommendation && (
        <>
          {/* Primary career card */}
          <div className="card bg-gradient-to-br from-primary-50 to-indigo-50 border-primary-200">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                <FiAward className="w-8 h-8 text-primary-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-primary-500 uppercase tracking-wider mb-1">Best Match</p>
                <h2 className="text-2xl font-bold text-primary-900">{recommendation.career}</h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="success">{Math.round(recommendation.confidence * 100)}% confidence</Badge>
                  <Badge variant="primary">AI Generated</Badge>
                </div>
              </div>
              <div className="text-center sm:text-right">
                <p className="text-3xl font-bold text-primary-700">{recommendation.skillMatchPercent ?? 0}%</p>
                <p className="text-xs text-gray-500 mt-1">Skill Match</p>
              </div>
            </div>

            {recommendation.explanation && (
              <div className="mt-4 p-3 bg-white/60 rounded-xl">
                <p className="text-sm text-gray-700 italic">"{recommendation.explanation}"</p>
              </div>
            )}

            <div className="mt-4">
              <ProgressBar value={recommendation.skillMatchPercent ?? 0} label="Skill Match with Role" />
            </div>
          </div>

          {/* Skills grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                Matching Skills ({recommendation.matchingSkills?.length || 0})
              </h3>
              {recommendation.matchingSkills?.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {recommendation.matchingSkills.map(s => (
                    <Badge key={s} variant="success">{s}</Badge>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">No matching skills found</p>
              )}
            </div>

            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
                Missing Skills ({recommendation.missingSkills?.length || 0})
              </h3>
              {recommendation.missingSkills?.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {recommendation.missingSkills.map(s => (
                    <Badge key={s} variant="danger">{s}</Badge>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">All required skills covered! 🎉</p>
              )}
            </div>
          </div>

          {/* Top careers pie */}
          {pieData.length > 0 && (
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-4">Career Fit Distribution (Top 5)</h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={pieData} dataKey="value" nameKey="name"
                    cx="50%" cy="50%" outerRadius={90} label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v) => `${v}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            <Link to="/skill-gap" className="btn-primary flex items-center gap-2">
              Skill Gap Analysis <FiArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/roadmap" className="btn-outline flex items-center gap-2">
              Learning Roadmap <FiArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/projects" className="btn-secondary flex items-center gap-2">
              Project Ideas <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
