import { Outlet, Link } from 'react-router-dom'
import { MdOutlineAutoAwesome } from 'react-icons/md'

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 mb-8">
        <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
          <MdOutlineAutoAwesome className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold text-white">AI CareerPath</span>
      </Link>

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <Outlet />
      </div>

      {/* Footer */}
      <p className="mt-6 text-sm text-white/60">
        © 2024 AI CareerPath. All rights reserved.
      </p>
    </div>
  )
}
