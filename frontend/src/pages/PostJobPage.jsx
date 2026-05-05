import { ArrowLeft, BriefcaseBusiness, Loader2, MapPin } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import AudioRecorderComponent from '../components/AudioRecorderComponent.jsx'
import ImageUpload from '../components/ImageUpload.jsx'
import useAuthStore from '../store/authStore.js'
import { jobsAPI } from '../lib/api.js'

const workTypeOptions = [
  { label: 'Harvesting', value: 'harvesting' },
  { label: 'Planting', value: 'planting' },
  { label: 'Irrigation', value: 'irrigation' },
  { label: 'Spraying', value: 'spraying' },
  { label: 'Land Prep', value: 'land_prep' },
  { label: 'Other', value: 'other' },
]

export default function PostJobPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)

  const [formData, setFormData] = useState({
    title: '', work_type: 'harvesting', description: '',
    wage_per_day: '', duration_days: '', workers_needed: '1',
  })
  const [audioUrl, setAudioUrl] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [error, setError] = useState('')

  const mutation = useMutation({
    mutationFn: (data) => jobsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farmer-jobs'] })
      navigate('/farmer', { replace: true })
    },
    onError: (err) => {
      setError(err.response?.data?.detail || 'Failed to post job. Try again.')
    },
  })

  const update = (field, value) => setFormData((f) => ({ ...f, [field]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    mutation.mutate({
      title: formData.title,
      work_type: formData.work_type,
      description: formData.description,
      audio_url: audioUrl,
      image_url: imageUrl,
      wage_per_day: Number(formData.wage_per_day),
      duration_days: Number(formData.duration_days),
      workers_needed: Number(formData.workers_needed),
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => navigate(-1)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <p className="text-sm font-medium text-green-700">Farmer Hiring</p>
          <h1 className="text-2xl font-black text-slate-900">{t('postJob')}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="title">{t('jobTitle')}</label>
              <input id="title" type="text" value={formData.title} onChange={(e) => update('title', e.target.value)}
                placeholder="e.g., Need labourers for paddy harvest"
                className="w-full rounded-2xl border border-slate-200 px-4 py-4 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-green-500"
                required />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="work_type">{t('workType')}</label>
              <select id="work_type" value={formData.work_type} onChange={(e) => update('work_type', e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-4 text-base text-slate-900 outline-none focus:border-green-500">
                {workTypeOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="description">{t('description')}</label>
              <textarea id="description" rows="3" value={formData.description}
                onChange={(e) => update('description', e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-4 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-green-500"
                placeholder="Describe the work, timing, and requirements" required />
            </div>

            <div>
              <p className="mb-2 block text-sm font-semibold text-slate-700">{t('tapToRecord')}</p>
              <AudioRecorderComponent onAudioReady={setAudioUrl} existingUrl={audioUrl} />
            </div>

            <div>
              <p className="mb-2 block text-sm font-semibold text-slate-700">{t('uploadPhoto')}</p>
              <ImageUpload onImageReady={setImageUrl} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="wage_per_day">{t('wagePerDay')}</label>
                <div className="relative">
                  <input id="wage_per_day" type="number" min="1" value={formData.wage_per_day}
                    onChange={(e) => update('wage_per_day', e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-4 pr-20 text-base text-slate-900 outline-none focus:border-green-500"
                    required />
                  <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm font-semibold text-slate-500">INR/day</span>
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="duration_days">{t('durationDays')}</label>
                <input id="duration_days" type="number" min="1" value={formData.duration_days}
                  onChange={(e) => update('duration_days', e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-4 text-base text-slate-900 outline-none focus:border-green-500"
                  required />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="workers_needed">{t('workersNeeded')}</label>
              <input id="workers_needed" type="number" min="1" value={formData.workers_needed}
                onChange={(e) => update('workers_needed', e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-4 text-base text-slate-900 outline-none focus:border-green-500"
                required />
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-green-100 bg-green-50 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-green-700">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-green-800">{t('location')}</p>
              <p className="mt-1 text-base font-semibold text-slate-900">{user?.village}, {user?.district}</p>
              <p className="mt-1 text-sm text-green-700/80">{t('locationDesc')}</p>
            </div>
          </div>
        </div>

        {error && <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

        <button type="submit" disabled={mutation.isPending}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 py-4 text-base font-semibold text-white shadow-lg shadow-green-100 transition hover:bg-green-700 disabled:opacity-60">
          {mutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <BriefcaseBusiness className="h-5 w-5" />}
          {t('postJob')}
        </button>
      </form>
    </div>
  )
}
