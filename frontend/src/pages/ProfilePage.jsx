import {
  Globe, Info, Languages, LogOut, MapPin, Pencil, Phone, ShieldCheck,
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import BottomSheet from '../components/BottomSheet.jsx'
import PageSkeleton from '../components/PageSkeleton.jsx'
import useAuthStore from '../store/authStore.js'
import { usersAPI } from '../lib/api.js'
import { getRoleColor } from '../utils/roleColors.js'
import { useToast } from '../utils/useToast.js'

const roleMeta = {
  farmer: { badge: 'Farmer' },
  labour: { badge: 'Labour' },
  provider: { badge: 'Service Provider' },
}

function formatMemberSince(value) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

function getReadyKey(userId) {
  return `agrisakhi_ready_${userId}`
}

export default function ProfilePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { clearAuth, user: storeUser } = useAuthStore()
  const { showToast, ToastComponent } = useToast()
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const [readyToWork, setReadyToWork] = useState(() => {
    const key = getReadyKey(storeUser?.id)
    const v = localStorage.getItem(key)
    return v === null ? true : v === 'true'
  })

  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: usersAPI.getProfile,
    enabled: !!storeUser,
  })

  if (isLoading) return <PageSkeleton variant="profile" />

  const profile = data?.data || storeUser
  const meta = roleMeta[profile?.role] ?? roleMeta.farmer
  const roleColor = getRoleColor(profile?.role)

  const handleReadyToggle = () => {
    const next = !readyToWork
    setReadyToWork(next)
    localStorage.setItem(getReadyKey(profile?.id), String(next))
  }

  const handleLogout = () => {
    clearAuth()
    navigate('/', { replace: true })
  }

  const initials = profile?.name?.charAt(0)?.toUpperCase() ?? '?'

  return (
    <div className="space-y-6 pb-6">
      <section className="rounded-[28px] border border-slate-200 bg-white px-5 py-6 shadow-sm">
        <div className="flex flex-col items-center text-center">
          <div className={`flex h-24 w-24 items-center justify-center rounded-full text-4xl font-black ${roleColor.light} ${roleColor.text}`}>
            {initials}
          </div>
          <h1 className="mt-4 text-2xl font-black text-slate-900">{profile?.name}</h1>
          <div className={`mt-3 inline-flex rounded-full border px-4 py-2 text-sm font-semibold ${roleColor.light} ${roleColor.text} ${roleColor.border}`}>
            {meta.badge}
          </div>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600">
            <MapPin className="h-4 w-4" />
            <span>{profile?.village}, {profile?.district}</span>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">{t('accountInfo')}</h2>
        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-slate-500">{t('phoneNumber')}</p>
              <p className="font-semibold text-slate-900">{profile?.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-slate-500">{t('memberSince')}</p>
              <p className="font-semibold text-slate-900">{formatMemberSince(profile?.created_at)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-slate-500">{t('districtCoverage')}</p>
              <p className="font-semibold text-slate-900">{profile?.district}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">{t('yourActivity')}</h2>
        {profile?.role === 'labour' && (
          <button type="button" onClick={handleReadyToggle}
            className={`mt-4 flex w-full items-center justify-between rounded-[24px] border px-4 py-4 text-left transition ${readyToWork ? 'border-amber-200 bg-amber-50' : 'border-slate-200 bg-slate-50'}`}>
            <div>
              <p className="font-semibold text-slate-900">{t('readyToWork')}</p>
              <p className="mt-1 text-sm text-slate-500">{t('readyToWorkDesc')}</p>
            </div>
            <div className={`relative h-7 w-12 rounded-full transition ${readyToWork ? 'bg-amber-500' : 'bg-slate-300'}`}>
              <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${readyToWork ? 'left-6' : 'left-1'}`} />
            </div>
          </button>
        )}
        {profile?.role === 'farmer' && (
          <div className="mt-4 rounded-2xl bg-green-50 px-4 py-4">
            <p className="text-sm text-green-700">{t('jobsPosted')}</p>
          </div>
        )}
        {profile?.role === 'provider' && (
          <div className="mt-4 rounded-2xl bg-blue-50 px-4 py-4">
            <p className="text-sm text-blue-700">{t('servicesListed')}</p>
          </div>
        )}
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">{t('settings')}</h2>
        <div className="mt-4 space-y-3">
          <button type="button" onClick={() => showToast('Feature coming soon')}
            className="flex w-full items-center justify-between rounded-2xl bg-slate-50 px-4 py-4 text-left">
            <div className="flex items-center gap-3">
              <Pencil className="h-5 w-5 text-slate-500" />
              <span className="font-semibold text-slate-900">{t('editProfile')}</span>
            </div>
          </button>

          <div className="flex w-full items-center justify-between rounded-2xl bg-slate-50 px-4 py-4">
            <div className="flex items-center gap-3">
              <Languages className="h-5 w-5 text-slate-500" />
              <span className="font-semibold text-slate-900">{t('language')} / ಭಾಷೆ</span>
            </div>
            <span className="text-xs text-slate-400">Use toggle in bottom nav</span>
          </div>

          <button type="button" onClick={() => setIsAboutOpen(true)}
            className="flex w-full items-center justify-between rounded-2xl bg-slate-50 px-4 py-4 text-left">
            <div className="flex items-center gap-3">
              <Info className="h-5 w-5 text-slate-500" />
              <span className="font-semibold text-slate-900">{t('about')}</span>
            </div>
          </button>

          <button type="button" onClick={handleLogout}
            className="flex w-full items-center justify-between rounded-2xl bg-red-50 px-4 py-4 text-left">
            <div className="flex items-center gap-3">
              <LogOut className="h-5 w-5 text-red-600" />
              <span className="font-semibold text-red-600">{t('logout')}</span>
            </div>
          </button>
        </div>
      </section>

      <BottomSheet isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} title="About AgriSakhi">
        <p className="text-sm leading-7 text-slate-600">
          AgriSakhi is a mobile-first app that helps farmers, labourers, and service providers connect locally.
          It makes hiring, finding work, and discovering agricultural services simpler for village communities.
        </p>
      </BottomSheet>

      <ToastComponent />
    </div>
  )
}
