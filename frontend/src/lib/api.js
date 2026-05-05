import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('agrisakhi_access')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config
    const status = err.response?.status
    const data = err.response?.data

    if (!err.response) {
      err.userMessage = 'Cannot connect to server. Make sure backend is running.'
      return Promise.reject(err)
    }

    if (status === 400) {
      if (data?.phone) err.userMessage = 'Phone number already registered.'
      else if (data?.non_field_errors) err.userMessage = data.non_field_errors[0]
      else if (data?.detail) err.userMessage = data.detail
      else {
        const firstKey = Object.keys(data || {})[0]
        err.userMessage = firstKey ? `${firstKey}: ${data[firstKey][0]}` : 'Invalid data submitted.'
      }
    } else if (status === 403) {
      err.userMessage = 'You do not have permission for this action.'
    } else if (status === 404) {
      err.userMessage = 'Resource not found.'
    } else if (status !== 401) {
      err.userMessage = 'Something went wrong. Please try again.'
    }

    if (status === 401 && !original._retry) {
      original._retry = true
      const refresh = localStorage.getItem('agrisakhi_refresh')
      if (refresh) {
        try {
          const { data: tokenData } = await axios.post(
            `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/auth/token/refresh/`,
            { refresh },
          )
          localStorage.setItem('agrisakhi_access', tokenData.access)
          original.headers.Authorization = `Bearer ${tokenData.access}`
          return api(original)
        } catch {
          localStorage.removeItem('agrisakhi_access')
          localStorage.removeItem('agrisakhi_refresh')
          localStorage.removeItem('agrisakhi_user')
          window.location.hash = '#/login'
        }
      } else {
        err.userMessage = 'Session expired. Please login again.'
      }
    }

    return Promise.reject(err)
  },
)

export const authAPI = {
  register: (data) => api.post('/auth/register/', data),
  login: (data) => api.post('/auth/login/', data),
  forgotPassword: (phone) => api.post('/users/forgot-password/', { phone }),
  resetPassword: (phone, new_password) => api.post('/users/reset-password/', { phone, new_password }),
}

export const usersAPI = {
  getProfile: () => api.get('/users/profile/'),
  updateProfile: (data) => api.patch('/users/profile/', data),
  getNearby: (params) => api.get('/users/nearby/', { params }),
  updateLocation: (data) => api.post('/users/location/', data),
}

export const jobsAPI = {
  list: (params) => api.get('/jobs/', { params }),
  create: (data) => api.post('/jobs/', data),
  getById: (id) => api.get(`/jobs/${id}/`),
  myJobs: () => api.get('/jobs/my/'),
  apply: (jobId) => api.post(`/jobs/${jobId}/apply/`),
  getApplications: (jobId) => api.get(`/jobs/${jobId}/applications/`),
  updateApplication: (appId, data) => api.patch(`/jobs/applications/${appId}/`, data),
}

export const servicesAPI = {
  list: (params) => api.get('/services/', { params }),
  create: (data) => api.post('/services/', data),
  getById: (id) => api.get(`/services/${id}/`),
  myServices: () => api.get('/services/my/'),
}

export const ratingsAPI = {
  create: (data) => api.post('/services/ratings/', data),
}

export const adminAPI = {
  getStats: () => api.get('/users/admin/stats/'),
  getUsers: (params) => api.get('/users/admin/users/', { params }),
  toggleUser: (user_id) => api.post('/users/admin/users/toggle/', { user_id }),
  resetUserPassword: (user_id, new_password) => api.post('/users/admin/users/reset-password/', { user_id, new_password }),
  getJobs: (params) => api.get('/users/admin/jobs/', { params }),
  closeJob: (job_id) => api.post('/users/admin/jobs/close/', { job_id }),
  getServices: () => api.get('/users/admin/services/'),
}

export default api
