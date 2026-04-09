import { CalendarClock, IndianRupee, MapPin } from 'lucide-react'
import { getWorkTypeBadge } from '../utils/roleColors.js'

function formatRelativeTime(value) {
  const diffMs = Date.now() - new Date(value).getTime()
  const diffDays = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60 * 24)))

  if (diffDays < 7) {
    return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`
  }

  const diffWeeks = Math.floor(diffDays / 7)

  if (diffWeeks < 5) {
    return `${diffWeeks} week${diffWeeks === 1 ? '' : 's'} ago`
  }

  const diffMonths = Math.floor(diffDays / 30)
  return `${diffMonths} month${diffMonths === 1 ? '' : 's'} ago`
}

export default function JobCard({ job, showDistance = false, children }) {
  return (
    <article className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${getWorkTypeBadge(job.workType)}`}
        >
          {job.workType}
        </span>
        {showDistance ? (
          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
            {job.distanceKm} km away
          </span>
        ) : (
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              job.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-700'
            }`}
          >
            {job.status}
          </span>
        )}
      </div>

      <h2 className="mt-4 text-lg font-semibold leading-7 text-slate-900">{job.title}</h2>

      <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
        <MapPin className="h-4 w-4" />
        <span>
          {job.farmerName} / {job.village}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
          <IndianRupee className="h-3.5 w-3.5" />
          {job.wage}/day
        </span>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
          {job.duration}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
          <CalendarClock className="h-3.5 w-3.5" />
          Posted {formatRelativeTime(job.postedAt)}
        </span>
      </div>

      {children ? <div className="mt-4">{children}</div> : null}
    </article>
  )
}
