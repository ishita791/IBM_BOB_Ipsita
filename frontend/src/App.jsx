import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'

// Layouts
import AppLayout    from './layouts/AppLayout'
import AuthLayout   from './layouts/AuthLayout'

// Guards
import ProtectedRoute from './components/common/ProtectedRoute'

// Public pages
import Landing      from './pages/Landing'
import Login        from './pages/Login'
import Register     from './pages/Register'

// Authenticated pages
import Dashboard    from './pages/Dashboard'
import Profile      from './pages/Profile'
import Assessment   from './pages/Assessment'
import AssessmentResults from './pages/AssessmentResults'
import CareerRecommendation from './pages/CareerRecommendation'
import SkillGap     from './pages/SkillGap'
import Roadmap      from './pages/Roadmap'
import Projects     from './pages/Projects'
import Progress     from './pages/Progress'

// Admin pages
import AdminOverview   from './pages/admin/AdminOverview'
import AdminUsers      from './pages/admin/AdminUsers'
import AdminQuestions  from './pages/admin/AdminQuestions'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Landing />} />

            {/* Auth */}
            <Route element={<AuthLayout />}>
              <Route path="/login"    element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* Protected app routes */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard"              element={<Dashboard />} />
              <Route path="/profile"                element={<Profile />} />
              <Route path="/assessment"             element={<Assessment />} />
              <Route path="/assessment/results"     element={<AssessmentResults />} />
              <Route path="/career-recommendation"  element={<CareerRecommendation />} />
              <Route path="/skill-gap"              element={<SkillGap />} />
              <Route path="/roadmap"                element={<Roadmap />} />
              <Route path="/projects"               element={<Projects />} />
              <Route path="/progress"               element={<Progress />} />

              {/* Admin routes */}
              <Route path="/admin"           element={<ProtectedRoute adminOnly><AdminOverview /></ProtectedRoute>} />
              <Route path="/admin/users"     element={<ProtectedRoute adminOnly><AdminUsers /></ProtectedRoute>} />
              <Route path="/admin/questions" element={<ProtectedRoute adminOnly><AdminQuestions /></ProtectedRoute>} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
