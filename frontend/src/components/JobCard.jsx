import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'

function getWorkTypeColor(type) {
  const map = {
    harvesting: 'bg-green-100 text-green-700',
    planting: 'bg-teal-100 text-teal-700',
    irrigation: 'bg-blue-100 text-blue-700',
    spraying: 'bg-purple-100 text-purple-700',
    land_prep: 'bg-orange-100 text-orange-700',
  }
  return map[type] || 'bg-gray-100 text-gray-600'
}

function AudioButton({ audioUrl }) {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const toggle = () => {
    if (!audioRef.current) return
    if (playing) { audioRef.current.pause(); setPlaying(false) }
    else { audioRef.current.play(); setPlaying(true) }
  }
  return (
    <>
      <audio ref={audioRef} src={audioUrl} onEnded={() => setPlaying(false)} className="hidden" />
      <button type="button" onClick={toggle}
        className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
        {playing ? '⏸' : '🔊'} Listen
      </button>
    </>
  )
}

export default function JobCard({ job, showDistance = false, showActions = false, children }) {
  const location = [job.village || '', job.district || ''].filter(Boolean).join(', ')
  const postedDate = job.created_at
    ? new Date(job.created_at).toLocaleDateString('en-IN')
    : ''

  return (
    <article className="w-full rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getWorkTypeColor(job.work_type)}`}>
          {job.work_type?.replace('_', ' ')}
        </span>
        {showDistance && job.distanceKm != null ? (
          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
            {job.distanceKm.toFixed(1)} km away
          </span>
        ) : (
          job.status && (
            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${job.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
              {job.status}
            </span>
          )
        )}
      </div>

      <h2 className="mt-2 text-base font-semibold text-gray-800">{job.title}</h2>

      {location && (
        <div className="mt-1 flex items-center gap-1 text-sm text-gray-500">
          <span>📍</span>
          <span>{location}</span>
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
        <span>💰 ₹{job.wage_per_day}/day</span>
        <span>⏱ {job.duration_days} days</span>
        <span>👥 {job.workers_needed} workers</span>
      </div>

      {postedDate && (
        <p className="mt-2 text-xs text-gray-400">Posted {postedDate}</p>
      )}

      {showActions && (
        <div className="mt-3 flex items-center justify-between">
          {job.audio_url ? <AudioButton audioUrl={job.audio_url} /> : <span />}
          <Link to={`/jobs/${job.id}`}
            className="ml-auto inline-flex items-center gap-1 rounded-2xl bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-amber-500 transition">
            View &amp; Apply →
          </Link>
        </div>
      )}

      {children && <div className="mt-4">{children}</div>}
    </article>
  )
}
