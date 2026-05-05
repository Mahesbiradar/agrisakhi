import {
  Info, Languages, Lock, LogOut, MapPin, Pencil, Phone, RefreshCw, ShieldCheck,
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import BottomSheet from '../components/BottomSheet.jsx'
import LanguageToggle from '../components/LanguageToggle.jsx'
import PageSkeleton from '../components/PageSkeleton.jsx'
import useAuthStore from '../store/authStore.js'
import { authAPI, jobsAPI, servicesAPI, usersAPI } from '../lib/api.js'
import { useToast } from '../utils/useToast.js'

const ROLE_GRADIENT = {
  farmer: 'from-green-600 via-emerald-600 to-green-500',
  labour: 'from-amber-400 via-yellow-400 to-orange-400',
  provider: 'from-sky-600 via-blue-600 to-cyan-500',
}

const ROLE_BADGE = {
  farmer: 'Farmer',
  labour: 'Labour',
  provider: 'Service Provider',
}

function formatMemberSince(value) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function ProfilePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { clearAuth, user: storeUser, updateUser } = useAuthStore()
  const { showToast, ToastComponent } = useToast()

  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [editName, setEditName] = useState('')
  const [passwordData, setPasswordData] = useState({ newPass: '', confirm: '' })

  const { data, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: usersAPI.getProfile,
    enabled: !!storeUser,
  })

  const isFarmer = storeUser?.role === 'farmer'
  const isLabour = storeUser?.role === 'labour'
  const isProvider = storeUser?.role === 'provider'

  const { data: myJobsData } = useQuery({
    queryKey: ['my-jobs'],
    queryFn: jobsAPI.myJobs,
    enabled: isFarmer,
  })

  const { data: myServicesData } = useQuery({
    queryKey: ['my-services'],
    queryFn: servicesAPI.myServices,
    enabled: isProvider,
  })

  const updateProfileMutation = useMutation({
    mutationFn: (payload) => usersAPI.updateProfile(payload),
    onSuccess: (res) => {
      updateUser({ name: res.data.name })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      setShowEditProfile(false)
      showToast('Profile updated')
    },
    onError: () => showToast('Failed to update profile'),
  })

  const changePasswordMutation = useMutation({
    mutationFn: ({ phone, newPassword }) => authAPI.resetPassword(phone, newPassword),
    onSuccess: () => {
      setPasswordData({ newPass: '', confirm: '' })
      setShowChangePassword(false)
      showToast('Password updated')
    },
    onError: () => showToast('Failed to update password'),
  })

  if (isLoading) return <PageSkeleton variant="profile" />

  const profile = data?.data || storeUser
  const gradient = ROLE_GRADIENT[profile?.role] ?? ROLE_GRADIENT.farmer
  const initials = profile?.name?.charAt(0)?.toUpperCase() ?? '?'

  const myJobs = myJobsData?.data || []
  const myServices = myServicesData?.data || []

  let stats = []
  if (isFarmer) {
    const openJobs = myJobs.filter((j) => j.status === 'open').length
    const totalApps = myJobs.reduce((sum, j) => sum + (j.applications_count || 0), 0)
    stats = [
      { label: 'Jobs Posted', value: myJobs.length },
      { label: 'Applications', value: totalApps },
      { label: 'Open Jobs', value: openJobs },
    ]
  } else if (isLabour) {
    const isReady = localStorage.getItem('agrisakhi_ready_date') === new Date().toDateString()
    stats = [
      { label: 'Ready Today', value: isReady ? '✅' : '⭕' },
      { label: 'Status', value: isReady ? 'Active' : 'Off' },
      { label: 'Member Since', value: new Date(profile?.created_at || Date.now()).getFullYear() },
    ]
  } else if (isProvider) {
    const activeServices = myServices.filter((s) => s.is_available).length
    const maxCoverage = myServices.length > 0 ? Math.max(...myServices.map((s) => s.coverage_km || 50)) : '—'
    stats = [
      { label: 'Services Listed', value: myServices.length },
      { label: 'Active', value: activeServices },
      { label: 'Max Coverage', value: myServices.length > 0 ? `${maxCoverage}km` : '—' },
    ]
  }

  const handleRefreshLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        usersAPI.updateLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
          .then(() => {
            updateUser({ lat: pos.coords.latitude, lng: pos.coords.longitude })
            showToast('Location updated')
          })
          .catch(() => showToast('Failed to update location'))
      },
      () => showToast('Could not get location'),
    )
  }

  const handleSaveProfile = () => {
    if (!editName.trim()) return
    updateProfileMutation.mutate({ name: editName.trim() })
  }

  const handleChangePassword = () => {
    if (passwordData.newPass !== passwordData.confirm) {
      showToast('Passwords do not match')
      return
    }
    if (passwordData.newPass.length < 6) {
      showToast('Password must be at least 6 characters')
      return
    }
    changePasswordMutation.mutate({ phone: profile?.phone, newPassword: passwordData.newPass })
  }

  const handleLogout = () => {
    clearAuth()
    navigate('/', { replace: true })
  }

  return (
    <div className="space-y-5 pb-24">
      <section className={`overflow-hidden rounded-[28px] bg-gradient-to-br ${gradient} px-5 py-8 text-white shadow-xl`}>
        <div className="flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur text-4xl font-black text-white">
            {initials}
          </div>
          <h1 className="mt-4 text-2xl font-black text-white">{profile?.name}</h1>
          <div className="mt-2 rounded-full border border-white/30 bg-white/15 px-4 py-1.5 text-sm font-semibold text-white">
            {ROLE_BADGE[profile?.role] ?? 'User'}
          </div>
          {profile?.village && (
            <div className="mt-3 flex items-center gap-1.5 text-sm text-white/80">
              <MapPin className="h-4 w-4" />
              <span>{profile.village}, {profile.district}</span>
            </div>
          )}
        </div>
      </section>

      {stats.length > 0 && (
        <section className="grid grid-cols-3 gap-2">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-[20px] bg-slate-50 p-3 text-center">
              <p className="text-xl font-black text-green-700">{stat.value}</p>
              <p className="mt-1 text-xs text-slate-500 leading-tight">{stat.label}</p>
            </div>
          ))}
        </section>
      )}

      <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-bold text-slate-900">Personal Info</h2>
        <div className="mt-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
              <Phone className="h-4 w-4 text-slate-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Phone</p>
              <p className="font-semibold text-slate-900">+91 {profile?.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
              <ShieldCheck className="h-4 w-4 text-slate-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Role</p>
              <p className="font-semibold text-slate-900">{ROLE_BADGE[profile?.role] ?? profile?.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
              <MapPin className="h-4 w-4 text-slate-500" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-500">Location</p>
              <p className="font-semibold text-slate-900">{profile?.village || '—'}, {profile?.district || '—'}</p>
            </div>
            <button type="button" onClick={handleRefreshLocation}
              className="flex items-center gap-1 rounded-xl bg-slate-50 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 transition">
              <RefreshCw className="h-3 w-3" />
              Refresh
            </button>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
              <Info className="h-4 w-4 text-slate-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Member Since</p>
              <p className="font-semibold text-slate-900">{formatMemberSince(profile?.created_at)}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[24px] border border-slate-200 bg-white shadow-sm overflow-hidden">
        <button type="button"
          onClick={() => { setShowEditProfile(!showEditProfile); if (!showEditProfile) setEditName(profile?.name || '') }}
          className="flex w-full items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <Pencil className="h-5 w-5 text-slate-500" />
            <span className="font-semibold text-slate-900">Edit Profile</span>
          </div>
          <span className="text-xs text-slate-400">{showEditProfile ? '▲' : '▼'}</span>
        </button>
        {showEditProfile && (
          <div className="border-t border-slate-100 px-5 pb-5 pt-4 space-y-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">Name</label>
              <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-600">Phone (read-only)</label>
              <input type="text" value={profile?.phone || ''} disabled
                className="w-full rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-400 cursor-not-allowed" />
            </div>
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={handleSaveProfile} disabled={updateProfileMutation.isPending}
                className="flex-1 rounded-2xl bg-green-600 py-3 text-sm font-semibold text-white disabled:opacity-60">
                Save Changes
              </button>
              <button type="button" onClick={() => setShowEditProfile(false)}
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600">
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="rounded-[24px] border border-slate-200 bg-white shadow-sm overflow-hidden">
        <button type="button" onClick={() => setShowChangePassword(!showChangePassword)}
          className="flex w-full items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <Lock className="h-5 w-5 text-slate-500" />
            <span className="font-semibold text-slate-900">Change Password</span>
          </div>
          <span className="text-xs text-slate-400">{showChangePassword ? '▲' : '▼'}</span>
        </button>
        {showChangePassword && (
          <div className="border-t border-slate-100 px-5 pb-5 pt-4 space-y-3">
            <input type="password" placeholder="New password (min 6 chars)"
              value={passwordData.newPass}
              onChange={(e) => setPasswordData((p) => ({ ...p, newPass: e.target.value }))}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500" />
            <input type="password" placeholder="Confirm new password"
              value={passwordData.confirm}
              onChange={(e) => setPasswordData((p) => ({ ...p, confirm: e.target.value }))}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500" />
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={handleChangePassword} disabled={changePasswordMutation.isPending}
                className="flex-1 rounded-2xl bg-blue-600 py-3 text-sm font-semibold text-white disabled:opacity-60">
                Update Password
              </button>
              <button type="button" onClick={() => setShowChangePassword(false)}
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600">
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm space-y-3">
        <h2 className="text-base font-bold text-slate-900">Settings</h2>
        <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
          <div className="flex items-center gap-3">
            <Languages className="h-5 w-5 text-slate-500" />
            <span className="text-sm font-semibold text-slate-900">Language / ಭಾಷೆ</span>
          </div>
          <LanguageToggle />
        </div>
        <button type="button" onClick={() => setShowAbout(true)}
          className="flex w-full items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-left">
          <Info className="h-5 w-5 text-slate-500" />
          <span className="text-sm font-semibold text-slate-900">About AgriSakhi</span>
        </button>
      </section>

      <section className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-bold text-slate-900">Help &amp; Support</h2>
        <a href="tel:18001801551" className="mt-3 flex items-center gap-3 rounded-2xl bg-green-50 px-4 py-4">
          <span className="text-xl">📞</span>
          <div>
            <p className="font-semibold text-green-800">Kisan Call Center</p>
            <p className="text-sm text-green-700">1800-180-1551 (Toll Free)</p>
          </div>
        </a>
      </section>

      <button type="button" onClick={() => setShowLogoutConfirm(true)}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-red-200 bg-red-50 py-4 text-sm font-semibold text-red-600 hover:bg-red-100 transition">
        <LogOut className="h-5 w-5" />
        {t('logout')}
      </button>

      <BottomSheet isOpen={showAbout} onClose={() => setShowAbout(false)} title="About AgriSakhi">
        <div className="space-y-3 text-sm text-slate-600 leading-7">
          <p>AgriSakhi is a mobile-first platform connecting farmers, labourers, and service providers across Karnataka.</p>
          <p>It makes hiring, finding work, and discovering agricultural services simpler for village communities.</p>
          <div className="rounded-2xl bg-slate-50 px-4 py-3 space-y-1">
            <p className="font-semibold text-slate-800">v2.0 Phase 2</p>
            <p className="text-xs text-slate-500">Built for Karnataka farmers</p>
          </div>
          <div className="rounded-2xl bg-green-50 px-4 py-3">
            <p className="font-semibold text-green-800">Kisan Helpline</p>
            <p className="text-green-700">1800-180-1551 (Toll Free)</p>
          </div>
        </div>
      </BottomSheet>

      <BottomSheet isOpen={showLogoutConfirm} onClose={() => setShowLogoutConfirm(false)} title="Logout?">
        <p className="text-sm text-slate-600 mb-5">Are you sure you want to logout?</p>
        <div className="flex gap-3">
          <button type="button" onClick={() => setShowLogoutConfirm(false)}
            className="flex-1 rounded-2xl border border-slate-200 py-3 text-sm font-semibold text-slate-700">
            Cancel
          </button>
          <button type="button" onClick={handleLogout}
            className="flex-1 rounded-2xl bg-red-600 py-3 text-sm font-semibold text-white">
            Logout
          </button>
        </div>
      </BottomSheet>

      <ToastComponent />
    </div>
  )
}
