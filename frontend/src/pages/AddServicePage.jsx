import { ArrowLeft, CheckCircle2, Loader2, MapPin, Wrench } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import ImageUpload from '../components/ImageUpload.jsx'
import useAuthStore from '../store/authStore.js'
import { servicesAPI } from '../lib/api.js'

const categoryOptions = [
  { label: 'Machinery', value: 'machinery' },
  { label: 'Chemical/Spraying', value: 'chemical' },
  { label: 'Seeds & Fertilizer', value: 'seeds' },
  { label: 'Soil Testing', value: 'testing' },
  { label: 'Other', value: 'other' },
]

export default function AddServicePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)

  const [formData, setFormData] = useState({
    serviceName: '', category: 'machinery', description: '', priceInfo: '', available: true,
  })
  const [imageUrl, setImageUrl] = useState('')
  const [error, setError] = useState('')

  const mutation = useMutation({
    mutationFn: (data) => servicesAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-services'] })
      navigate('/provider', { replace: true })
    },
    onError: (err) => {
      setError(err.userMessage || 'Failed to list service. Try again.')
    },
  })

  const update = (field, value) => setFormData((f) => ({ ...f, [field]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    mutation.mutate({
      service_name: formData.serviceName,
      category: formData.category,
      description: formData.description,
      price_info: formData.priceInfo,
      image_url: imageUrl,
      is_available: formData.available,
    })
  }

  return (
    <div className="space-y-6 pt-16">
      <button type="button" onClick={() => navigate(-1)}
        className="fixed left-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow text-slate-600 hover:shadow-md transition">
        ←
      </button>
      <div>
        <p className="text-sm font-medium text-blue-700">Provider Listing</p>
        <h1 className="text-2xl font-black text-slate-900">{t('addService')}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="serviceName">{t('serviceName')}</label>
              <input id="serviceName" type="text" value={formData.serviceName}
                onChange={(e) => update('serviceName', e.target.value)}
                placeholder="e.g., Tractor Ploughing Service"
                className="w-full rounded-2xl border border-slate-200 px-4 py-4 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500"
                required />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="category">{t('category')}</label>
              <select id="category" value={formData.category} onChange={(e) => update('category', e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-4 text-base text-slate-900 outline-none focus:border-blue-500">
                {categoryOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="description">{t('description')}</label>
              <textarea id="description" rows="3" value={formData.description}
                onChange={(e) => update('description', e.target.value)}
                placeholder="Describe your service..."
                className="w-full rounded-2xl border border-slate-200 px-4 py-4 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500"
                required />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="priceInfo">{t('priceInfo')}</label>
              <input id="priceInfo" type="text" value={formData.priceInfo}
                onChange={(e) => update('priceInfo', e.target.value)}
                placeholder="e.g., INR 1200 per acre"
                className="w-full rounded-2xl border border-slate-200 px-4 py-4 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500"
                required />
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-slate-700">{t('uploadPhoto')}</p>
              <ImageUpload onImageReady={setImageUrl} />
            </div>

            <button type="button" onClick={() => update('available', !formData.available)}
              className={`flex w-full items-center justify-between rounded-[24px] border px-4 py-4 transition ${formData.available ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-slate-50'}`}>
              <div className="flex items-center gap-3">
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${formData.available ? 'bg-white text-emerald-600' : 'bg-white text-slate-500'}`}>
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-slate-900">{t('available')}</p>
                  <p className="text-sm text-slate-500">{t('availableDesc')}</p>
                </div>
              </div>
              <div className={`relative h-7 w-12 rounded-full transition ${formData.available ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${formData.available ? 'left-6' : 'left-1'}`} />
              </div>
            </button>
          </div>
        </div>

        <div className="rounded-[28px] border border-blue-100 bg-blue-50 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-blue-700">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-800">{t('location')}</p>
              <p className="mt-1 text-base font-semibold text-slate-900">{user?.village}, {user?.district}</p>
              <p className="mt-1 text-sm text-blue-700/80">{t('locationDesc')}</p>
            </div>
          </div>
        </div>

        {error && <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}

        <button type="submit" disabled={mutation.isPending}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 py-4 text-base font-semibold text-white shadow-lg shadow-green-100 transition hover:bg-green-700 disabled:opacity-60">
          {mutation.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Wrench className="h-5 w-5" />}
          {t('listService')}
        </button>
      </form>
    </div>
  )
}
