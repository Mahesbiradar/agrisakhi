import { CirclePlus, MapPin, PenSquare, Sparkles, Wrench } from 'lucide-react'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import ServiceCard from '../components/ServiceCard.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useData } from '../context/DataContext.jsx'
import { useToast } from '../utils/useToast.js'

const waveEmoji = '\u{1F44B}'
const tractorEmoji = '\u{1F69C}'

export default function ProviderDashboard() {
  const { currentUser } = useAuth()
  const { services } = useData()
  const { showToast, ToastComponent } = useToast()

  const myServices = useMemo(
    () => services.filter((service) => service.providerId === currentUser.id),
    [currentUser.id, services],
  )

  return (
    <div className="space-y-6 pb-24">
      <section className="overflow-hidden rounded-[28px] bg-gradient-to-br from-sky-600 via-blue-600 to-cyan-500 px-5 py-6 text-white shadow-xl shadow-sky-100">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-sky-50">Service Provider Dashboard</p>
            <h1 className="mt-2 text-2xl font-black leading-tight">
              Namaskara, {currentUser.name} {waveEmoji}
            </h1>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white/15 backdrop-blur">
            <Wrench className="h-7 w-7" />
          </div>
        </div>

        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3 py-2 text-sm font-medium text-white/90">
          <MapPin className="h-4 w-4" />
          <span>
            {currentUser.village}, {currentUser.district}
          </span>
        </div>

        <p className="mt-4 text-sm leading-6 text-sky-50">
          Your services are visible to farmers nearby.
        </p>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <article className="rounded-[24px] border border-sky-100 bg-sky-50 p-4">
          <p className="text-sm font-medium text-sky-700">Active Services</p>
          <p className="mt-3 text-3xl font-black text-slate-900">{myServices.length}</p>
        </article>
        <article className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Area Coverage</p>
          <p className="mt-3 text-lg font-bold text-slate-900">50 km radius</p>
        </article>
      </section>

      <section>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-700" />
          <h2 className="text-lg font-bold text-slate-900">My Services</h2>
        </div>

        {myServices.length > 0 ? (
          <div className="mt-4 space-y-3">
            {myServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                compact
                action={
                  <div className="flex items-center gap-3">
                    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                      {service.available ? 'Available' : 'Unavailable'}
                    </div>
                    <button
                      type="button"
                      onClick={() => showToast('Edit coming soon')}
                      className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white"
                    >
                      <PenSquare className="h-4 w-4" />
                      Edit
                    </button>
                  </div>
                }
              />
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-[28px] border border-dashed border-blue-200 bg-blue-50 p-5">
            <p className="text-lg font-semibold text-slate-900">
              You haven&apos;t listed any services yet. Add your first service so farmers can find you! {tractorEmoji}
            </p>
            <Link
              to="/provider/add-service"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-4 text-base font-semibold text-white shadow-lg shadow-blue-100"
            >
              <CirclePlus className="h-5 w-5" />
              Add Service
            </Link>
          </div>
        )}
      </section>

      <div className="pointer-events-none fixed inset-x-0 bottom-24 z-20 mx-auto flex w-full max-w-[430px] justify-end px-4">
        <Link
          to="/provider/add-service"
          className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-2xl shadow-green-100"
        >
          <CirclePlus className="h-5 w-5" />
          Add New Service
        </Link>
      </div>

      <ToastComponent />
    </div>
  )
}
