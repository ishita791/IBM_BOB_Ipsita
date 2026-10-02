import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { assessmentService } from '../services'
import { useToast } from '../context/ToastContext'
import LoadingSpinner from '../components/common/LoadingSpinner'
import ProgressBar from '../components/common/ProgressBar'
import Badge from '../components/common/Badge'
import { FiChevronRight, FiClock } from 'react-icons/fi'

const DOMAINS = [
  { id: 'javascript',    label: 'JavaScript',     color: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
  { id: 'react',         label: 'React',          color: 'bg-blue-50 border-blue-200 text-blue-700'       },
  { id: 'nodejs',        label: 'Node.js',         color: 'bg-green-50 border-green-200 text-green-700'    },
  { id: 'python',        label: 'Python',          color: 'bg-purple-50 border-purple-200 text-purple-700' },
  { id: 'sql',           label: 'SQL',             color: 'bg-orange-50 border-orange-200 text-orange-700' },
  { id: 'datascience',   label: 'Data Science',    color: 'bg-pink-50 border-pink-200 text-pink-700'       },
  { id: 'ml',            label: 'Machine Learning',color: 'bg-indigo-50 border-indigo-200 text-indigo-700' },
  { id: 'java',          label: 'Java',            color: 'bg-red-50 border-red-200 text-red-700'          },
  { id: 'cloud',         label: 'Cloud Computing', color: 'bg-sky-50 border-sky-200 text-sky-700'          },
]

export default function Assessment() {
  const toast = useToast()
  const navigate = useNavigate()

  const [phase, setPhase] = useState('select') // select | quiz | submitting
  const [selectedDomain, setSelectedDomain] = useState(null)
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [current, setCurrent] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [loadingQ, setLoadingQ] = useState(false)

  // Timer countdown during quiz
  useEffect(() => {
    if (phase !== 'quiz' || timeLeft <= 0) return
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer)
          submitAssessment()
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [phase, timeLeft])

  const startDomain = async (domain) => {
    setLoadingQ(true)
    try {
      const res = await assessmentService.getByDomain(domain.id)
      const qs = res.data.questions || []
      if (qs.length === 0) {
        toast.error('No questions available for this domain yet.')
        return
      }
      setSelectedDomain(domain)
      setQuestions(qs)
      setAnswers({})
      setCurrent(0)
      setTimeLeft(qs.length * 60) // 1 min per question
      setPhase('quiz')
    } catch {
      toast.error('Failed to load questions.')
    } finally {
      setLoadingQ(false)
    }
  }

  const selectAnswer = (qId, optionIdx) => {
    setAnswers(prev => ({ ...prev, [qId]: optionIdx }))
  }

  const submitAssessment = async () => {
    setPhase('submitting')
    try {
      const payload = {
        domain: selectedDomain.id,
        answers: questions.map(q => ({
          questionId: q._id,
          selectedOption: answers[q._id] ?? -1,
        })),
      }
      const res = await assessmentService.submitResult(payload)
      toast.success(`Assessment submitted! Score: ${res.data.result.percentage}%`)
      navigate('/assessment/results')
    } catch {
      toast.error('Failed to submit assessment.')
      setPhase('quiz')
    }
  }

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`
  const progress = questions.length ? Math.round((current / questions.length) * 100) : 0

  // ── SELECT DOMAIN SCREEN ──
  if (phase === 'select') {
    return (
      <div className="max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Skill Assessment</h1>
          <p className="text-gray-500 text-sm mt-1">Select a domain to test your skills. Results feed directly into your AI career recommendation.</p>
        </div>
        {loadingQ && <LoadingSpinner />}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DOMAINS.map(d => (
            <button
              key={d.id}
              onClick={() => startDomain(d)}
              className={`card flex items-center justify-between hover:shadow-md transition-shadow cursor-pointer border ${d.color}`}
            >
              <span className="font-semibold text-base">{d.label}</span>
              <FiChevronRight className="w-5 h-5" />
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400">Each test has 10 questions. You have 1 minute per question.</p>
      </div>
    )
  }

  // ── SUBMITTING ──
  if (phase === 'submitting') return <LoadingSpinner />

  // ── QUIZ SCREEN ──
  const q = questions[current]

  return (
    <div className="max-w-2xl space-y-6">
      {/* Quiz header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 capitalize">{selectedDomain.label} Assessment</h1>
          <p className="text-sm text-gray-500">Question {current + 1} of {questions.length}</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold text-sm ${timeLeft < 60 ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-700'}`}>
          <FiClock className="w-4 h-4" />
          {formatTime(timeLeft)}
        </div>
      </div>

      <ProgressBar value={progress} label={`Progress`} />

      {/* Question card */}
      <div className="card">
        <p className="font-medium text-gray-900 mb-6 text-base leading-relaxed">{current + 1}. {q?.question}</p>
        <div className="space-y-3">
          {q?.options?.map((opt, i) => (
            <button
              key={i}
              onClick={() => selectAnswer(q._id, i)}
              className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all
                ${answers[q._id] === i
                  ? 'bg-primary-600 text-white border-primary-600 font-medium'
                  : 'bg-white border-gray-200 hover:border-primary-400 hover:bg-primary-50'
                }`}
            >
              <span className="font-medium mr-2">{String.fromCharCode(65 + i)}.</span>
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between">
        <button
          disabled={current === 0}
          onClick={() => setCurrent(p => p - 1)}
          className="btn-secondary disabled:opacity-40"
        >
          ← Previous
        </button>
        <div className="flex gap-2">
          {current < questions.length - 1 ? (
            <button onClick={() => setCurrent(p => p + 1)} className="btn-primary">
              Next →
            </button>
          ) : (
            <button
              onClick={submitAssessment}
              className="btn-primary bg-green-600 hover:bg-green-700"
            >
              Submit Assessment ✓
            </button>
          )}
        </div>
      </div>

      {/* Question navigator dots */}
      <div className="flex flex-wrap gap-1.5 pt-2">
        {questions.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-7 h-7 rounded text-xs font-medium transition-colors
              ${i === current ? 'bg-primary-600 text-white'
                : answers[questions[i]._id] !== undefined ? 'bg-green-100 text-green-700 border border-green-300'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  )
}
