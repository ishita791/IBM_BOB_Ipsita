import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { roadmapService, recommendationService } from '../services'
import LoadingSpinner from '../components/common/LoadingSpinner'
import Badge from '../components/common/Badge'
import { FiBook, FiClock, FiCode, FiAlertCircle } from 'react-icons/fi'

const difficultyVariant = { Beginner: 'success', Intermediate: 'warning', Advanced: 'danger' }

export default function Roadmap() {
  const [roadmap, setRoadmap] = useState(null)
  const [career, setCareer] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    recommendationService.getLatest()
      .then(res => {
        const rec = res.data?.recommendation
        if (!rec) return
        setCareer(rec.career)
        return roadmapService.get(rec.career)
      })
      .then(res => { if (res) setRoadmap(res.data?.roadmap || null) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  if (!roadmap) {
    return (
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Learning Roadmap</h1>
        <div className="card text-center py-12">
          <FiAlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">Get a career recommendation first to generate your roadmap.</p>
          <Link to="/career-recommendation" className="btn-primary">Get Recommendation</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Learning Roadmap</h1>
        <p className="text-gray-500 text-sm mt-1">
          Personalized path to become a <strong>{career}</strong>
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <p className="text-2xl font-bold text-primary-600">{roadmap.phases?.length || 0}</p>
          <p className="text-xs text-gray-500 mt-1">Phases</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-green-600">{roadmap.totalDurationWeeks || 0}w</p>
          <p className="text-xs text-gray-500 mt-1">Est. Duration</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-yellow-600">
            {roadmap.phases?.reduce((acc, p) => acc + (p.skills?.length || 0), 0) || 0}
          </p>
          <p className="text-xs text-gray-500 mt-1">Skills</p>
        </div>
      </div>

      {/* Phases timeline */}
      <div className="space-y-4">
        {roadmap.phases?.map((phase, i) => (
          <div key={i} className="relative">
            {/* Connector line */}
            {i < roadmap.phases.length - 1 && (
              <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-gray-200" />
            )}
            <div className="flex gap-4">
              {/* Phase number */}
              <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 z-10">
                {i + 1}
              </div>
              {/* Phase content */}
              <div className="card flex-1 mb-4">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h3 className="font-semibold text-gray-900">{phase.title}</h3>
                  <Badge variant={difficultyVariant[phase.difficulty] || 'default'}>{phase.difficulty}</Badge>
                  {phase.durationWeeks && (
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <FiClock className="w-3 h-3" /> {phase.durationWeeks} weeks
                    </span>
                  )}
                </div>

                {phase.description && (
                  <p className="text-sm text-gray-600 mb-3">{phase.description}</p>
                )}

                {/* Skills to learn */}
                {phase.skills?.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-medium text-gray-500 mb-1.5 flex items-center gap-1">
                      <FiBook className="w-3 h-3" /> Skills
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {phase.skills.map(s => (
                        <Badge key={s} variant="primary" size="xs">{s}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Project suggestion */}
                {phase.projectSuggestion && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-xs font-medium text-amber-700 flex items-center gap-1 mb-0.5">
                      <FiCode className="w-3 h-3" /> Project Suggestion
                    </p>
                    <p className="text-sm text-amber-800">{phase.projectSuggestion}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
