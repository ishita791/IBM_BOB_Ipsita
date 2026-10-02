import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  FiHome, FiUser, FiClipboard, FiAward, FiBarChart2,
  FiBook, FiFolder, FiTrendingUp, FiUsers, FiHelpCircle,
  FiShield,
} from 'react-icons/fi'
import { MdOutlineAutoAwesome } from 'react-icons/md'

const studentLinks = [
  { to: '/dashboard',             label: 'Dashboard',         icon: FiHome       },
  { to: '/profile',               label: 'My Profile',        icon: FiUser       },
  { to: '/assessment',            label: 'Skill Assessment',  icon: FiClipboard  },
  { to: '/career-recommendation', label: 'Career Paths',      icon: FiAward      },
  { to: '/skill-gap',             label: 'Skill Gap',         icon: FiBarChart2  },
  { to: '/roadmap',               label: 'Learning Roadmap',  icon: FiBook       },
  { to: '/projects',              label: 'Projects',          icon: FiFolder     },
  { to: '/progress',              label: 'My Progress',       icon: FiTrendingUp },
]

const adminLinks = [
  { to: '/admin',           label: 'Overview',      icon: FiShield     },
  { to: '/admin/users',     label: 'Users',         icon: FiUsers      },
  { to: '/admin/questions', label: 'Questions',     icon: FiHelpCircle },
]

export default function Sidebar({ open, onClose }) {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  const links = isAdmin ? [...studentLinks, ...adminLinks] : studentLinks

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-16 left-0 bottom-0 z-30 w-64 bg-white border-r border-gray-100
          transform transition-transform duration-300 ease-in-out overflow-y-auto
          lg:translate-x-0
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* User info block */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-700 font-semibold text-sm">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-0.5">
          {/* Student links */}
          <p className="px-3 pt-2 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Student
          </p>
          {studentLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/dashboard'}
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'}`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </NavLink>
          ))}

          {/* Admin links */}
          {isAdmin && (
            <>
              <p className="px-3 pt-4 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Admin
              </p>
              {adminLinks.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/admin'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'}`
                  }
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {label}
                </NavLink>
              ))}
            </>
          )}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary-600 rounded flex items-center justify-center">
              <MdOutlineAutoAwesome className="w-3.5 h-3.5 text-white" />
            </div>
            <p className="text-xs text-gray-500">AI CareerPath v1.0</p>
          </div>
        </div>
      </aside>
    </>
  )
}
