import { useState } from 'react'
import JobCard from '../components/JobCard.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useData } from '../context/DataContext.jsx'

const filters = [
  { label: 'All', value: 'all' },
  { label: 'Open', value: 'open' },
  { label: 'Closed', value: 'closed' },
]

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
            <JobCard key={job.id} job={job} />
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
