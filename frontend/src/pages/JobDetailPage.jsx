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
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-xl">🎙️</div>
            <div>
              <p className="font-semibold text-amber-800 text-sm">Farmer's Voice Description</p>
              <p className="text-xs text-amber-600">ರೈತರ ಧ್ವನಿ ವಿವರಣೆ · Tap play to listen</p>
            </div>
          </div>
          <audio
            controls
            src={job.audio_url}
            className="w-full rounded-xl"
            style={{ height: '48px', accentColor: '#d97706' }}
          />
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

      {job.farmer_phone && (
        <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
          <p className="text-sm font-semibold text-green-800 mb-3 flex items-center gap-2">
            <span>📞</span> Contact Farmer Directly
          </p>
          <div className="flex gap-3">
            <a href={`tel:+91${job.farmer_phone}`}
              className="flex-1 bg-white border-2 border-green-500 rounded-xl py-3 flex items-center justify-center gap-2 text-green-700 font-semibold text-sm hover:bg-green-50 transition-colors active:scale-95">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-green-600">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
              Call Farmer
            </a>
            <a href={`https://wa.me/91${job.farmer_phone}?text=${encodeURIComponent(`Hi, I saw your job post on AgriSakhi: ${job.title}`)}`}
              target="_blank" rel="noopener noreferrer"
              className="flex-1 rounded-xl py-3 flex items-center justify-center gap-2 text-white font-semibold text-sm active:scale-95 transition-transform"
              style={{ background: '#25D366' }}>
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>
          </div>
        </div>
      )}

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
