import { create } from 'zustand'

const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  isLoggedIn: false,

  setAuth: (user, accessToken, refreshToken) => {
    localStorage.setItem('agrisakhi_access', accessToken)
    localStorage.setItem('agrisakhi_refresh', refreshToken)
    localStorage.setItem('agrisakhi_user', JSON.stringify(user))
    set({ user, accessToken, isLoggedIn: true })
  },

  updateUser: (updates) => {
    set((state) => {
      const user = { ...state.user, ...updates }
      localStorage.setItem('agrisakhi_user', JSON.stringify(user))
      return { user }
    })
  },

  clearAuth: () => {
    localStorage.removeItem('agrisakhi_access')
    localStorage.removeItem('agrisakhi_refresh')
    localStorage.removeItem('agrisakhi_user')
    set({ user: null, accessToken: null, isLoggedIn: false })
  },

  loadFromStorage: () => {
    const access = localStorage.getItem('agrisakhi_access')
    const raw = localStorage.getItem('agrisakhi_user')
    if (access && raw) {
      try {
        const user = JSON.parse(raw)
        set({ user, accessToken: access, isLoggedIn: true })
      } catch {
        /* ignore malformed data */
      }
    }
  },
}))

export default useAuthStore
