import {
  MapPin, MessageCircle, Phone, Search, Settings2, SlidersHorizontal, SunMedium,
} from 'lucide-react'
import { useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import BottomSheet from '../components/BottomSheet.jsx'
import JobCard from '../components/JobCard.jsx'
import PageSkeleton from '../components/PageSkeleton.jsx'
import useAuthStore from '../store/authStore.js'
import { jobsAPI } from '../lib/api.js'

const waveEmoji = '\u{1F44B}'
const jobEmoji = '\u{1F33E}'
const workTypeOptions = ['all', 'harvesting', 'planting', 'irrigation', 'spraying', 'other']
const distanceOptions = [10, 25, 50, 100]
const minWageOptions = [300, 400, 500]

function formatToday() {
  return new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
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
    <div>
      <audio ref={audioRef} src={audioUrl} onEnded={() => setPlaying(false)} className="hidden" />
      <button type="button" onClick={toggle}
        className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
        {playing ? '⏸' : '🔊'} Listen
      </button>
    </div>
  )
}

export default function LabourDashboard() {
  const { t } = useTranslation()
  const user = useAuthStore((s) => s.user)
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({ radius_km: 50, work_type: '', min_wage: 0 })
  const [selectedWorkTypes, setSelectedWorkTypes] = useState(['all'])
  const [selectedDistance, setSelectedDistance] = useState(50)
  const [minWage, setMinWage] = useState(300)

  const { data, isLoading } = useQuery({
    queryKey: ['jobs', filters, user?.lat, user?.lng],
    queryFn: () => jobsAPI.list({ lat: user?.lat, lng: user?.lng, ...filters }),
    enabled: !!user,
    keepPreviousData: true,
  })

  if (isLoading) return <PageSkeleton variant="list" />

  const jobs = data?.data || []
  const visibleJobs = jobs.filter((job) => {
    const matchSearch = job.title.toLowerCase().includes(searchTerm.trim().toLowerCase())
    const matchType = selectedWorkTypes.includes('all') || selectedWorkTypes.includes(job.work_type)
    const matchWage = job.wage_per_day >= minWage
    return matchSearch && matchType && matchWage
  })

  const toggleWorkType = (wt) => {
    if (wt === 'all') { setSelectedWorkTypes(['all']); return }
    setSelectedWorkTypes((cur) => {
      const without = cur.filter((x) => x !== 'all')
      if (without.includes(wt)) {
        const next = without.filter((x) => x !== wt)
        return next.length > 0 ? next : ['all']
      }
      return [...without, wt]
    })
  }

  const applyFilters = () => {
    setFilters({
      radius_km: selectedDistance,
      work_type: selectedWorkTypes.includes('all') ? '' : selectedWorkTypes[0],
      min_wage: minWage,
    })
    setShowFilters(false)
  }

  return (
    <div className="space-y-6 pb-4">
      <section className="overflow-hidden rounded-[28px] bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-300 px-5 py-6 text-slate-900 shadow-xl shadow-amber-100">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-amber-900/80">{t('labourDashboard')}</p>
            <h1 className="mt-2 text-2xl font-black leading-tight">{t('namaskara')}, {user?.name} {waveEmoji}</h1>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white/45 backdrop-blur">
            <SunMedium className="h-7 w-7 text-amber-900" />
          </div>
        </div>
        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/35 px-3 py-2 text-sm font-medium text-amber-950">
          <MapPin className="h-4 w-4" />
          <span>{user?.village}, {user?.district}</span>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <article className="rounded-[24px] border border-amber-100 bg-amber-50 p-4">
          <p className="text-sm font-medium text-amber-800">{t('jobsNearYou')}</p>
          <p className="mt-3 text-3xl font-black text-slate-900">{visibleJobs.length}</p>
        </article>
        <article className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-500">{t('today')}</p>
          <p className="mt-3 text-lg font-bold text-slate-900">{formatToday()}</p>
        </article>
      </section>

      <section className="space-y-3">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by job title"
              className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-4 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-amber-400" />
          </div>
          <button type="button" onClick={() => setShowFilters(true)}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-slate-700 shadow-sm">
            <SlidersHorizontal className="h-5 w-5" />
            {t('filterBy')}
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">Within {selectedDistance} km</span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">INR {minWage}+</span>
        </div>
      </section>

      <section className="space-y-3">
        {visibleJobs.length > 0 ? (
          visibleJobs.map((job) => (
            <JobCard key={job.id} job={job} showDistance>
              {job.audio_url && <AudioButton audioUrl={job.audio_url} />}
              {job.image_url && (
                <img src={job.image_url} alt="job" className="h-16 w-16 rounded-xl object-cover" />
              )}
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <a href={`tel:+91${job.farmer?.phone || ''}`}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-amber-400 px-4 py-3 text-sm font-semibold text-slate-900">
                  <Phone className="h-4 w-4" />
                  {t('connectFarmer')}
                </a>
                <a href={`https://wa.me/91${job.farmer?.phone || ''}`} target="_blank" rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-2xl bg-green-600 px-4 py-3 text-white">
                  <MessageCircle className="h-4 w-4" />
                </a>
              </div>
            </JobCard>
          ))
        ) : (
          <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center">
            <p className="text-4xl">{jobEmoji}</p>
            <p className="mt-3 text-base font-semibold text-slate-800">{t('noJobsFound')}</p>
          </div>
        )}
      </section>

      <BottomSheet isOpen={showFilters} onClose={() => setShowFilters(false)} title="Filters">
        <div className="flex items-center gap-2">
          <Settings2 className="h-5 w-5 text-amber-700" />
          <p className="text-sm font-medium text-slate-500">Refine nearby jobs</p>
        </div>
        <div className="mt-6">
          <p className="text-sm font-semibold text-slate-700">{t('workTypeFilter')}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {workTypeOptions.map((wt) => (
              <button key={wt} type="button" onClick={() => toggleWorkType(wt)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${selectedWorkTypes.includes(wt) ? 'bg-amber-400 text-slate-900' : 'bg-slate-100 text-slate-600'}`}>
                {wt === 'all' ? 'All' : wt.charAt(0).toUpperCase() + wt.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-6">
          <p className="text-sm font-semibold text-slate-700">{t('distanceFilter')}</p>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {distanceOptions.map((d) => (
              <button key={d} type="button" onClick={() => setSelectedDistance(d)}
                className={`rounded-2xl px-3 py-3 text-sm font-semibold transition ${selectedDistance === d ? 'bg-amber-400 text-slate-900' : 'bg-slate-100 text-slate-600'}`}>
                {d}km
              </button>
            ))}
          </div>
        </div>
        <div className="mt-6">
          <p className="text-sm font-semibold text-slate-700">{t('minWageFilter')}</p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {minWageOptions.map((w) => (
              <button key={w} type="button" onClick={() => setMinWage(w)}
                className={`rounded-2xl px-3 py-3 text-sm font-semibold transition ${minWage === w ? 'bg-amber-400 text-slate-900' : 'bg-slate-100 text-slate-600'}`}>
                INR {w}+
              </button>
            ))}
          </div>
        </div>
        <button type="button" onClick={applyFilters}
          className="mt-8 w-full rounded-2xl bg-slate-900 px-4 py-4 text-sm font-semibold text-white">
          {t('applyFilters')}
        </button>
      </BottomSheet>
    </div>
  )
}
