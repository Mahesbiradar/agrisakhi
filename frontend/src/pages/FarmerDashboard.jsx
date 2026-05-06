import { BriefcaseBusiness, CirclePlus, MapPin, Tractor, Users } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import BottomSheet from '../components/BottomSheet.jsx'
import PageSkeleton from '../components/PageSkeleton.jsx'
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
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const updateUser = useAuthStore((s) => s.updateUser)
  const queryClient = useQueryClient()

  const handleEnableLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        usersAPI.updateLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
          .then(() => {
            updateUser({ lat: pos.coords.latitude, lng: pos.coords.longitude })
            queryClient.invalidateQueries({ queryKey: ['nearby-labour'] })
            queryClient.invalidateQueries({ queryKey: ['nearby-services'] })
          })
          .catch(() => {})
      },
      () => {},
    )
  }

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

  const [selectedService, setSelectedService] = useState(null)

  if (!user) return <PageSkeleton variant="dashboard" />

  return (
    <div className="space-y-6 pb-4">
      {!user.lat && (
        <div className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-sm font-medium text-amber-900">📍 Enable location to see nearby jobs</p>
          <button type="button" onClick={handleEnableLocation}
            className="rounded-xl bg-amber-400 px-3 py-2 text-xs font-semibold text-slate-900">
            Enable Now
          </button>
        </div>
      )}
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

      <button type="button" onClick={() => navigate('/farmer/post-job')}
        className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white text-2xl shadow-lg shadow-green-200 hover:bg-green-700 active:scale-95 transition-all">
        +
      </button>

      <section>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-green-700" />
            <h2 className="text-lg font-bold text-slate-900">{t('nearbyLabour')}</h2>
          </div>
          {nearbyLabour.length > 0 && (
            <span className="rounded-full bg-green-50 px-2 py-1 text-xs text-green-600">{nearbyLabour.length} found</span>
          )}
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tractor className="h-5 w-5 text-green-700" />
            <h2 className="text-lg font-bold text-slate-900">{t('nearbyServices')}</h2>
          </div>
          {nearbyServices.length > 0 && (
            <span className="rounded-full bg-green-50 px-2 py-1 text-xs text-green-600">{nearbyServices.length} found</span>
          )}
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
              <div key={service.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {service.image_url && (
                  <img src={service.image_url} alt={service.service_name}
                    className="w-full h-32 object-cover"
                    onError={(e) => { e.target.style.display = 'none' }} />
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium capitalize">
                      {service.category}
                    </span>
                    {service.distanceKm != null && (
                      <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">
                        📍 {Number(service.distanceKm).toFixed(1)} km
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-800">{service.service_name}</h3>
                  {service.description && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{service.description}</p>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-green-700 font-bold text-sm">₹ {service.price_info}</span>
                    <button type="button"
                      onClick={() => setSelectedService(service)}
                      className="text-sm bg-blue-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-700">
                      View Details →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center">
            <p className="text-4xl">{serviceEmoji}</p>
            <p className="mt-3 text-base font-semibold text-slate-800">{t('noNearbyServices')}</p>
          </div>
        )}
      </section>

      <BottomSheet isOpen={!!selectedService} onClose={() => setSelectedService(null)} title={selectedService?.service_name ?? ''}>
        {selectedService && (
          <div className="space-y-4">
            {selectedService.image_url && (
              <img src={selectedService.image_url} alt={selectedService.service_name}
                className="w-full h-48 object-cover rounded-2xl"
                onError={(e) => { e.target.style.display = 'none' }} />
            )}
            <div className="flex items-center justify-between">
              <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-medium capitalize">
                {selectedService.category}
              </span>
              {selectedService.distanceKm != null && (
                <span className="text-xs text-green-700 font-medium">
                  📍 {Number(selectedService.distanceKm).toFixed(1)} km away
                </span>
              )}
            </div>
            <div>
              <p className="text-xs text-slate-500">Provider</p>
              <p className="font-semibold text-slate-900">{selectedService.provider_name}</p>
            </div>
            {selectedService.description && (
              <p className="text-sm text-slate-600 leading-6">{selectedService.description}</p>
            )}
            <div className="flex gap-6">
              <div>
                <p className="text-xs text-slate-500">Price</p>
                <p className="font-bold text-green-700">₹ {selectedService.price_info}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Coverage</p>
                <p className="font-semibold text-slate-900">{selectedService.coverage_km} km radius</p>
              </div>
            </div>
            {selectedService.provider_phone && (
              <div className="flex gap-3 pt-2">
                <a href={`tel:+91${selectedService.provider_phone}`}
                  className="flex-1 bg-white border-2 border-green-500 rounded-xl py-3 flex items-center justify-center gap-2 text-green-700 font-semibold text-sm hover:bg-green-50 transition">
                  📞 Call Provider
                </a>
                <a href={`https://wa.me/91${selectedService.provider_phone}?text=${encodeURIComponent(`Hi, I found your service "${selectedService.service_name}" on AgriSakhi`)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex-1 rounded-xl py-3 flex items-center justify-center gap-2 text-white font-semibold text-sm"
                  style={{ background: '#25D366' }}>
                  💬 WhatsApp
                </a>
              </div>
            )}
          </div>
        )}
      </BottomSheet>
    </div>
  )
}
