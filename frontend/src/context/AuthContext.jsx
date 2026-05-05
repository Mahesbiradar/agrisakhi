import { createContext, useContext, useEffect, useState } from 'react'

const STORAGE_KEY = 'agrisakhi_user'
const USERS_STORAGE_KEY = 'agrisakhi_users'
const DEFAULT_COORDS = {
  lat: 14.2,
  lng: 75.9,
}

const AuthContext = createContext(null)

function readStoredUser() {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const storedUser = window.localStorage.getItem(STORAGE_KEY)
    return storedUser ? JSON.parse(storedUser) : null
  } catch {
    return null
  }
}

function persistUser(user) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

function readStoredUsers() {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const storedUsers = window.localStorage.getItem(USERS_STORAGE_KEY)
    return storedUsers ? JSON.parse(storedUsers) : []
  } catch {
    return []
  }
}

function persistUsers(users) {
  window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => readStoredUser())

  useEffect(() => {
    const savedUser = readStoredUser()

    if (savedUser) {
      setCurrentUser(savedUser)
    }
  }, [])

  const login = (userData) => {
    persistUser(userData)
    setCurrentUser(userData)
  }

  const logout = () => {
    window.localStorage.removeItem(STORAGE_KEY)
    setCurrentUser(null)
  }

  const register = (userData) => {
    const registeredUser = {
      id: Date.now().toString(),
      name: userData.name,
      phone: userData.phone,
      password: userData.password,
      role: userData.role,
      village: userData.village,
      district: userData.district,
      lat: userData.lat ?? DEFAULT_COORDS.lat,
      lng: userData.lng ?? DEFAULT_COORDS.lng,
      avatar: userData.avatar ?? userData.name?.trim()?.charAt(0)?.toUpperCase() ?? 'A',
      createdAt: new Date().toISOString(),
    }

    const savedUsers = readStoredUsers()
    persistUsers([...savedUsers.filter((user) => user.phone !== registeredUser.phone), registeredUser])
    persistUser(registeredUser)
    setCurrentUser(registeredUser)

    return registeredUser
  }

  const value = {
    currentUser,
    isLoggedIn: Boolean(currentUser),
    login,
    logout,
    register,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
