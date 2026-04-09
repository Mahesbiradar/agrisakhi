import { ArrowLeft, CheckCircle2, MapPin, Wrench } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useData } from '../context/DataContext.jsx'
import { useToast } from '../utils/useToast.js'

const partyEmoji = '\u{1F389}'

const categoryOptions = [
  { label: 'Machinery', value: 'machinery' },
  { label: 'Chemical/Spraying', value: 'chemical' },
  { label: 'Seeds & Fertilizer', value: 'seeds' },
  { label: 'Soil Testing', value: 'testing' },
  { label: 'Other', value: 'other' },
]

export default function AddServicePage() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const { addService } = useData()
  const [submitted, setSubmitted] = useState(false)
  const { showToast, ToastComponent } = useToast()
  const [formData, setFormData] = useState({
    serviceName: '',
    category: 'machinery',
    description: '',
    priceInfo: '',
    contactPhone: currentUser.phone,
    available: true,
  })

  useEffect(() => {
    if (!submitted) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      navigate('/provider', { replace: true })
    }, 1400)

    return () => window.clearTimeout(timeoutId)
  }, [navigate, submitted])

  const updateField = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    addService({
      providerId: currentUser.id,
      providerName: currentUser.name,
      serviceName: formData.serviceName,
      description: formData.description,
      village: currentUser.village,
      district: currentUser.district,
      lat: currentUser.lat,
      lng: currentUser.lng,
      priceInfo: formData.priceInfo,
      contactPhone: formData.contactPhone,
      available: formData.available,
      category: formData.category,
    })

    showToast(`Service listed! Farmers nearby can now see you ${partyEmoji}`)
    setSubmitted(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <p className="text-sm font-medium text-blue-700">Provider Listing</p>
          <h1 className="text-2xl font-black text-slate-900">Add Service</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="space-y-5">
            <div>
              <label
                className="mb-2 block text-sm font-semibold text-slate-700"
                htmlFor="serviceName"
              >
                Service Name
              </label>
              <input
                id="serviceName"
                type="text"
                value={formData.serviceName}
                onChange={(event) => updateField('serviceName', event.target.value)}
                placeholder="e.g., Tractor Ploughing Service"
                className="w-full rounded-2xl border border-slate-200 px-4 py-4 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="category">
                Category
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(event) => updateField('category', event.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-4 text-base text-slate-900 outline-none focus:border-blue-500"
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className="mb-2 block text-sm font-semibold text-slate-700"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                id="description"
                rows="3"
                value={formData.description}
                onChange={(event) => updateField('description', event.target.value)}
                placeholder="Describe your service..."
                className="w-full rounded-2xl border border-slate-200 px-4 py-4 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="priceInfo">
                Price Info
              </label>
              <input
                id="priceInfo"
                type="text"
                value={formData.priceInfo}
                onChange={(event) => updateField('priceInfo', event.target.value)}
                placeholder="e.g., INR 1200 per acre or INR 800 per day"
                className="w-full rounded-2xl border border-slate-200 px-4 py-4 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label
                className="mb-2 block text-sm font-semibold text-slate-700"
                htmlFor="contactPhone"
              >
                Contact Phone
              </label>
              <input
                id="contactPhone"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={formData.contactPhone}
                onChange={(event) =>
                  updateField('contactPhone', event.target.value.replace(/\D/g, '').slice(0, 10))
                }
                className="w-full rounded-2xl border border-slate-200 px-4 py-4 text-base text-slate-900 outline-none focus:border-blue-500"
                required
              />
            </div>

            <button
              type="button"
              onClick={() => updateField('available', !formData.available)}
              className={`flex w-full items-center justify-between rounded-[24px] border px-4 py-4 transition ${
                formData.available
                  ? 'border-emerald-200 bg-emerald-50'
                  : 'border-slate-200 bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                    formData.available ? 'bg-white text-emerald-600' : 'bg-white text-slate-500'
                  }`}
                >
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-slate-900">Currently Available</p>
                  <p className="text-sm text-slate-500">
                    Farmers can contact you immediately when this is on.
                  </p>
                </div>
              </div>
              <div
                className={`relative h-7 w-12 rounded-full transition ${
                  formData.available ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                    formData.available ? 'left-6' : 'left-1'
                  }`}
                />
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
              <p className="text-sm font-semibold text-blue-800">Location</p>
              <p className="mt-1 text-base font-semibold text-slate-900">
                {currentUser.village}, {currentUser.district}
              </p>
              <p className="mt-1 text-sm text-blue-700/80">
                Your service will be shown to nearby farmers using this profile location.
              </p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 py-4 text-base font-semibold text-white shadow-lg shadow-green-100 transition hover:bg-green-700"
        >
          <Wrench className="h-5 w-5" />
          List Service
        </button>
      </form>

      <ToastComponent />
    </div>
  )
}
