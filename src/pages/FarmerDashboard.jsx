import {
  BriefcaseBusiness,
  CirclePlus,
  MapPin,
  MessageCircle,
  Phone,
  Tractor,
  Users,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useData } from '../context/DataContext.jsx'
import { getNearby } from '../utils/location.js'

const waveEmoji = '\u{1F44B}'

const categoryStyles = {
  machinery: 'bg-emerald-100 text-emerald-700',
  chemical: 'bg-lime-100 text-lime-700',
  seeds: 'bg-amber-100 text-amber-700',
  testing: 'bg-sky-100 text-sky-700',
  other: 'bg-slate-100 text-slate-700',
}

function formatPhone(phone) {
  return `+91${phone}`
}

export default function FarmerDashboard() {
  const { currentUser } = useAuth()
  const { users, services } = useData()

  const nearbyLabour = getNearby(
    users.filter((user) => user.role === 'labour'),
    currentUser.lat,
    currentUser.lng,
    50,
  )

  const nearbyServices = getNearby(services, currentUser.lat, currentUser.lng, 60)

  return (
    <div className="space-y-6 pb-4">
      <section className="overflow-hidden rounded-[28px] bg-gradient-to-br from-green-600 via-emerald-600 to-lime-500 px-5 py-6 text-white shadow-xl shadow-green-100">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-green-50">Farmer Dashboard</p>
            <h1 className="mt-2 text-2xl font-black leading-tight">
              Namaskara, {currentUser.name} {waveEmoji}
            </h1>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white/15 backdrop-blur">
            <Tractor className="h-7 w-7" />
          </div>
        </div>

        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3 py-2 text-sm font-medium text-white/90">
          <MapPin className="h-4 w-4" />
          <span>
            {currentUser.village}, {currentUser.district}
          </span>
        </div>
      </section>

      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
          Quick Actions
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <Link
            to="/farmer/post-job"
            className="rounded-[24px] bg-green-600 p-4 text-white shadow-lg shadow-green-100"
          >
            <CirclePlus className="h-6 w-6" />
            <p className="mt-5 text-lg font-semibold">Post a Job</p>
            <p className="mt-1 text-sm text-green-50">Create a hiring request for nearby workers</p>
          </Link>

          <Link
            to="/farmer/jobs"
            className="rounded-[24px] border border-slate-200 bg-white p-4 text-slate-900 shadow-sm"
          >
            <BriefcaseBusiness className="h-6 w-6 text-green-700" />
            <p className="mt-5 text-lg font-semibold">My Jobs</p>
            <p className="mt-1 text-sm text-slate-500">Track your current and past job posts</p>
          </Link>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-green-700" />
          <h2 className="text-lg font-bold text-slate-900">Nearby Labour Available</h2>
        </div>

        {nearbyLabour.length > 0 ? (
          <div className="-mx-4 mt-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2">
            {nearbyLabour.map((labour) => (
              <article
                key={labour.id}
                className="min-w-[260px] snap-start rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-lg font-bold text-green-700">
                      {labour.avatar}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{labour.name}</h3>
                      <p className="text-sm text-slate-500">
                        {labour.village}, {labour.district}
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                    {labour.distanceKm} km away
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <a
                    href={`tel:${formatPhone(labour.phone)}`}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-3 py-3 text-sm font-semibold text-white"
                  >
                    <Phone className="h-4 w-4" />
                    Call
                  </a>
                  <a
                    href={`https://wa.me/91${labour.phone}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-600 px-3 py-3 text-sm font-semibold text-white"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm text-slate-500">
            No results nearby. Try expanding your search area.
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center gap-2">
          <Tractor className="h-5 w-5 text-green-700" />
          <h2 className="text-lg font-bold text-slate-900">Nearby Service Providers</h2>
        </div>

        {nearbyServices.length > 0 ? (
          <div className="mt-4 space-y-3">
            {nearbyServices.map((service) => (
              <article
                key={service.id}
                className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{service.serviceName}</h3>
                    <p className="mt-1 text-sm text-slate-500">{service.providerName}</p>
                  </div>
                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                    {service.distanceKm} km
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      categoryStyles[service.category] ?? categoryStyles.other
                    }`}
                  >
                    {service.category}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {service.priceInfo}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-600">{service.description}</p>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <p className="text-sm text-slate-500">
                    {service.village}, {service.district}
                  </p>
                  <a
                    href={`tel:${formatPhone(service.contactPhone)}`}
                    className="inline-flex items-center gap-2 rounded-2xl bg-green-600 px-4 py-3 text-sm font-semibold text-white"
                  >
                    <Phone className="h-4 w-4" />
                    Call
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm text-slate-500">
            No results nearby. Try expanding your search area.
          </div>
        )}
      </section>
    </div>
  )
}
