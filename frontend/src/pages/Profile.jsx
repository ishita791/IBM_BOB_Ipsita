import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import { userService } from '../services'
import { useToast } from '../context/ToastContext'
import { calcProfileCompletion } from '../utils/helpers'
import ProgressBar from '../components/common/ProgressBar'
import LoadingSpinner from '../components/common/LoadingSpinner'
import Badge from '../components/common/Badge'
import { FiPlus, FiX, FiSave } from 'react-icons/fi'

const TECH_SKILLS = [
  'HTML','CSS','JavaScript','TypeScript','React','Vue.js','Angular','Node.js',
  'Express.js','Python','Django','Flask','FastAPI','Java','Spring Boot',
  'SQL','MySQL','PostgreSQL','MongoDB','Redis','Docker','Kubernetes',
  'AWS','Azure','GCP','Git','Linux','REST API','GraphQL',
]

const PROG_LANGS = [
  'JavaScript','Python','Java','C','C++','C#','TypeScript','Go','Rust','Kotlin','Swift','PHP','Ruby',
]

const DOMAINS = [
  'Full Stack Development','Frontend Development','Backend Development',
  'Data Science','Machine Learning','AI Engineering',
  'Cloud Computing','DevOps','Mobile Development','Cybersecurity',
]

export default function Profile() {
  const { user } = useAuth()
  const toast = useToast()
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState(null)

  // Tag state
  const [techSkills, setTechSkills]     = useState([])
  const [progLangs, setProgLangs]       = useState([])
  const [softSkills, setSoftSkills]     = useState([])
  const [certifications, setCerts]      = useState([])
  const [softSkillInput, setSoftInput]  = useState('')
  const [certInput, setCertInput]       = useState('')

  useEffect(() => {
    userService.getProfile()
      .then(res => {
        const p = res.data.user
        setProfile(p)
        // Prefill form fields
        setValue('education', p.education || '')
        setValue('degree', p.profile?.degree || '')
        setValue('cgpa', p.profile?.cgpa || '')
        setValue('college', p.college || '')
        setValue('graduationYear', p.graduationYear || '')
        setValue('preferredDomain', p.profile?.preferredDomain || '')
        setValue('experienceYears', p.profile?.experienceYears || 0)
        setValue('bio', p.profile?.bio || '')
        setTechSkills(p.profile?.skills?.technical || [])
        setProgLangs(p.profile?.skills?.programmingLanguages || [])
        setSoftSkills(p.profile?.skills?.soft || [])
        setCerts(p.profile?.certifications || [])
      })
      .catch(() => toast.error('Could not load profile'))
      .finally(() => setLoading(false))
  }, [])

  const toggleSkill = (list, setter, skill) => {
    setter(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill])
  }

  const addTag = (input, setter, clearInput) => {
    const v = input.trim()
    if (!v) return
    setter(prev => prev.includes(v) ? prev : [...prev, v])
    clearInput('')
  }

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      const payload = {
        education: data.education,
        college: data.college,
        graduationYear: data.graduationYear,
        profile: {
          degree: data.degree,
          cgpa: parseFloat(data.cgpa) || 0,
          preferredDomain: data.preferredDomain,
          experienceYears: parseInt(data.experienceYears) || 0,
          bio: data.bio,
          skills: {
            technical: techSkills,
            programmingLanguages: progLangs,
            soft: softSkills,
          },
          certifications,
        },
      }
      await userService.updateProfile(payload)
      toast.success('Profile updated successfully!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingSpinner />

  const completion = calcProfileCompletion({
    education: watch('education'),
    degree: watch('degree'),
    cgpa: watch('cgpa'),
    college: watch('college'),
    preferredDomain: watch('preferredDomain'),
    skills: { technical: techSkills, programmingLanguages: progLangs },
  })

  return (
    <div className="max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-500 text-sm mt-1">Keep your profile updated for accurate AI recommendations</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Completion</p>
          <p className="text-xl font-bold text-primary-600">{completion}%</p>
        </div>
      </div>

      <ProgressBar value={completion} label="Profile Completion" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Full Name</label>
              <input className="input-field bg-gray-50" defaultValue={user?.name} disabled />
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input-field bg-gray-50" defaultValue={user?.email} disabled />
            </div>
            <div>
              <label className="label">Education Level</label>
              <select className="input-field" {...register('education')}>
                <option value="">Select</option>
                <option>B.Tech / B.E.</option>
                <option>MCA</option>
                <option>M.Tech / M.E.</option>
                <option>BCA</option>
                <option>B.Sc. (CS/IT)</option>
                <option>M.Sc. (CS/IT)</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="label">Degree / Specialization</label>
              <input className="input-field" placeholder="e.g. Computer Science" {...register('degree')} />
            </div>
            <div>
              <label className="label">College / University</label>
              <input className="input-field" placeholder="Your college name" {...register('college')} />
            </div>
            <div>
              <label className="label">Graduation Year</label>
              <input type="number" className="input-field" placeholder="2025" {...register('graduationYear')} />
            </div>
            <div>
              <label className="label">CGPA / Percentage</label>
              <input type="number" step="0.01" className="input-field" placeholder="8.5 or 85%" {...register('cgpa')} />
            </div>
            <div>
              <label className="label">Experience (years)</label>
              <input type="number" className="input-field" placeholder="0" min="0" max="20" {...register('experienceYears')} />
            </div>
          </div>
          <div className="mt-4">
            <label className="label">Short Bio</label>
            <textarea rows={3} className="input-field" placeholder="Tell us about yourself…" {...register('bio')} />
          </div>
        </div>

        {/* Technical Skills */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-2">Technical Skills</h2>
          <p className="text-xs text-gray-500 mb-3">Select all technologies you are comfortable with</p>
          <div className="flex flex-wrap gap-2">
            {TECH_SKILLS.map(s => (
              <button
                key={s} type="button"
                onClick={() => toggleSkill(techSkills, setTechSkills, s)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors
                  ${techSkills.includes(s)
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-primary-400'}`}
              >
                {s}
              </button>
            ))}
          </div>
          {techSkills.length > 0 && (
            <p className="text-xs text-primary-600 mt-2">{techSkills.length} selected</p>
          )}
        </div>

        {/* Programming Languages */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-2">Programming Languages</h2>
          <div className="flex flex-wrap gap-2">
            {PROG_LANGS.map(l => (
              <button
                key={l} type="button"
                onClick={() => toggleSkill(progLangs, setProgLangs, l)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors
                  ${progLangs.includes(l)
                    ? 'bg-green-600 text-white border-green-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'}`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Soft Skills */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-2">Soft Skills</h2>
          <div className="flex gap-2 mb-3">
            <input
              value={softSkillInput} onChange={e => setSoftInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(softSkillInput, setSoftSkills, setSoftInput) } }}
              placeholder="Type and press Enter" className="input-field flex-1"
            />
            <button type="button" onClick={() => addTag(softSkillInput, setSoftSkills, setSoftInput)} className="btn-outline px-3">
              <FiPlus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {softSkills.map(s => (
              <span key={s} className="flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded-full text-xs">
                {s}
                <button type="button" onClick={() => setSoftSkills(prev => prev.filter(x => x !== s))}>
                  <FiX className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-2">Certifications</h2>
          <div className="flex gap-2 mb-3">
            <input
              value={certInput} onChange={e => setCertInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(certInput, setCerts, setCertInput) } }}
              placeholder="e.g. AWS Cloud Practitioner" className="input-field flex-1"
            />
            <button type="button" onClick={() => addTag(certInput, setCerts, setCertInput)} className="btn-outline px-3">
              <FiPlus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {certifications.map(c => (
              <span key={c} className="flex items-center gap-1 bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-0.5 rounded-full text-xs">
                {c}
                <button type="button" onClick={() => setCerts(prev => prev.filter(x => x !== c))}>
                  <FiX className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Preferred Domain */}
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-2">Career Interest</h2>
          <div>
            <label className="label">Preferred Career Domain</label>
            <select className="input-field" {...register('preferredDomain')}>
              <option value="">Select a domain</option>
              {DOMAINS.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 px-6 py-2.5">
          {saving
            ? <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            : <FiSave className="w-4 h-4" />}
          {saving ? 'Saving…' : 'Save Profile'}
        </button>
      </form>
    </div>
  )
}
