import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { FiUser, FiMail, FiLock, FiBook, FiEye, FiEyeOff } from 'react-icons/fi'

export default function Register() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const { register: registerUser, user, error, clearError } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const password = watch('password')

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true })
  }, [user, navigate])

  useEffect(() => {
    if (error) { toast.error(error); clearError() }
  }, [error])

  const onSubmit = async (data) => {
    setLoading(true)
    const { confirmPassword, ...payload } = data
    const result = await registerUser(payload)
    setLoading(false)
    if (result.success) {
      toast.success('Account created! Welcome to AI CareerPath.')
      navigate('/dashboard', { replace: true })
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Create your account</h1>
      <p className="text-gray-500 text-sm mb-8">Start your AI-powered career journey today</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label className="label">Full Name</label>
          <div className="relative">
            <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text" placeholder="Your full name"
              className={`input-field pl-9 ${errors.name ? 'border-red-400' : ''}`}
              {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 characters' } })}
            />
          </div>
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="label">Email address</label>
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="email" placeholder="you@example.com"
              className={`input-field pl-9 ${errors.email ? 'border-red-400' : ''}`}
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' },
              })}
            />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        {/* College + Graduation Year side by side */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">College</label>
            <input
              type="text" placeholder="Your college"
              className={`input-field ${errors.college ? 'border-red-400' : ''}`}
              {...register('college', { required: 'Required' })}
            />
            {errors.college && <p className="text-red-500 text-xs mt-1">{errors.college.message}</p>}
          </div>
          <div>
            <label className="label">Grad Year</label>
            <input
              type="number" placeholder="2025"
              className={`input-field ${errors.graduationYear ? 'border-red-400' : ''}`}
              {...register('graduationYear', {
                required: 'Required',
                min: { value: 2000, message: 'Invalid year' },
                max: { value: 2035, message: 'Invalid year' },
              })}
            />
            {errors.graduationYear && <p className="text-red-500 text-xs mt-1">{errors.graduationYear.message}</p>}
          </div>
        </div>

        {/* Education */}
        <div>
          <label className="label">Education</label>
          <div className="relative">
            <FiBook className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              className={`input-field pl-9 ${errors.education ? 'border-red-400' : ''}`}
              {...register('education', { required: 'Required' })}
            >
              <option value="">Select level</option>
              <option>B.Tech / B.E.</option>
              <option>MCA</option>
              <option>M.Tech / M.E.</option>
              <option>BCA</option>
              <option>B.Sc. (CS/IT)</option>
              <option>M.Sc. (CS/IT)</option>
              <option>MBA (Tech)</option>
              <option>Other</option>
            </select>
          </div>
          {errors.education && <p className="text-red-500 text-xs mt-1">{errors.education.message}</p>}
        </div>

        {/* Password */}
        <div>
          <label className="label">Password</label>
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type={showPwd ? 'text' : 'password'} placeholder="Min 6 characters"
              className={`input-field pl-9 pr-10 ${errors.password ? 'border-red-400' : ''}`}
              {...register('password', { required: 'Password required', minLength: { value: 6, message: 'Min 6 chars' } })}
            />
            <button type="button" onClick={() => setShowPwd(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {showPwd ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="label">Confirm Password</label>
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="password" placeholder="Repeat password"
              className={`input-field pl-9 ${errors.confirmPassword ? 'border-red-400' : ''}`}
              {...register('confirmPassword', {
                required: 'Please confirm',
                validate: v => v === password || 'Passwords do not match',
              })}
            />
          </div>
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
        </div>

        <button
          type="submit" disabled={loading}
          className="btn-primary w-full py-2.5 flex items-center justify-center gap-2 mt-2"
        >
          {loading && <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />}
          {loading ? 'Creating account…' : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-primary-600 font-medium hover:underline">Sign in</Link>
      </p>
    </div>
  )
}
