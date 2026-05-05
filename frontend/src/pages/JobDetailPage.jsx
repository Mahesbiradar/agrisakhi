import { ArrowLeft, CheckCircle, Loader2, MapPin } from 'lucide-react'
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import PageSkeleton from '../components/PageSkeleton.jsx'
import { jobsAPI } from '../lib/api.js'

export default function JobDetailPage() {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const [applied, setApplied] = useState(false)
  const [applyError, setApplyError] = useState('')
  const [showAudio, setShowAudio] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['job', id],
    queryFn: () => jobsAPI.getById(id),
  })

  const applyMutation = useMutation({
    mutationFn: () => jobsAPI.apply(id),
    onSuccess: () => setApplied(true),
    onError: (err) => {
      const msg = err.response?.data?.detail || err.response?.data?.[0] || t('alreadyApplied')
      setApplyError(msg)
    },
  })

  if (isLoading) return <PageSkeleton variant="list" />

  const job = data?.data

  if (!job) return (
    <div className="px-4 py-8 text-center text-slate-500">Job not found.</div>
  )

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => navigate(-1)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <p className="text-sm font-medium text-amber-700">Job Details</p>
          <h1 className="text-xl font-black text-slate-900">{job.title}</h1>
        </div>
      </div>

      {job.image_url && (
        <img src={job.image_url} alt={job.title}
          className="h-48 w-full rounded-[24px] object-cover" />
      )}

      {job.audio_url && (
        <div className="rounded-[24px] border border-amber-100 bg-amber-50 p-4">
          {showAudio ? (
            <audio controls src={job.audio_url} autoPlay className="w-full" />
          ) : (
            <button type="button" onClick={() => setShowAudio(true)}
              className="flex w-full items-center justify-center gap-2 text-sm font-semibold text-amber-800">
              🔊 {t('listenDescription')} / ವಿವರ ಕೇಳಿ
            </button>
          )}
        </div>
      )}

      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <MapPin className="h-4 w-4" />
          <span>{job.village}, {job.district}</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-green-50 p-3">
            <p className="text-xs text-green-700">Daily Wage</p>
            <p className="mt-1 text-lg font-bold text-slate-900">INR {job.wage_per_day}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Duration</p>
            <p className="mt-1 text-lg font-bold text-slate-900">{job.duration_days} days</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Workers Needed</p>
            <p className="mt-1 text-lg font-bold text-slate-900">{job.workers_needed}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="text-xs text-slate-500">Work Type</p>
            <p className="mt-1 text-base font-bold text-slate-900 capitalize">{job.work_type}</p>
          </div>
        </div>

        {job.description && (
          <p className="text-sm leading-6 text-slate-600">{job.description}</p>
        )}

        <p className="text-sm text-slate-500">
          Posted by <span className="font-semibold text-slate-800">{job.farmer_name}</span>
        </p>
      </div>

      {applied ? (
        <div className="flex items-center gap-3 rounded-[24px] border border-green-200 bg-green-50 px-5 py-4">
          <CheckCircle className="h-6 w-6 text-green-600" />
          <p className="font-semibold text-green-800">{t('applySuccess')}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {applyError && (
            <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{applyError}</p>
          )}
          <button type="button" onClick={() => applyMutation.mutate()} disabled={applyMutation.isPending}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-400 px-4 py-4 text-base font-semibold text-slate-900 shadow-lg shadow-amber-100 transition hover:bg-amber-500 disabled:opacity-60">
            {applyMutation.isPending && <Loader2 className="h-5 w-5 animate-spin" />}
            {applyMutation.isPending ? t('applying') : t('apply')}
          </button>
        </div>
      )}
    </div>
  )
}
