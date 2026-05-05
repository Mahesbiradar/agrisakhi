import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Loader2 } from 'lucide-react'
import PageSkeleton from '../components/PageSkeleton.jsx'
import BottomSheet from '../components/BottomSheet.jsx'
import { jobsAPI } from '../lib/api.js'
import { useToast } from '../utils/useToast.js'

const WORK_TYPES = ['harvesting', 'planting', 'irrigation', 'spraying', 'land_prep', 'other']
const CLOSE_REASONS = [
  { value: 'work_done', label: '✅ Work Done' },
  { value: 'found_workers', label: '👥 Found Workers' },
  { value: 'postponed', label: '⏸ Postponed' },
  { value: 'other', label: 'Other' },
]

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

export default function JobListPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { showToast, ToastComponent } = useToast()

  const [activeFilter, setActiveFilter] = useState('all')
  const [closingJob, setClosingJob] = useState(null)
  const [closeReason, setCloseReason] = useState('')
  const [closeRemark, setCloseRemark] = useState('')
  const [editingJob, setEditingJob] = useState(null)
  const [editData, setEditData] = useState({})

  const { data, isLoading } = useQuery({
    queryKey: ['farmer-jobs'],
    queryFn: jobsAPI.myJobs,
  })

  const closeMutation = useMutation({
    mutationFn: ({ id, data }) => jobsAPI.closeJob(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farmer-jobs'] })
      setClosingJob(null)
      showToast('Job closed successfully')
    },
  })

  const editMutation = useMutation({
    mutationFn: ({ id, data }) => jobsAPI.updateJob(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farmer-jobs'] })
      setEditingJob(null)
      showToast('Job updated successfully')
    },
  })

  if (isLoading) return <PageSkeleton variant="list" />

  const jobs = data?.data || []
  const filtered = activeFilter === 'all' ? jobs : jobs.filter((j) => j.status === activeFilter)

  const openCloseSheet = (job) => { setClosingJob(job); setCloseReason(''); setCloseRemark('') }
  const openEditSheet = (job) => {
    setEditingJob(job)
    setEditData({
      title: job.title,
      work_type: job.work_type,
      wage_per_day: job.wage_per_day,
      duration_days: job.duration_days,
      workers_needed: job.workers_needed,
      description: job.description || '',
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-green-700">Farmer Jobs</p>
        <h1 className="text-2xl font-black text-slate-900">
          {t('myJobs')} <span className="ml-1 text-base font-semibold text-slate-400">({jobs.length})</span>
        </h1>
      </div>

      <div className="inline-flex rounded-full bg-slate-100 p-1">
        {[{ label: 'All', value: 'all' }, { label: 'Open', value: 'open' }, { label: 'Closed', value: 'closed' }].map((f) => (
          <button key={f.value} type="button" onClick={() => setActiveFilter(f.value)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeFilter === f.value ? 'bg-white text-green-700 shadow-sm' : 'text-slate-500'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((job) => (
            <div key={job.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getWorkTypeColor(job.work_type)}`}>
                  {job.work_type?.replace('_', ' ')}
                </span>
                <div className="flex gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${job.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                    {job.status}
                  </span>
                  {job.applications_count > 0 && (
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                      {job.applications_count} applied
                    </span>
                  )}
                </div>
              </div>

              <h3 className="font-semibold text-slate-900">{job.title}</h3>

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
                <span>💰 ₹{job.wage_per_day}/day</span>
                <span>⏱ {job.duration_days} days</span>
                <span className="text-xs text-slate-400">
                  Posted {new Date(job.created_at).toLocaleDateString('en-IN')}
                </span>
              </div>

              {job.status === 'open' && (
                <div className="flex flex-wrap gap-2 pt-1">
                  <button type="button"
                    onClick={() => navigate(`/farmer/jobs/${job.id}/applications`)}
                    className="rounded-xl border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50 transition">
                    View Applications ({job.applications_count || 0})
                  </button>
                  <button type="button" onClick={() => openEditSheet(job)}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition">
                    Edit
                  </button>
                  <button type="button" onClick={() => openCloseSheet(job)}
                    className="rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition">
                    Close Job
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center">
          <p className="text-4xl">🌾</p>
          <p className="mt-3 text-base font-semibold text-slate-800">{t('noJobsFound')}</p>
        </div>
      )}

      <BottomSheet isOpen={!!closingJob} onClose={() => setClosingJob(null)} title="Close this job?">
        <p className="text-sm text-slate-600 mb-3">Select a reason for closing:</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {CLOSE_REASONS.map((r) => (
            <button key={r.value} type="button" onClick={() => setCloseReason(r.value)}
              className={`rounded-full px-4 py-2 text-sm font-semibold border transition ${closeReason === r.value ? 'bg-red-600 text-white border-red-600' : 'bg-white text-slate-700 border-slate-200'}`}>
              {r.label}
            </button>
          ))}
        </div>
        <textarea value={closeRemark} onChange={(e) => setCloseRemark(e.target.value)}
          placeholder="Add a note... (optional)" rows={3}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-red-400 resize-none" />
        <div className="mt-4 flex gap-3">
          <button type="button" onClick={() => setClosingJob(null)}
            className="flex-1 rounded-2xl border border-slate-200 py-3 text-sm font-semibold text-slate-700">
            Cancel
          </button>
          <button type="button"
            disabled={!closeReason || closeMutation.isPending}
            onClick={() => closeMutation.mutate({ id: closingJob.id, data: { reason: closeReason, remark: closeRemark } })}
            className="flex-1 rounded-2xl bg-red-600 py-3 text-sm font-semibold text-white disabled:opacity-60 flex items-center justify-center gap-2">
            {closeMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Close Job
          </button>
        </div>
      </BottomSheet>

      <BottomSheet isOpen={!!editingJob} onClose={() => setEditingJob(null)} title="Edit Job">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Title</label>
            <input type="text" value={editData.title || ''}
              onChange={(e) => setEditData((d) => ({ ...d, title: e.target.value }))}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-green-500" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Work Type</label>
            <select value={editData.work_type || ''} onChange={(e) => setEditData((d) => ({ ...d, work_type: e.target.value }))}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-green-500">
              {WORK_TYPES.map((wt) => <option key={wt} value={wt}>{wt.replace('_', ' ')}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { key: 'wage_per_day', label: 'Wage/day (₹)' },
              { key: 'duration_days', label: 'Duration (days)' },
              { key: 'workers_needed', label: 'Workers' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="mb-1 block text-xs font-semibold text-slate-700">{label}</label>
                <input type="number" value={editData[key] || ''}
                  onChange={(e) => setEditData((d) => ({ ...d, [key]: e.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-green-500" />
              </div>
            ))}
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Description</label>
            <textarea value={editData.description || ''} rows={3}
              onChange={(e) => setEditData((d) => ({ ...d, description: e.target.value }))}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-green-500 resize-none" />
          </div>
          <button type="button" disabled={editMutation.isPending}
            onClick={() => editMutation.mutate({ id: editingJob.id, data: editData })}
            className="w-full rounded-2xl bg-green-600 py-3 text-sm font-semibold text-white disabled:opacity-60 flex items-center justify-center gap-2">
            {editMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Save Changes
          </button>
        </div>
      </BottomSheet>

      <ToastComponent />
    </div>
  )
}
