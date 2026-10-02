import { Link } from 'react-router-dom'
import {
  FiArrowRight, FiCheckCircle, FiBriefcase, FiBarChart2,
  FiBook, FiUsers, FiAward, FiZap,
} from 'react-icons/fi'
import { MdOutlineAutoAwesome } from 'react-icons/md'

const features = [
  { icon: FiAward,      title: 'AI Career Recommendations', desc: 'Machine learning model analyzes your skills and predicts the best-fit career paths with confidence scores.' },
  { icon: FiBarChart2,  title: 'Skill Gap Analysis',        desc: 'Instantly see which skills you have and which you need to land your target role.' },
  { icon: FiBook,       title: 'Learning Roadmap',          desc: 'Get a personalized, phase-by-phase study plan to bridge your skill gaps effectively.' },
  { icon: FiBriefcase,  title: 'Project Suggestions',       desc: 'Receive hands-on project ideas matched to your current skill level and target career.' },
  { icon: FiCheckCircle,title: 'Skill Assessments',         desc: 'Domain-specific quizzes measure your real proficiency and feed into the ML recommendation engine.' },
  { icon: FiZap,        title: 'Progress Tracking',         desc: 'Monitor your learning journey with visual charts and milestone tracking.' },
]

const careers = [
  'Full Stack Developer', 'Frontend Developer', 'Backend Developer',
  'Data Analyst', 'Data Scientist', 'Machine Learning Engineer',
  'AI Engineer', 'Cloud Engineer', 'DevOps Engineer', 'Software Developer',
]

const stats = [
  { value: '10+',  label: 'Career Paths'       },
  { value: '500+', label: 'Assessment Questions'},
  { value: '95%',  label: 'Recommendation Accuracy'},
  { value: '50+',  label: 'Project Suggestions'},
]

const steps = [
  { step: '01', title: 'Create Your Profile', desc: 'Fill in your education, skills, projects and experience.' },
  { step: '02', title: 'Take Skill Assessment', desc: 'Complete domain-specific quizzes to measure your proficiency.' },
  { step: '03', title: 'Get AI Recommendations', desc: 'Our ML model analyzes your profile and recommends best-fit careers.' },
  { step: '04', title: 'Follow Your Roadmap', desc: 'Learn the missing skills through a personalized learning plan.' },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <MdOutlineAutoAwesome className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900">AI CareerPath</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login"    className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2">Sign In</Link>
            <Link to="/register" className="btn-primary text-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <MdOutlineAutoAwesome className="w-4 h-4 text-accent-400" />
            <span className="text-white/90 text-sm font-medium">AI-Powered Career Guidance</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Discover Your Ideal<br />
            <span className="text-accent-400">Career Path</span> with AI
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            AI CareerPath uses machine learning to analyze your skills, assess your knowledge, and recommend personalized career paths — along with roadmaps to get you there.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold px-8 py-3 rounded-xl hover:bg-gray-50 transition-colors shadow-lg"
            >
              Start for Free <FiArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 border border-white/30 text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/10 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-16 bg-gray-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map(({ value, label }) => (
              <div key={label}>
                <p className="text-3xl font-bold text-primary-600">{value}</p>
                <p className="text-sm text-gray-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-2">Process</p>
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">Four simple steps to land your dream career</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-14 h-14 bg-primary-50 border-2 border-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-600 font-bold text-lg">{step}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-2">Features</p>
            <h2 className="text-3xl font-bold text-gray-900">Everything You Need</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CAREER DOMAINS ── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-2">Domains</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Career Paths We Cover</h2>
          <p className="text-gray-500 mb-10 max-w-xl mx-auto">Our AI recommends from 10 high-demand tech careers</p>
          <div className="flex flex-wrap justify-center gap-3">
            {careers.map(c => (
              <span key={c} className="bg-primary-50 text-primary-700 border border-primary-200 px-4 py-2 rounded-full text-sm font-medium">
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary-700 to-primary-900">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Find Your Career?</h2>
          <p className="text-white/80 mb-8 text-lg">Join thousands of students who have already discovered their ideal tech career path.</p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold px-8 py-3 rounded-xl hover:bg-gray-50 transition-colors shadow-lg"
          >
            Create Free Account <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-gray-900 text-gray-400 py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center">
                <MdOutlineAutoAwesome className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white">AI CareerPath</span>
            </div>
            <p className="text-sm">© 2024 AI CareerPath. Built with React, Node.js &amp; Python ML.</p>
            <div className="flex items-center gap-4 text-sm">
              <Link to="/login"    className="hover:text-white transition-colors">Login</Link>
              <Link to="/register" className="hover:text-white transition-colors">Register</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
