import { Eye, EyeOff, Loader2, MapPin } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import AuthLayout from '../components/AuthLayout.jsx'
import PhoneInput from '../components/PhoneInput.jsx'
import { authAPI } from '../lib/api.js'
import useAuthStore from '../store/authStore.js'
import { getDashboardPath } from '../utils/auth.js'

const roleOptions = [
  { value: 'farmer', label: 'Farmer', emoji: '🌾', locationText: 'labourers and services' },
  { value: 'labour', label: 'Labour', emoji: '👷', locationText: 'job postings' },
  { value: 'provider', label: 'Service Provider', emoji: '🚜', locationText: 'farmers looking for services' },
]

export default function RegisterPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { setAuth } = useAuthStore()

  const requestedRole = searchParams.get('role')
  const initialRole = roleOptions.find((o) => o.value === requestedRole)?.value ?? 'farmer'

  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({ name: '', phone: '', password: '', role: initialRole })
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [locating, setLocating] = useState(false)
  const [error, setError] = useState('')

  const update = (field, value) => setFormData((f) => ({ ...f, [field]: value }))

  const handleNext = (e) => { e.preventDefault(); setStep(2) }

  const doRegister = async (lat, lng) => {
    setSubmitting(true)
    setError('')
    try {
      const res = await authAPI.register({ ...formData, lat, lng, village: '', district: '' })
      setAuth(res.data.user, res.data.access, res.data.refresh)
      navigate(getDashboardPath(res.data.user.role), { replace: true })
    } catch (err) {
      setError(err.userMessage || t('phoneRegistered'))
      setSubmitting(false)
      setLocating(false)
    }
  }

  const handleAllowLocation = () => {
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => doRegister(pos.coords.latitude, pos.coords.longitude),
      () => doRegister(null, null),
    )
  }

  const handleSkipLocation = () => doRegister(null, null)

  const selectedRole = roleOptions.find((o) => o.value === formData.role)

  return (
    <AuthLayout>
      <div className="flex items-center gap-2 mb-4 lg:hidden">
        <span className="text-2xl">🌿</span>
        <span className="font-bold text-green-800 text-lg">AgriSakhi</span>
      </div>

      {step === 1 ? (
        <>
          <h1 className="text-2xl font-black text-slate-900">Create Your Account</h1>
          <p className="mt-1 text-sm text-slate-500">Join thousands of farmers across Karnataka</p>

          <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-3 mt-4 mb-5">
            <span className="text-3xl">{selectedRole?.emoji}</span>
            <div>
              <p className="font-semibold text-green-800">{selectedRole?.label}</p>
              <button type="button" onClick={() => navigate(-1)}
                className="text-xs text-green-600 underline">
                Change role
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-5">
            <div className="flex-1 h-1.5 rounded-full bg-green-500" />
            <div className="flex-1 h-1.5 rounded-full bg-slate-200" />
            <span className="text-xs text-slate-500 ml-1">Step 1 of 2</span>
          </div>

          <form onSubmit={handleNext} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700" htmlFor="name">
                👤 {t('name')}
              </label>
              <input id="name" type="text" value={formData.name}
                onChange={(e) => update('name', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-4 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-green-500"
                placeholder="Enter your full name" required />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700" htmlFor="phone">
                📱 {t('phone')}
              </label>
              <PhoneInput id="phone" value={formData.phone} onChange={(v) => update('phone', v)} required />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700" htmlFor="password">
                🔒 {t('password')}
              </label>
              <div className="relative">
                <input id="password" type={showPassword ? 'text' : 'password'} value={formData.password}
                  onChange={(e) => update('password', e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-4 pr-12 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-green-500"
                  placeholder="Create a password" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <button type="submit"
              className="w-full rounded-xl bg-green-600 px-4 py-4 text-base font-semibold text-white shadow-lg shadow-green-100 transition hover:bg-green-700">
              Next →
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-600">
            {t('alreadyHaveAccount')}{' '}
            <Link to="/login" className="font-semibold text-green-700">{t('login')}</Link>
          </p>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-black text-slate-900">Almost done! 🎉</h1>
          <p className="mt-1 text-sm text-slate-500">Allow location to find opportunities near you</p>

          <div className="flex items-center gap-2 my-5">
            <div className="flex-1 h-1.5 rounded-full bg-green-500" />
            <div className="flex-1 h-1.5 rounded-full bg-green-500" />
            <span className="text-xs text-slate-500 ml-1">Step 2 of 2</span>
          </div>

          <div className="text-center bg-green-50 border-2 border-dashed border-green-300 rounded-2xl p-8 mb-5">
            <div className="text-6xl mb-4">📍</div>
            <h3 className="font-bold text-green-800 text-lg">Enable Location</h3>
            <p className="text-gray-600 text-sm mt-2">
              We use GPS to show you nearby {selectedRole?.locationText}.
              Your location is never shared publicly.
            </p>
            <p className="text-green-600 text-sm mt-1">
              ಹತ್ತಿರದ ಅವಕಾಶಗಳಿಗಾಗಿ ಸ್ಥಳ ಅನುಮತಿ ಕೊಡಿ
            </p>
          </div>

          {error && (
            <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</p>
          )}

          <button type="button" onClick={handleAllowLocation} disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-4 text-base font-semibold text-white shadow-lg shadow-green-100 transition hover:bg-green-700 disabled:opacity-60">
            {locating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Getting your location... 📡
              </>
            ) : (
              <>
                <MapPin className="h-4 w-4" />
                Allow Location &amp; Create Account 📍
              </>
            )}
          </button>

          <button type="button" onClick={handleSkipLocation} disabled={submitting}
            className="mt-3 w-full text-center text-sm text-slate-500 hover:text-slate-700 underline disabled:opacity-60">
            Skip &amp; Continue without location
          </button>

          <button type="button" onClick={() => setStep(1)}
            className="mt-4 w-full text-center text-xs text-slate-400 hover:text-slate-600">
            ← Back to details
          </button>
        </>
      )}
    </AuthLayout>
  )
}
