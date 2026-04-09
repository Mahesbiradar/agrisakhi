import { ArrowLeft, Leaf } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useData } from '../context/DataContext.jsx'
import { getDashboardPath } from '../utils/auth.js'

const USERS_STORAGE_KEY = 'agrisakhi_users'
const waveEmoji = '\u{1F44B}'

function readRegisteredUsers() {
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

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { users } = useData()
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()

    const trimmedPhone = phone.trim()
    const trimmedPassword = password.trim()
    const availableUsers = [...users, ...readRegisteredUsers()]
    const matchedUser = availableUsers
      .filter((user, index, list) => list.findIndex((item) => item.phone === user.phone) === index)
      .find((user) => user.phone === trimmedPhone)

    if (!matchedUser) {
      setError('User not found. Please register.')
      return
    }

    if (matchedUser.password && matchedUser.password !== trimmedPassword) {
      setError('Incorrect password. Please try again.')
      return
    }

    if (!matchedUser.password && trimmedPassword.length === 0) {
      setError('Please enter a password.')
      return
    }

    login(matchedUser)
    navigate(getDashboardPath(matchedUser.role), { replace: true })
  }

  return (
    <div className="max-w-[430px] mx-auto min-h-screen bg-gradient-to-b from-green-50 via-white to-white relative">
      <div className="px-5 pb-8 pt-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div className="mt-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-600 text-white">
            <Leaf className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-green-700">AgriSakhi Login</p>
            <h1 className="text-3xl font-black text-slate-900">Welcome Back {waveEmoji}</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="phone">
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={phone}
              onChange={(event) => {
                setPhone(event.target.value.replace(/\D/g, '').slice(0, 10))
                setError('')
              }}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-base text-slate-900 outline-none ring-0 placeholder:text-slate-400 focus:border-green-500"
              placeholder="Enter 10 digit mobile number"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value)
                setError('')
              }}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-green-500"
              placeholder="Enter your password"
              required
            />
          </div>

          {error ? (
            <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            className="w-full rounded-2xl bg-green-600 px-4 py-4 text-base font-semibold text-white shadow-lg shadow-green-100 transition hover:bg-green-700"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          New user?{' '}
          <Link to="/register" className="font-semibold text-green-700">
            Register here
          </Link>
        </p>
      </div>
    </div>
  )
}
