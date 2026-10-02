import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { adminService } from '../../services'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import StatCard from '../../components/common/StatCard'
import { FiUsers, FiHelpCircle, FiBarChart2, FiAward } from 'react-icons/fi'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'

const COLORS = ['#6366f1','#10b981','#f59e0b','#ef4444','#8b5cf6']

export default function AdminOverview() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminService.getStats()
      .then(res => setStats(res.data.stats))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Platform statistics and management</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Users"            value={stats?.totalUsers ?? 0}           icon={FiUsers}      color="primary" />
        <StatCard title="Assessments Submitted"  value={stats?.totalAssessments ?? 0}     icon={FiBarChart2}  color="green"   />
        <StatCard title="Total Questions"        value={stats?.totalQuestions ?? 0}        icon={FiHelpCircle} color="purple"  />
        <StatCard title="Recommendations"        value={stats?.totalRecommendations ?? 0} icon={FiAward}      color="yellow"  />
      </div>

      {/* Career distribution chart */}
      {stats?.careerDistribution?.length > 0 && (
        <div className="card">
          <h2 className="font-semibold text-gray-900 mb-4">Career Recommendation Distribution</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={stats.careerDistribution} margin={{ top: 5, right: 20, left: 0, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis dataKey="_id" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" interval={0} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" radius={[4,4,0,0]}>
                {stats.careerDistribution.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Quick links */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Link to="/admin/users"     className="card hover:shadow-md transition-shadow flex items-center gap-3">
          <FiUsers     className="w-6 h-6 text-primary-500" />
          <span className="font-medium text-gray-800">Manage Users</span>
        </Link>
        <Link to="/admin/questions" className="card hover:shadow-md transition-shadow flex items-center gap-3">
          <FiHelpCircle className="w-6 h-6 text-purple-500" />
          <span className="font-medium text-gray-800">Manage Questions</span>
        </Link>
        <div className="card flex items-center gap-3">
          <FiBarChart2 className="w-6 h-6 text-green-500" />
          <div>
            <p className="font-medium text-gray-800">Avg Score</p>
            <p className="text-sm text-gray-500">{stats?.avgAssessmentScore?.toFixed(1) ?? '—'}%</p>
          </div>
        </div>
      </div>
    </div>
  )
}
