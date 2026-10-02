import api from './api'

// AUTH
export const authService = {
  register:  (data) => api.post('/auth/register', data),
  login:     (data) => api.post('/auth/login', data),
  me:        ()     => api.get('/auth/me'),
}

// USER / PROFILE
export const userService = {
  getProfile:    ()     => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
}

// ASSESSMENTS
export const assessmentService = {
  getAll:        ()          => api.get('/assessments'),
  getByDomain:   (domain)    => api.get(`/assessments?domain=${domain}`),
  submitResult:  (data)      => api.post('/assessments/submit', data),
  getResults:    ()          => api.get('/assessments/results'),
  getMyResults:  ()          => api.get('/assessments/results/me'),
}

// RECOMMENDATIONS
export const recommendationService = {
  generate: (data)  => api.post('/recommendations', data),
  getLatest: ()     => api.get('/recommendations/latest'),
  getAll:    ()     => api.get('/recommendations'),
}

// CAREERS
export const careerService = {
  getAll: ()       => api.get('/careers'),
  getById: (id)    => api.get(`/careers/${id}`),
}

// ROADMAP
export const roadmapService = {
  get: (careerId) => api.get(`/roadmap?career=${careerId}`),
}

// PROJECTS
export const projectService = {
  getAll:       ()           => api.get('/projects'),
  getByCareer:  (careerId)   => api.get(`/projects?career=${careerId}`),
}

// ADMIN
export const adminService = {
  getUsers:         ()          => api.get('/admin/users'),
  getStats:         ()          => api.get('/admin/stats'),
  getQuestions:     ()          => api.get('/admin/questions'),
  createQuestion:   (data)      => api.post('/admin/questions', data),
  updateQuestion:   (id, data)  => api.put(`/admin/questions/${id}`, data),
  deleteQuestion:   (id)        => api.delete(`/admin/questions/${id}`),
  getCareers:       ()          => api.get('/admin/careers'),
  createCareer:     (data)      => api.post('/admin/careers', data),
  updateCareer:     (id, data)  => api.put(`/admin/careers/${id}`, data),
}
