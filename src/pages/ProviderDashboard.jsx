import { CirclePlus, MapPin, PenSquare, Sparkles, Wrench } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import PageSkeleton from '../components/PageSkeleton.jsx'
import ServiceCard from '../components/ServiceCard.jsx'
import useAuthStore from '../store/authStore.js'
import { servicesAPI } from '../lib/api.js'
import { useToast } from '../utils/useToast.js'

const waveEmoji = '\u{1F44B}'
const tractorEmoji = '\u{1F69C}'

export default function ProviderDashboard() {
  const { t } = useTranslation()
  const user = useAuthStore((s) => s.user)
  const { showToast, ToastComponent } = useToast()

  const { data, isLoading } = useQuery({
    queryKey: ['my-services'],
    queryFn: servicesAPI.myServices,
    enabled: !!user,
  })

  if (isLoading) return <PageSkeleton variant="list" />

  const myServices = data?.data || []

  return (
    <div className="space-y-6 pb-24">
      <section className="overflow-hidden rounded-[28px] bg-gradient-to-br from-sky-600 via-blue-600 to-cyan-500 px-5 py-6 text-white shadow-xl shadow-sky-100">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-sky-50">{t('providerDashboard')}</p>
            <h1 className="mt-2 text-2xl font-black leading-tight">{t('namaskara')}, {user?.name} {waveEmoji}</h1>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white/15 backdrop-blur">
            <Wrench className="h-7 w-7" />
          </div>
        </div>
        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3 py-2 text-sm font-medium text-white/90">
          <MapPin className="h-4 w-4" />
          <span>{user?.village}, {user?.district}</span>
        </div>
        <p className="mt-4 text-sm leading-6 text-sky-50">Your services are visible to farmers nearby.</p>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <article className="rounded-[24px] border border-sky-100 bg-sky-50 p-4">
          <p className="text-sm font-medium text-sky-700">{t('activeServices')}</p>
          <p className="mt-3 text-3xl font-black text-slate-900">{myServices.length}</p>
        </article>
        <article className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-500">{t('areaCoverage')}</p>
          <p className="mt-3 text-lg font-bold text-slate-900">50 km radius</p>
        </article>
      </section>

      <section>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-700" />
          <h2 className="text-lg font-bold text-slate-900">{t('myServices')}</h2>
        </div>

        {myServices.length > 0 ? (
          <div className="mt-4 space-y-3">
            {myServices.map((service) => (
              <ServiceCard key={service.id} service={service} compact
                action={
                  <div className="flex items-center gap-3">
                    <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${service.is_available ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      <span className={`h-2.5 w-2.5 rounded-full ${service.is_available ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      {service.is_available ? 'Available' : 'Unavailable'}
                    </div>
                    <button type="button" onClick={() => showToast('Edit coming soon')}
                      className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white">
                      <PenSquare className="h-4 w-4" />
                      Edit
                    </button>
                  </div>
                }
              />
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-[28px] border border-dashed border-blue-200 bg-blue-50 p-5 text-center">
            <p className="text-5xl">{tractorEmoji}</p>
            <p className="mt-3 text-lg font-semibold text-slate-900">{t('noServicesFound')}</p>
            <Link to="/provider/add-service"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-4 text-base font-semibold text-white shadow-lg shadow-blue-100">
              <CirclePlus className="h-5 w-5" />
              {t('addService')}
            </Link>
          </div>
        )}
      </section>

      <div className="pointer-events-none fixed inset-x-0 bottom-24 z-20 mx-auto flex w-full max-w-[430px] justify-end px-4">
        <Link to="/provider/add-service"
          className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-2xl shadow-green-100">
          <CirclePlus className="h-5 w-5" />
          {t('addService')}
        </Link>
      </div>

      <ToastComponent />
    </div>
  )
}
