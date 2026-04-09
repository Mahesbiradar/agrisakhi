import {
  BriefcaseBusiness,
  CirclePlus,
  MapPin,
  Tractor,
  Users,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import PageSkeleton from '../components/PageSkeleton.jsx'
import ServiceCard from '../components/ServiceCard.jsx'
import UserCard from '../components/UserCard.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useData } from '../context/DataContext.jsx'
import { getNearby } from '../utils/location.js'
import { useDelayedLoading } from '../utils/useDelayedLoading.js'

const waveEmoji = '\u{1F44B}'
const labourEmoji = '\u{1F477}'
const serviceEmoji = '\u{1F69C}'

export default function FarmerDashboard() {
  const { currentUser } = useAuth()
  const { users, services } = useData()
  const loading = useDelayedLoading()

  const nearbyLabour = getNearby(
    users.filter((user) => user.role === 'labour'),
    currentUser.lat,
    currentUser.lng,
    50,
  )

  const nearbyServices = getNearby(services, currentUser.lat, currentUser.lng, 60)

  if (loading) {
    return <PageSkeleton variant="dashboard" />
  }

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
              <UserCard key={labour.id} user={labour} distanceKm={labour.distanceKm} />
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center">
            <p className="text-4xl">{labourEmoji}</p>
            <p className="mt-3 text-base font-semibold text-slate-800">No labourers nearby</p>
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
              <ServiceCard key={service.id} service={service} showDistance />
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center">
            <p className="text-4xl">{serviceEmoji}</p>
            <p className="mt-3 text-base font-semibold text-slate-800">No services listed</p>
          </div>
        )}
      </section>
    </div>
  )
}
