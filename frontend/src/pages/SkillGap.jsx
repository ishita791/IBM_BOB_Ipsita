import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { recommendationService } from '../services'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ProgressBar from '../components/common/ProgressBar'
import Badge from '../components/common/Badge'
import { FiCheckCircle, FiXCircle, FiAlertCircle } from 'react-icons/fi'

export default function SkillGap() {
  const [recommendation, setRecommendation] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    recommendationService.getLatest()
      .then(res => setRecommendation(res.data?.recommendation || null))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  if (!recommendation) {
    return (
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Skill Gap Analysis</h1>
        <div className="card text-center py-12">
          <FiAlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">Generate a career recommendation first to see your skill gap.</p>
          <Link to="/career-recommendation" className="btn-primary">Get Recommendation</Link>
        </div>
      </div>
    )
  }

  const { career, matchingSkills = [], missingSkills = [], skillMatchPercent = 0, requiredSkills = [] } = recommendation
  const allRequired = requiredSkills.length > 0
    ? requiredSkills
    : [...matchingSkills, ...missingSkills]

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Skill Gap Analysis</h1>
        <p className="text-gray-500 text-sm mt-1">
          Analyzing your skills against requirements for <strong>{career}</strong>
        </p>
      </div>

      {/* Match score card */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-500">Target Career</p>
            <h2 className="text-xl font-bold text-gray-900">{career}</h2>
          </div>
          <div className="text-center">
            <div className={`text-3xl font-bold ${
              skillMatchPercent >= 70 ? 'text-green-600'
              : skillMatchPercent >= 40 ? 'text-yellow-600'
              : 'text-red-600'
            }`}>{skillMatchPercent}%</div>
            <p className="text-xs text-gray-400">Skill Match</p>
          </div>
        </div>
        <ProgressBar value={skillMatchPercent} label="Overall Skill Match" />
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <p className="text-xl font-bold text-gray-900">{allRequired.length}</p>
            <p className="text-xs text-gray-500">Required Skills</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-green-600">{matchingSkills.length}</p>
            <p className="text-xs text-gray-500">You Have</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-red-500">{missingSkills.length}</p>
            <p className="text-xs text-gray-500">Missing</p>
          </div>
        </div>
      </div>

      {/* Skills side by side */}
      <div className="grid sm:grid-cols-2 gap-6">
        {/* Have */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FiCheckCircle className="text-green-500 w-5 h-5" />
            Skills You Have
          </h3>
          <div className="space-y-2">
            {matchingSkills.length > 0 ? matchingSkills.map(s => (
              <div key={s} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                <FiCheckCircle className="text-green-500 w-4 h-4 flex-shrink-0" />
                <span className="text-sm text-gray-700">{s}</span>
              </div>
            )) : (
              <p className="text-gray-400 text-sm">None matched yet</p>
            )}
          </div>
        </div>

        {/* Missing */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FiXCircle className="text-red-400 w-5 h-5" />
            Skills to Learn
          </h3>
          <div className="space-y-2">
            {missingSkills.length > 0 ? missingSkills.map(s => (
              <div key={s} className="flex items-center gap-2 p-2 bg-red-50 rounded-lg">
                <FiXCircle className="text-red-400 w-4 h-4 flex-shrink-0" />
                <span className="text-sm text-gray-700">{s}</span>
              </div>
            )) : (
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                <span className="text-green-600 text-sm font-medium">🎉 You have all required skills!</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* All required skills overview */}
      {allRequired.length > 0 && (
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">All Required Skills for {career}</h3>
          <div className="flex flex-wrap gap-2">
            {allRequired.map(s => {
              const has = matchingSkills.includes(s)
              return (
                <span
                  key={s}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border
                    ${has
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : 'bg-red-50 text-red-600 border-red-200'}`}
                >
                  {has ? '✓' : '✗'} {s}
                </span>
              )
            })}
          </div>
        </div>
      )}

      {/* CTA */}
      {missingSkills.length > 0 && (
        <div className="card bg-primary-50 border-primary-200">
          <h3 className="font-semibold text-primary-900 mb-2">Ready to close the gap?</h3>
          <p className="text-primary-700 text-sm mb-4">
            Your personalized learning roadmap will guide you through acquiring all {missingSkills.length} missing skills.
          </p>
          <Link to="/roadmap" className="btn-primary text-sm">View Learning Roadmap →</Link>
        </div>
      )}
    </div>
  )
}
