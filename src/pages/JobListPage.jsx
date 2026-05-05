import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import JobCard from '../components/JobCard.jsx'
import PageSkeleton from '../components/PageSkeleton.jsx'
import { jobsAPI } from '../lib/api.js'

const statusFilters = [
  { label: 'all', value: 'all' },
  { label: 'open', value: 'open' },
  { label: 'closed', value: 'closed' },
]

export default function JobListPage() {
  const { t } = useTranslation()
  const [activeFilter, setActiveFilter] = useState('all')

  const { data, isLoading } = useQuery({
    queryKey: ['farmer-jobs'],
    queryFn: jobsAPI.myJobs,
  })

  if (isLoading) return <PageSkeleton variant="list" />

  const jobs = data?.data || []
  const filtered = activeFilter === 'all' ? jobs : jobs.filter((j) => j.status === activeFilter)

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-green-700">Farmer Jobs</p>
        <h1 className="text-2xl font-black text-slate-900">{t('myJobs')}</h1>
      </div>

      <div className="inline-flex rounded-full bg-slate-100 p-1">
        {statusFilters.map((f) => (
          <button key={f.value} type="button" onClick={() => setActiveFilter(f.value)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeFilter === f.value ? 'bg-white text-green-700 shadow-sm' : 'text-slate-500'}`}>
            {t(f.label)}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((job) => <JobCard key={job.id} job={job} />)}
        </div>
      ) : (
        <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center">
          <p className="text-4xl">{'\u{1F33E}'}</p>
          <p className="mt-3 text-base font-semibold text-slate-800">{t('noJobsFound')}</p>
        </div>
      )}
    </div>
  )
}
