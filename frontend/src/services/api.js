import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default {
  // Auth
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.post('/auth/change-password', data),

  // Sessions
  getSessions: (params) => api.get('/sessions', { params }),
  getSession: (id) => api.get(`/sessions/${id}`),
  createSession: (data) => api.post('/sessions', data),
  updateSession: (id, data) => api.put(`/sessions/${id}`, data),
  completeSession: (id, data) => api.put(`/sessions/${id}/complete`, data),
  deleteSession: (id) => api.delete(`/sessions/${id}`),
  getMissedSessions: () => api.get('/sessions/missed'),
  getMemberStats: (memberId) => api.get(`/sessions/stats/${memberId || ''}`),

  // Workout Plans
  getWorkoutPlans: () => api.get('/workout-plans'),
  getWorkoutPlan: (id) => api.get(`/workout-plans/${id}`),
  getTrainerWorkoutPlans: (trainerId) => api.get(`/workout-plans/trainer/${trainerId}`),
  createWorkoutPlan: (data) => api.post('/workout-plans', data),
  updateWorkoutPlan: (id, data) => api.put(`/workout-plans/${id}`, data),
  deleteWorkoutPlan: (id) => api.delete(`/workout-plans/${id}`),

  // Exercises
  getExercises: () => api.get('/exercises'),
  getExercise: (id) => api.get(`/exercises/${id}`),
  getWorkoutExercises: (workoutId) => api.get(`/exercises/workout/${workoutId}`),
  createExercise: (data) => api.post('/exercises', data),
  updateExercise: (id, data) => api.put(`/exercises/${id}`, data),
  deleteExercise: (id) => api.delete(`/exercises/${id}`),

  // Memberships
  getMemberships: () => api.get('/memberships'),
  getMembership: (id) => api.get(`/memberships/${id}`),
  getUserMemberships: (userId) => api.get(`/memberships/user/${userId || ''}`),
  getActiveMembership: (userId) => api.get(`/memberships/active/${userId || ''}`),
  createMembership: (data) => api.post('/memberships', data),
  updateMembership: (id, data) => api.put(`/memberships/${id}`, data),
  deleteMembership: (id) => api.delete(`/memberships/${id}`),
  getRevenueStats: () => api.get('/memberships/revenue'),

  // Users (Admin)
  getUsers: (params) => api.get('/users', { params }),
  getUser: (id) => api.get(`/users/${id}`),
  createUser: (data) => api.post('/users', data),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
  getUserStats: () => api.get('/users/stats'),

  // Reviews
  getReviews: () => api.get('/reviews'),
  getReview: (id) => api.get(`/reviews/${id}`),
  getTrainerReviews: (trainerId) => api.get(`/reviews/trainer/${trainerId}`),
  getTrainerRating: (trainerId) => api.get(`/reviews/trainer/${trainerId}/rating`),
  createReview: (data) => api.post('/reviews', data),
  updateReview: (id, data) => api.put(`/reviews/${id}`, data),
  deleteReview: (id) => api.delete(`/reviews/${id}`),

  // Dashboard
  getMemberDashboard: () => api.get('/dashboard/member'),
  getTrainerDashboard: () => api.get('/dashboard/trainer'),
  getAdminDashboard: () => api.get('/dashboard/admin')
}
