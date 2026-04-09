import { CalendarClock, IndianRupee } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useData } from '../context/DataContext.jsx'

const filters = [
  { label: 'All', value: 'all' },
  { label: 'Open', value: 'open' },
  { label: 'Closed', value: 'closed' },
]

const workTypeStyles = {
  harvesting: 'bg-amber-100 text-amber-700',
  planting: 'bg-green-100 text-green-700',
  irrigation: 'bg-sky-100 text-sky-700',
  spraying: 'bg-lime-100 text-lime-700',
  other: 'bg-slate-100 text-slate-700',
}

function formatDate(value) {
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function JobListPage() {
  const { currentUser } = useAuth()
  const { jobs } = useData()
  const [activeFilter, setActiveFilter] = useState('all')

  const farmerJobs = jobs.filter((job) => job.farmerId === currentUser.id)
  const filteredJobs =
    activeFilter === 'all'
      ? farmerJobs
      : farmerJobs.filter((job) => job.status.toLowerCase() === activeFilter)

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-green-700">Farmer Jobs</p>
        <h1 className="text-2xl font-black text-slate-900">My Posted Jobs</h1>
      </div>

      <div className="inline-flex rounded-full bg-slate-100 p-1">
        {filters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => setActiveFilter(filter.value)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeFilter === filter.value
                ? 'bg-white text-green-700 shadow-sm'
                : 'text-slate-500'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {filteredJobs.length > 0 ? (
        <div className="space-y-3">
          {filteredJobs.map((job) => (
            <article
              key={job.id}
              className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-lg font-semibold leading-7 text-slate-900">{job.title}</h2>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    job.status === 'open'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {job.status}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    workTypeStyles[job.workType] ?? workTypeStyles.other
                  }`}
                >
                  {job.workType}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  <IndianRupee className="h-3.5 w-3.5" />
                  {job.wage}/day
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {job.duration}
                </span>
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                <CalendarClock className="h-4 w-4" />
                <span>Posted on {formatDate(job.postedAt)}</span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center">
          <p className="text-base font-semibold text-slate-800">No jobs posted yet</p>
          <p className="mt-2 text-sm text-slate-500">
            Your posted jobs will appear here once you create your first hiring request.
          </p>
        </div>
      )}
    </div>
  )
}
