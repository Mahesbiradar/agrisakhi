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
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true
      const refresh = localStorage.getItem('agrisakhi_refresh')
      if (refresh) {
        try {
          const { data } = await axios.post(
            `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/auth/token/refresh/`,
            { refresh },
          )
          localStorage.setItem('agrisakhi_access', data.access)
          original.headers.Authorization = `Bearer ${data.access}`
          return api(original)
        } catch {
          localStorage.removeItem('agrisakhi_access')
          localStorage.removeItem('agrisakhi_refresh')
          localStorage.removeItem('agrisakhi_user')
          window.location.hash = '#/login'
        }
      }
    }
    return Promise.reject(err)
  },
)

export const authAPI = {
  register: (data) => api.post('/auth/register/', data),
  login: (data) => api.post('/auth/login/', data),
}

export const usersAPI = {
  getProfile: () => api.get('/users/profile/'),
  updateProfile: (data) => api.patch('/users/profile/', data),
  getNearby: (params) => api.get('/users/nearby/', { params }),
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

export default api
