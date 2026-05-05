import { BriefcaseBusiness, CirclePlus, MapPin, RefreshCw, Tractor, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import PageSkeleton from '../components/PageSkeleton.jsx'
import ServiceCard from '../components/ServiceCard.jsx'
import UserCard from '../components/UserCard.jsx'
import useAuthStore from '../store/authStore.js'
import { usersAPI, servicesAPI } from '../lib/api.js'

const waveEmoji = '\u{1F44B}'
const labourEmoji = '\u{1F477}'
const serviceEmoji = '\u{1F69C}'

function SkeletonCards() {
  return (
    <div className="flex gap-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-32 w-40 shrink-0 animate-pulse rounded-[24px] bg-slate-200" />
      ))}
    </div>
  )
}

export default function FarmerDashboard() {
  const { t } = useTranslation()
  const user = useAuthStore((s) => s.user)

  const { data: labourRes, isLoading: loadingLabour, isError: errLabour, refetch: refetchLabour } = useQuery({
    queryKey: ['nearby-labour', user?.lat, user?.lng],
    queryFn: () => usersAPI.getNearby({ role: 'labour', lat: user?.lat, lng: user?.lng, radius_km: 50 }),
    enabled: !!user,
  })

  const { data: servicesRes, isLoading: loadingServices, isError: errServices, refetch: refetchServices } = useQuery({
    queryKey: ['nearby-services', user?.lat, user?.lng],
    queryFn: () => servicesAPI.list({ lat: user?.lat, lng: user?.lng, radius_km: 60 }),
    enabled: !!user,
  })

  const nearbyLabour = labourRes?.data || []
  const nearbyServices = servicesRes?.data || []

  if (!user) return <PageSkeleton variant="dashboard" />

  return (
    <div className="space-y-6 pb-4">
      <section className="overflow-hidden rounded-[28px] bg-gradient-to-br from-green-600 via-emerald-600 to-lime-500 px-5 py-6 text-white shadow-xl shadow-green-100">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-green-50">{t('farmerDashboard')}</p>
            <h1 className="mt-2 text-2xl font-black leading-tight">
              {t('namaskara')}, {user.name} {waveEmoji}
            </h1>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white/15 backdrop-blur">
            <Tractor className="h-7 w-7" />
          </div>
        </div>
        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3 py-2 text-sm font-medium text-white/90">
          <MapPin className="h-4 w-4" />
          <span>{user.village}, {user.district}</span>
        </div>
      </section>

      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{t('quickActions')}</p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Link to="/farmer/post-job" className="rounded-[24px] bg-green-600 p-4 text-white shadow-lg shadow-green-100">
            <CirclePlus className="h-6 w-6" />
            <p className="mt-5 text-lg font-semibold">{t('postAJob')}</p>
            <p className="mt-1 text-sm text-green-50">{t('postJobDesc')}</p>
          </Link>
          <Link to="/farmer/jobs" className="rounded-[24px] border border-slate-200 bg-white p-4 text-slate-900 shadow-sm">
            <BriefcaseBusiness className="h-6 w-6 text-green-700" />
            <p className="mt-5 text-lg font-semibold">{t('myJobs')}</p>
            <p className="mt-1 text-sm text-slate-500">{t('myJobsDesc')}</p>
          </Link>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-green-700" />
          <h2 className="text-lg font-bold text-slate-900">{t('nearbyLabour')}</h2>
        </div>
        {loadingLabour ? (
          <div className="mt-4"><SkeletonCards /></div>
        ) : errLabour ? (
          <div className="mt-4 flex items-center gap-2 text-sm text-red-600">
            <span>{t('connectionError')}</span>
            <button type="button" onClick={() => refetchLabour()} className="underline">{t('retry')}</button>
          </div>
        ) : nearbyLabour.length > 0 ? (
          <div className="-mx-4 mt-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2">
            {nearbyLabour.map((labour) => (
              <UserCard key={labour.id} user={labour} distanceKm={labour.distance} />
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center">
            <p className="text-4xl">{labourEmoji}</p>
            <p className="mt-3 text-base font-semibold text-slate-800">{t('noLabourNearby')}</p>
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center gap-2">
          <Tractor className="h-5 w-5 text-green-700" />
          <h2 className="text-lg font-bold text-slate-900">{t('nearbyServices')}</h2>
        </div>
        {loadingServices ? (
          <div className="mt-4 space-y-3">
            {[1, 2].map((i) => <div key={i} className="h-24 animate-pulse rounded-[24px] bg-slate-200" />)}
          </div>
        ) : errServices ? (
          <div className="mt-4 flex items-center gap-2 text-sm text-red-600">
            <span>{t('connectionError')}</span>
            <button type="button" onClick={() => refetchServices()} className="underline">{t('retry')}</button>
          </div>
        ) : nearbyServices.length > 0 ? (
          <div className="mt-4 space-y-3">
            {nearbyServices.map((service) => (
              <ServiceCard key={service.id} service={service} showDistance />
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center">
            <p className="text-4xl">{serviceEmoji}</p>
            <p className="mt-3 text-base font-semibold text-slate-800">{t('noNearbyServices')}</p>
          </div>
        )}
      </section>
    </div>
  )
}
