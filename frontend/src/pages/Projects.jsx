import { useState, useEffect } from 'react'
import { projectService, recommendationService } from '../services'
import LoadingSpinner from '../components/common/LoadingSpinner'
import Badge from '../components/common/Badge'
import { FiFolder, FiCode, FiTarget } from 'react-icons/fi'

const difficultyVariant = { Beginner: 'success', Intermediate: 'warning', Advanced: 'danger' }

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [career, setCareer] = useState('')
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    Promise.all([
      recommendationService.getLatest().catch(() => ({ data: null })),
      projectService.getAll().catch(() => ({ data: { projects: [] } })),
    ]).then(([recRes, projRes]) => {
      const rec = recRes.data?.recommendation
      if (rec) {
        setCareer(rec.career)
        // Try career-specific projects first
        projectService.getByCareer(rec.career)
          .then(r => setProjects(r.data?.projects || projRes.data?.projects || []))
          .catch(() => setProjects(projRes.data?.projects || []))
      } else {
        setProjects(projRes.data?.projects || [])
      }
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced']
  const filtered = filter === 'All' ? projects : projects.filter(p => p.difficulty === filter)

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Project Recommendations</h1>
          <p className="text-gray-500 text-sm mt-1">
            {career ? `Projects suited for ${career}` : 'Hands-on project ideas to build your portfolio'}
          </p>
        </div>
        {/* Difficulty filter */}
        <div className="flex gap-1.5">
          {levels.map(l => (
            <button
              key={l}
              onClick={() => setFilter(l)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                ${filter === l ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card text-center py-12">
          <FiFolder className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No projects found. Generate a career recommendation first.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          {filtered.map((project, i) => (
            <div key={project._id || i} className="card hover:shadow-md transition-shadow flex flex-col gap-3">
              {/* Title */}
              <div className="flex items-start justify-between gap-3">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FiCode className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{project.title}</h3>
                  <Badge variant={difficultyVariant[project.difficulty] || 'default'} size="xs">
                    {project.difficulty}
                  </Badge>
                </div>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed">{project.description}</p>

              {/* Tech stack */}
              {project.techStack?.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1.5">Tech Stack</p>
                  <div className="flex flex-wrap gap-1">
                    {project.techStack.map(t => (
                      <Badge key={t} variant="info" size="xs">{t}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Required skills */}
              {project.requiredSkills?.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1.5">Required Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {project.requiredSkills.map(s => (
                      <Badge key={s} variant="default" size="xs">{s}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Learning outcome */}
              {project.learningOutcome && (
                <div className="flex items-start gap-2 p-2 bg-green-50 rounded-lg mt-1">
                  <FiTarget className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-green-700">{project.learningOutcome}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
