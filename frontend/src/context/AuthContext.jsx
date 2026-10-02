import { createContext, useContext, useReducer, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

const initialState = {
  user: null,
  token: localStorage.getItem('token') || null,
  loading: true,
  error: null,
}

function authReducer(state, action) {
  switch (action.type) {
    case 'AUTH_LOADING':
      return { ...state, loading: true, error: null }
    case 'AUTH_SUCCESS':
      return { ...state, user: action.payload.user, token: action.payload.token, loading: false, error: null }
    case 'AUTH_ERROR':
      return { ...state, error: action.payload, loading: false }
    case 'LOGOUT':
      return { ...initialState, token: null, loading: false }
    case 'SET_USER':
      return { ...state, user: action.payload, loading: false }
    case 'CLEAR_ERROR':
      return { ...state, error: null }
    default:
      return state
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // On mount: verify token and load user
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      dispatch({ type: 'LOGOUT' })
      return
    }
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    api.get('/auth/me')
      .then(res => {
        dispatch({ type: 'SET_USER', payload: res.data.user })
      })
      .catch(() => {
        localStorage.removeItem('token')
        delete api.defaults.headers.common['Authorization']
        dispatch({ type: 'LOGOUT' })
      })
  }, [])

  const login = async (email, password) => {
    dispatch({ type: 'AUTH_LOADING' })
    try {
      const res = await api.post('/auth/login', { email, password })
      const { token, user } = res.data
      localStorage.setItem('token', token)
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      dispatch({ type: 'AUTH_SUCCESS', payload: { user, token } })
      return { success: true, user }
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed'
      dispatch({ type: 'AUTH_ERROR', payload: message })
      return { success: false, message }
    }
  }

  const register = async (userData) => {
    dispatch({ type: 'AUTH_LOADING' })
    try {
      const res = await api.post('/auth/register', userData)
      const { token, user } = res.data
      localStorage.setItem('token', token)
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      dispatch({ type: 'AUTH_SUCCESS', payload: { user, token } })
      return { success: true, user }
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed'
      dispatch({ type: 'AUTH_ERROR', payload: message })
      return { success: false, message }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    delete api.defaults.headers.common['Authorization']
    dispatch({ type: 'LOGOUT' })
  }

  const clearError = () => dispatch({ type: 'CLEAR_ERROR' })

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
