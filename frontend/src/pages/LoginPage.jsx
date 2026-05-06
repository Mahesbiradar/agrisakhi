import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import AuthLayout from '../components/AuthLayout.jsx'
import PhoneInput from '../components/PhoneInput.jsx'
import { authAPI, usersAPI } from '../lib/api.js'
import useAuthStore from '../store/authStore.js'
import { getDashboardPath } from '../utils/auth.js'

const rolePills = [
  { emoji: '🌾', label: 'Farmers' },
  { emoji: '👷', label: 'Labourers' },
  { emoji: '🚜', label: 'Providers' },
]

export default function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await authAPI.login({ phone: phone.trim(), password })
      setAuth(res.data.user, res.data.access, res.data.refresh)
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          usersAPI.updateLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }).catch(() => {})
        },
        () => {},
      )
      navigate(getDashboardPath(res.data.user.role), { replace: true })
    } catch (err) {
      setError(err.userMessage || t('invalidCreds'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="flex items-center gap-2 mb-6 lg:hidden">
        <span className="text-2xl">🌿</span>
        <span className="font-bold text-green-800 text-lg">AgriSakhi</span>
      </div>

      <h1 className="text-2xl font-black text-slate-900">Welcome back 👋</h1>
      <p className="mt-1 text-sm text-slate-500">Login to your AgriSakhi account</p>

      <div className="mt-4 flex items-center gap-2">
        {rolePills.map((r) => (
          <div key={r.label} className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600">
            <span>{r.emoji}</span>
            <span>{r.label}</span>
          </div>
        ))}
      </div>
      <p className="mt-1.5 text-xs text-slate-400">Login works for all roles</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-700" htmlFor="phone">{t('phone')}</label>
          <PhoneInput id="phone" value={phone} onChange={(v) => { setPhone(v); setError('') }} required />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-700" htmlFor="password">{t('password')}</label>
          <div className="relative">
            <input id="password" type={showPassword ? 'text' : 'password'} value={password}
              onChange={(e) => { setPassword(e.target.value); setError('') }}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-4 pr-12 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-green-500"
              placeholder="Enter your password" required />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</p>
        )}

        <button type="submit" disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-4 text-base font-semibold text-white shadow-lg shadow-green-100 transition hover:bg-green-700 disabled:opacity-60">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? 'Logging in...' : t('login')}
        </button>

        <div className="text-right">
          <button type="button" onClick={() => navigate('/forgot-password')}
            className="text-sm text-green-700 hover:underline">
            {t('forgotPassword')}
          </button>
        </div>
      </form>

      <div className="mt-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200" />
        <span className="text-xs text-slate-400">or</span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-slate-600 mb-3">New to AgriSakhi?</p>
        <div className="flex gap-2 justify-center">
          {[
            { emoji: '🌾', label: 'Farmer', role: 'farmer' },
            { emoji: '👷', label: 'Labour', role: 'labour' },
            { emoji: '🚜', label: 'Provider', role: 'provider' },
          ].map((r) => (
            <Link key={r.role} to={`/register?role=${r.role}`}
              className="flex items-center gap-1.5 rounded-full border border-green-300 bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 hover:bg-green-100 transition">
              {r.emoji} {r.label}
            </Link>
          ))}
        </div>
      </div>
    </AuthLayout>
  )
}
