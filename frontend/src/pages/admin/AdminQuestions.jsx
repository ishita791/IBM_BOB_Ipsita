import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { adminService } from '../../services'
import { useToast } from '../../context/ToastContext'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Modal from '../../components/common/Modal'
import Badge from '../../components/common/Badge'
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi'

const DOMAINS = ['javascript','react','nodejs','python','sql','datascience','ml','java','cloud']

export default function AdminQuestions() {
  const toast = useToast()
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [search, setSearch] = useState('')
  const [domainFilter, setDomainFilter] = useState('all')
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm()

  const fetchQuestions = () => {
    adminService.getQuestions()
      .then(res => setQuestions(res.data.questions || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchQuestions() }, [])

  const openCreate = () => { setEditing(null); reset(); setModalOpen(true) }

  const openEdit = (q) => {
    setEditing(q)
    setValue('domain', q.domain)
    setValue('question', q.question)
    setValue('option0', q.options[0] || '')
    setValue('option1', q.options[1] || '')
    setValue('option2', q.options[2] || '')
    setValue('option3', q.options[3] || '')
    setValue('correctAnswer', q.correctAnswer)
    setValue('difficulty', q.difficulty)
    setModalOpen(true)
  }

  const onSubmit = async (data) => {
    const payload = {
      domain: data.domain,
      question: data.question,
      options: [data.option0, data.option1, data.option2, data.option3],
      correctAnswer: parseInt(data.correctAnswer),
      difficulty: data.difficulty,
    }
    try {
      if (editing) {
        await adminService.updateQuestion(editing._id, payload)
        toast.success('Question updated')
      } else {
        await adminService.createQuestion(payload)
        toast.success('Question created')
      }
      setModalOpen(false)
      fetchQuestions()
    } catch {
      toast.error('Failed to save question')
    }
  }

  const deleteQuestion = async (id) => {
    if (!window.confirm('Delete this question?')) return
    try {
      await adminService.deleteQuestion(id)
      toast.success('Question deleted')
      setQuestions(prev => prev.filter(q => q._id !== id))
    } catch {
      toast.error('Delete failed')
    }
  }

  if (loading) return <LoadingSpinner />

  const filtered = questions.filter(q => {
    const matchDomain = domainFilter === 'all' || q.domain === domainFilter
    const matchSearch = q.question.toLowerCase().includes(search.toLowerCase())
    return matchDomain && matchSearch
  })

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assessment Questions</h1>
          <p className="text-gray-500 text-sm">{questions.length} questions in database</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm">
          <FiPlus className="w-4 h-4" /> Add Question
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search questions…" className="input-field pl-9 w-56"
          />
        </div>
        <select className="input-field w-40" value={domainFilter} onChange={e => setDomainFilter(e.target.value)}>
          <option value="all">All Domains</option>
          {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                {['Domain','Question','Difficulty','Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(q => (
                <tr key={q._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <Badge variant="primary" size="xs">{q.domain}</Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate">{q.question}</td>
                  <td className="px-4 py-3">
                    <Badge variant={q.difficulty === 'Easy' ? 'success' : q.difficulty === 'Medium' ? 'warning' : 'danger'} size="xs">
                      {q.difficulty}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(q)} className="p-1.5 rounded text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors">
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteQuestion(q._id)} className="p-1.5 rounded text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-400 text-sm">No questions found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Question form modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Question' : 'Add Question'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Domain</label>
              <select className="input-field" {...register('domain', { required: true })}>
                <option value="">Select</option>
                {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Difficulty</label>
              <select className="input-field" {...register('difficulty', { required: true })}>
                <option value="">Select</option>
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">Question</label>
            <textarea rows={2} className="input-field" placeholder="Enter the question…" {...register('question', { required: true })} />
          </div>

          <div className="space-y-2">
            <label className="label">Options (A–D)</label>
            {[0,1,2,3].map(i => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-6 text-sm font-medium text-gray-500">{String.fromCharCode(65+i)}.</span>
                <input className="input-field flex-1" placeholder={`Option ${String.fromCharCode(65+i)}`} {...register(`option${i}`, { required: true })} />
              </div>
            ))}
          </div>

          <div>
            <label className="label">Correct Answer (0-3)</label>
            <select className="input-field" {...register('correctAnswer', { required: true })}>
              {[0,1,2,3].map(i => (
                <option key={i} value={i}>Option {String.fromCharCode(65+i)}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary flex-1">
              {editing ? 'Update Question' : 'Create Question'}
            </button>
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
