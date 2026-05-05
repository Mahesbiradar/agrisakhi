import { ArrowLeft, CheckCircle, Leaf, Loader2, MapPin, Truck, UserRound, Users } from 'lucide-react'
import PhoneInput from '../components/PhoneInput.jsx'
import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { authAPI } from '../lib/api.js'
import useAuthStore from '../store/authStore.js'
import { getDashboardPath } from '../utils/auth.js'
import { detectLocation } from '../utils/location.js'

const roleOptions = [
  { value: 'farmer', label: 'Farmer', icon: UserRound, description: 'Hire workers and manage farm needs' },
  { value: 'labour', label: 'Labour', icon: Users, description: 'Find nearby daily work quickly' },
  { value: 'provider', label: 'Service Provider', icon: Truck, description: 'List machinery, seeds, and agri services' },
]

export default function RegisterPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { setAuth } = useAuthStore()
  const requestedRole = searchParams.get('role')
  const initialRole = roleOptions.some((o) => o.value === requestedRole) ? requestedRole : 'farmer'

  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '', phone: '', password: '', role: initialRole,
    village: '', district: '', lat: null, lng: null,
  })
  const [detecting, setDetecting] = useState(false)
  const [locationDone, setLocationDone] = useState(false)
  const [locationWarning, setLocationWarning] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const update = (field, value) => setFormData((f) => ({ ...f, [field]: value }))

  const handleDetect = async () => {
    setDetecting(true)
    setError('')
    setLocationWarning('')
    try {
      const loc = await detectLocation()
      setFormData((f) => ({
        ...f,
        lat: loc.lat, lng: loc.lng,
        village: loc.village || f.village,
        district: loc.district || f.district,
      }))
      setLocationDone(true)
      if (loc.state && !loc.state.toLowerCase().includes('karnataka')) {
        setLocationWarning(`⚠️ You appear to be outside Karnataka (detected: ${loc.state}). Please verify your location.`)
      }
    } catch {
      setError('Could not detect location. Please enter manually.')
    } finally {
      setDetecting(false)
    }
  }

  const handleNext = (e) => { e.preventDefault(); setStep(2) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    try {
      const res = await authAPI.register(formData)
      setAuth(res.data.user, res.data.access, res.data.refresh)
      navigate(getDashboardPath(res.data.user.role), { replace: true })
    } catch (err) {
      setError(err.userMessage || t('phoneRegistered'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page-container bg-gradient-to-b from-green-50 via-white to-white">
      <div className="px-5 pb-8 pt-6">
        <div className="flex items-center justify-between">
          <button type="button" onClick={() => (step === 1 ? navigate(-1) : setStep(1))}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-2 text-xs font-semibold text-green-700">
            <Leaf className="h-4 w-4" />
            Step {step} of 2
          </div>
        </div>

        <div className="mt-8">
          <h1 className="text-3xl font-black text-slate-900">Create your account</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Join AgriSakhi and connect with nearby people, work, and farm services.
          </p>
        </div>

        <div className="mt-6 h-2 rounded-full bg-slate-100">
          <div className={`h-2 rounded-full bg-green-600 transition-all duration-300 ${step === 1 ? 'w-1/2' : 'w-full'}`} />
        </div>

        {step === 1 ? (
          <form onSubmit={handleNext} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="name">{t('name')}</label>
              <input id="name" type="text" value={formData.name}
                onChange={(e) => update('name', e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-green-500"
                placeholder="Enter your full name" required />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="phone">{t('phone')}</label>
              <PhoneInput id="phone" value={formData.phone} onChange={(v) => update('phone', v)} required />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="password">{t('password')}</label>
              <input id="password" type="password" value={formData.password}
                onChange={(e) => update('password', e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-green-500"
                placeholder="Create a password" required />
            </div>
            <div>
              <p className="mb-3 text-sm font-semibold text-slate-700">{t('role')}</p>
              <div className="space-y-3">
                {roleOptions.map((option) => {
                  const Icon = option.icon
                  const isActive = formData.role === option.value
                  return (
                    <button key={option.value} type="button" onClick={() => update('role', option.value)}
                      className={`flex w-full items-center gap-4 rounded-3xl border px-4 py-4 text-left transition ${isActive ? 'border-green-600 bg-green-50 shadow-lg shadow-green-100' : 'border-slate-200 bg-white'}`}>
                      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${isActive ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{option.label}</p>
                        <p className="mt-1 text-sm text-slate-500">{option.description}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
            <button type="submit" className="w-full rounded-2xl bg-green-600 px-4 py-4 text-base font-semibold text-white shadow-lg shadow-green-100 transition hover:bg-green-700">
              {t('next')}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <button type="button" onClick={handleDetect} disabled={detecting}
              className={`flex w-full items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition ${locationDone ? 'border-green-300 bg-green-50 text-green-700' : 'border-slate-200 bg-white text-slate-700'}`}>
              {detecting ? <Loader2 className="h-4 w-4 animate-spin" /> : locationDone ? <CheckCircle className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
              {detecting ? t('detecting') : locationDone ? t('locationDetected') : t('detectLocation')}
            </button>

            {locationDone && !locationWarning && (
              <p className="text-xs text-slate-500">📍 Detected from GPS — you can edit if needed</p>
            )}
            {locationWarning && (
              <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">{locationWarning}</p>
            )}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="village">{t('village')}</label>
              <input id="village" type="text" value={formData.village}
                onChange={(e) => update('village', e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-green-500"
                placeholder="e.g. Nagarabhavi, Hebbal" required />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="district">{t('district')}</label>
              <input id="district" type="text" value={formData.district}
                onChange={(e) => update('district', e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-green-500"
                placeholder="e.g. Bengaluru Urban, Mysuru, Shimoga" required />
              <button type="button" onClick={() => document.getElementById('village').focus()}
                className="mt-1 text-xs text-green-700 underline">
                Enter manually instead
              </button>
            </div>

            {error && (
              <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</p>
            )}

            <button type="submit" disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 py-4 text-base font-semibold text-white shadow-lg shadow-green-100 transition hover:bg-green-700 disabled:opacity-60">
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {t('createAccount')}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-slate-600">
          {t('alreadyHaveAccount')}{' '}
          <Link to="/login" className="font-semibold text-green-700">{t('login')}</Link>
        </p>
      </div>
    </div>
  )
}
