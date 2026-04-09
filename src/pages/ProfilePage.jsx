import {
  Globe,
  Info,
  Languages,
  LogOut,
  MapPin,
  Pencil,
  Phone,
  ShieldCheck,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomSheet from '../components/BottomSheet.jsx'
import PageSkeleton from '../components/PageSkeleton.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useData } from '../context/DataContext.jsx'
import { getRoleColor } from '../utils/roleColors.js'
import { useDelayedLoading } from '../utils/useDelayedLoading.js'
import { useToast } from '../utils/useToast.js'

const languageStorageKey = 'agrisakhi_language'
const kannadaLabel = '\u0C95\u0CA8\u0CCD\u0CA8\u0CA1'

const roleMeta = {
  farmer: { badge: 'Farmer' },
  labour: { badge: 'Labour' },
  provider: { badge: 'Service Provider' },
}

function formatMemberSince(value) {
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function getReadyKey(userId) {
  return `agrisakhi_ready_${userId}`
}

function readStoredFlag(key, fallback) {
  if (typeof window === 'undefined') {
    return fallback
  }

  const storedValue = window.localStorage.getItem(key)
  return storedValue === null ? fallback : storedValue === 'true'
}

function readStoredLanguage() {
  if (typeof window === 'undefined') {
    return 'english'
  }

  return window.localStorage.getItem(languageStorageKey) ?? 'english'
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const { currentUser, logout } = useAuth()
  const { jobs, services } = useData()
  const { showToast, ToastComponent } = useToast()
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const [language, setLanguage] = useState(readStoredLanguage)
  const [readyToWork, setReadyToWork] = useState(() =>
    readStoredFlag(getReadyKey(currentUser.id), true),
  )
  const loading = useDelayedLoading()

  const meta = roleMeta[currentUser.role] ?? roleMeta.farmer
  const roleColor = getRoleColor(currentUser.role)
  const farmerJobsCount = useMemo(
    () => jobs.filter((job) => job.farmerId === currentUser.id).length,
    [currentUser.id, jobs],
  )
  const providerServicesCount = useMemo(
    () => services.filter((service) => service.providerId === currentUser.id).length,
    [currentUser.id, services],
  )

  const handleLanguageToggle = () => {
    const nextLanguage = language === 'english' ? 'kannada' : 'english'
    setLanguage(nextLanguage)
    window.localStorage.setItem(languageStorageKey, nextLanguage)
  }

  const handleReadyToggle = () => {
    const nextValue = !readyToWork
    setReadyToWork(nextValue)
    window.localStorage.setItem(getReadyKey(currentUser.id), String(nextValue))
  }

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  if (loading) {
    return <PageSkeleton variant="profile" />
  }

  return (
    <div className="space-y-6 pb-6">
      <section className="rounded-[28px] border border-slate-200 bg-white px-5 py-6 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <div
            className={`flex h-24 w-24 items-center justify-center rounded-full text-4xl font-black ${roleColor.light} ${roleColor.text}`}
          >
            {currentUser.avatar}
          </div>
          <h1 className="mt-4 text-2xl font-black text-slate-900">{currentUser.name}</h1>
          <div
            className={`mt-3 inline-flex rounded-full border px-4 py-2 text-sm font-semibold ${roleColor.light} ${roleColor.text} ${roleColor.border}`}
          >
            {meta.badge}
          </div>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600">
            <MapPin className="h-4 w-4" />
            <span>
              {currentUser.village}, {currentUser.district}
            </span>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Account Info</h2>

        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Phone Number</p>
              <p className="font-semibold text-slate-900">{currentUser.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Member Since</p>
              <p className="font-semibold text-slate-900">{formatMemberSince(currentUser.createdAt)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-slate-500">District Coverage</p>
              <p className="font-semibold text-slate-900">{currentUser.district}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Your Activity</h2>

        {currentUser.role === 'farmer' ? (
          <div className="mt-4 rounded-2xl bg-green-50 px-4 py-4">
            <p className="text-sm text-green-700">Jobs Posted</p>
            <p className="mt-2 text-3xl font-black text-slate-900">{farmerJobsCount}</p>
          </div>
        ) : null}

        {currentUser.role === 'provider' ? (
          <div className="mt-4 rounded-2xl bg-blue-50 px-4 py-4">
            <p className="text-sm text-blue-700">Services Listed</p>
            <p className="mt-2 text-3xl font-black text-slate-900">{providerServicesCount}</p>
          </div>
        ) : null}

        {currentUser.role === 'labour' ? (
          <button
            type="button"
            onClick={handleReadyToggle}
            className={`mt-4 flex w-full items-center justify-between rounded-[24px] border px-4 py-4 text-left transition ${
              readyToWork ? 'border-amber-200 bg-amber-50' : 'border-slate-200 bg-slate-50'
            }`}
          >
            <div>
              <p className="font-semibold text-slate-900">Ready to Work</p>
              <p className="mt-1 text-sm text-slate-500">
                Let this stay on to show that you are available for new jobs.
              </p>
            </div>
            <div
              className={`relative h-7 w-12 rounded-full transition ${
                readyToWork ? 'bg-amber-500' : 'bg-slate-300'
              }`}
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                  readyToWork ? 'left-6' : 'left-1'
                }`}
              />
            </div>
          </button>
        ) : null}
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Settings</h2>

        <div className="mt-4 space-y-3">
          <button
            type="button"
            onClick={() => showToast('Feature coming in Phase 2')}
            className="flex w-full items-center justify-between rounded-2xl bg-slate-50 px-4 py-4 text-left"
          >
            <div className="flex items-center gap-3">
              <Pencil className="h-5 w-5 text-slate-500" />
              <span className="font-semibold text-slate-900">Edit Profile</span>
            </div>
          </button>

          <button
            type="button"
            onClick={handleLanguageToggle}
            className="flex w-full items-center justify-between rounded-2xl bg-slate-50 px-4 py-4 text-left"
          >
            <div className="flex items-center gap-3">
              <Languages className="h-5 w-5 text-slate-500" />
              <span className="font-semibold text-slate-900">Language</span>
            </div>
            <span className="text-sm font-semibold text-slate-600">
              {language === 'english' ? 'English' : kannadaLabel}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setIsAboutOpen(true)}
            className="flex w-full items-center justify-between rounded-2xl bg-slate-50 px-4 py-4 text-left"
          >
            <div className="flex items-center gap-3">
              <Info className="h-5 w-5 text-slate-500" />
              <span className="font-semibold text-slate-900">About AgriSakhi</span>
            </div>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-between rounded-2xl bg-red-50 px-4 py-4 text-left"
          >
            <div className="flex items-center gap-3">
              <LogOut className="h-5 w-5 text-red-600" />
              <span className="font-semibold text-red-600">Logout</span>
            </div>
          </button>
        </div>
      </section>

      <BottomSheet isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} title="About AgriSakhi">
        <p className="text-sm leading-7 text-slate-600">
          AgriSakhi is a mobile-first prototype that helps farmers, labourers, and service providers
          connect locally. It makes hiring, finding work, and discovering agricultural services much
          simpler for village communities.
        </p>
      </BottomSheet>

      <ToastComponent />
    </div>
  )
}
