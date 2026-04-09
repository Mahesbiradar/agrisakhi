import {
  MapPin,
  MessageCircle,
  Phone,
  Search,
  Settings2,
  SlidersHorizontal,
  SunMedium,
} from 'lucide-react'
import { useState } from 'react'
import BottomSheet from '../components/BottomSheet.jsx'
import JobCard from '../components/JobCard.jsx'
import PageSkeleton from '../components/PageSkeleton.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useData } from '../context/DataContext.jsx'
import { getNearby } from '../utils/location.js'
import { useDelayedLoading } from '../utils/useDelayedLoading.js'

const waveEmoji = '\u{1F44B}'
const jobEmoji = '\u{1F33E}'

const workTypeOptions = ['all', 'harvesting', 'planting', 'irrigation', 'spraying', 'other']
const distanceOptions = [10, 25, 50, 100]
const minWageOptions = [300, 400, 500]

function formatToday() {
  return new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function formatPhone(phone) {
  return `+91${phone}`
}

export default function LabourDashboard() {
  const { currentUser } = useAuth()
  const { jobs } = useData()
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedDistance, setSelectedDistance] = useState(50)
  const [selectedWorkTypes, setSelectedWorkTypes] = useState(['all'])
  const [minWage, setMinWage] = useState(300)
  const loading = useDelayedLoading()

  const nearbyOpenJobs = getNearby(
    jobs.filter((job) => job.status === 'open'),
    currentUser.lat,
    currentUser.lng,
    selectedDistance,
  )

  const visibleJobs = nearbyOpenJobs.filter((job) => {
    const normalizedTitle = job.title.toLowerCase()
    const matchesSearch = normalizedTitle.includes(searchTerm.trim().toLowerCase())
    const matchesWorkType =
      selectedWorkTypes.includes('all') || selectedWorkTypes.includes(job.workType)
    const matchesWage = job.wage >= minWage

    return matchesSearch && matchesWorkType && matchesWage
  })

  const toggleWorkType = (workType) => {
    if (workType === 'all') {
      setSelectedWorkTypes(['all'])
      return
    }

    setSelectedWorkTypes((current) => {
      const withoutAll = current.filter((item) => item !== 'all')

      if (withoutAll.includes(workType)) {
        const next = withoutAll.filter((item) => item !== workType)
        return next.length > 0 ? next : ['all']
      }

      return [...withoutAll, workType]
    })
  }

  if (loading) {
    return <PageSkeleton variant="list" />
  }

  return (
    <div className="space-y-6 pb-4">
      <section className="overflow-hidden rounded-[28px] bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-300 px-5 py-6 text-slate-900 shadow-xl shadow-amber-100">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-amber-900/80">Labour Dashboard</p>
            <h1 className="mt-2 text-2xl font-black leading-tight">
              Namaskara, {currentUser.name} {waveEmoji}
            </h1>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white/45 backdrop-blur">
            <SunMedium className="h-7 w-7 text-amber-900" />
          </div>
        </div>

        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/35 px-3 py-2 text-sm font-medium text-amber-950">
          <MapPin className="h-4 w-4" />
          <span>
            {currentUser.village}, {currentUser.district}
          </span>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <article className="rounded-[24px] border border-amber-100 bg-amber-50 p-4">
          <p className="text-sm font-medium text-amber-800">Jobs Near You</p>
          <p className="mt-3 text-3xl font-black text-slate-900">{visibleJobs.length}</p>
        </article>
        <article className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Today</p>
          <p className="mt-3 text-lg font-bold text-slate-900">{formatToday()}</p>
        </article>
      </section>

      <section className="space-y-3">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by job title"
              className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-4 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-amber-400"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowFilters(true)}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-slate-700 shadow-sm"
          >
            <SlidersHorizontal className="h-5 w-5" />
            Filter
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
            Within {selectedDistance} km
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            INR {minWage}+
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            {selectedWorkTypes.includes('all')
              ? 'All work types'
              : `${selectedWorkTypes.length} type${selectedWorkTypes.length === 1 ? '' : 's'}`}
          </span>
        </div>
      </section>

      <section className="space-y-3">
        {visibleJobs.length > 0 ? (
          visibleJobs.map((job) => (
            <JobCard key={job.id} job={job} showDistance>
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <a
                  href={`tel:${formatPhone(job.contactPhone)}`}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-400 px-4 py-3 text-sm font-semibold text-slate-900"
                >
                  <Phone className="h-4 w-4" />
                  Connect with Farmer
                </a>
                <a
                  href={`https://wa.me/91${job.contactPhone}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-2xl bg-green-600 px-4 py-3 text-white"
                >
                  <MessageCircle className="h-4 w-4" />
                </a>
              </div>
            </JobCard>
          ))
        ) : (
          <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center">
            <p className="text-4xl">{jobEmoji}</p>
            <p className="mt-3 text-base font-semibold text-slate-800">No jobs found</p>
            <p className="mt-2 text-sm text-slate-500">Try increasing search radius.</p>
          </div>
        )}
      </section>

      <BottomSheet isOpen={showFilters} onClose={() => setShowFilters(false)} title="Filters">
        <div className="flex items-center gap-2">
          <Settings2 className="h-5 w-5 text-amber-700" />
          <p className="text-sm font-medium text-slate-500">Refine nearby jobs</p>
        </div>

        <div className="mt-6">
              <p className="text-sm font-semibold text-slate-700">Work Type</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {workTypeOptions.map((workType) => {
                  const isActive = selectedWorkTypes.includes(workType)
                  const label =
                    workType === 'all'
                      ? 'All'
                      : `${workType.charAt(0).toUpperCase()}${workType.slice(1)}`

                  return (
                    <button
                      key={workType}
                      type="button"
                      onClick={() => toggleWorkType(workType)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        isActive
                          ? 'bg-amber-400 text-slate-900'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
        </div>

        <div className="mt-6">
              <p className="text-sm font-semibold text-slate-700">Distance</p>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {distanceOptions.map((distance) => (
                  <button
                    key={distance}
                    type="button"
                    onClick={() => setSelectedDistance(distance)}
                    className={`rounded-2xl px-3 py-3 text-sm font-semibold transition ${
                      selectedDistance === distance
                        ? 'bg-amber-400 text-slate-900'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {distance}km
                  </button>
                ))}
              </div>
        </div>

        <div className="mt-6">
              <p className="text-sm font-semibold text-slate-700">Min Wage</p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {minWageOptions.map((wage) => (
                  <button
                    key={wage}
                    type="button"
                    onClick={() => setMinWage(wage)}
                    className={`rounded-2xl px-3 py-3 text-sm font-semibold transition ${
                      minWage === wage ? 'bg-amber-400 text-slate-900' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    INR {wage}+
                  </button>
                ))}
              </div>
        </div>

        <button
          type="button"
          onClick={() => setShowFilters(false)}
          className="mt-8 w-full rounded-2xl bg-slate-900 px-4 py-4 text-sm font-semibold text-white"
        >
          Apply Filters
        </button>
      </BottomSheet>
    </div>
  )
}
