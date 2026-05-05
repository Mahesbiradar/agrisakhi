import { ArrowLeft, Leaf, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PhoneInput from '../components/PhoneInput.jsx'
import { authAPI, usersAPI } from '../lib/api.js'
import useAuthStore from '../store/authStore.js'
import { getDashboardPath } from '../utils/auth.js'

const waveEmoji = '\u{1F44B}'

export default function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
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
    <div className="page-container bg-gradient-to-b from-green-50 via-white to-white">
      <div className="px-5 pb-8 pt-6">
        <button type="button" onClick={() => navigate(-1)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm">
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div className="mt-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-600 text-white">
            <Leaf className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-green-700">AgriSakhi Login</p>
            <h1 className="text-3xl font-black text-slate-900">{t('loginTitle')} {waveEmoji}</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="phone">{t('phone')}</label>
            <PhoneInput id="phone" value={phone} onChange={(v) => { setPhone(v); setError('') }} required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="password">{t('password')}</label>
            <input id="password" type="password" value={password}
              onChange={(e) => { setPassword(e.target.value); setError('') }}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-green-500"
              placeholder="Enter your password" required />
          </div>

          {error && (
            <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</p>
          )}

          <button type="submit" disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 py-4 text-base font-semibold text-white shadow-lg shadow-green-100 transition hover:bg-green-700 disabled:opacity-60">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {t('login')}
          </button>

          <button type="button" onClick={() => navigate('/forgot-password')}
            className="mt-2 w-full text-center text-sm text-green-700 underline">
            {t('forgotPassword')}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          {t('newUser')}{' '}
          <Link to="/register" className="font-semibold text-green-700">{t('register')}</Link>
        </p>
      </div>
    </div>
  )
}
