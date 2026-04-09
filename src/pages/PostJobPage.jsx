import { ArrowLeft, BriefcaseBusiness, MapPin } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useData } from '../context/DataContext.jsx'

const partyEmoji = '\u{1F389}'

const workTypeOptions = [
  { label: 'Harvesting', value: 'harvesting' },
  { label: 'Planting', value: 'planting' },
  { label: 'Irrigation', value: 'irrigation' },
  { label: 'Spraying', value: 'spraying' },
  { label: 'Other', value: 'other' },
]

export default function PostJobPage() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const { addJob } = useData()
  const [showToast, setShowToast] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    workType: 'harvesting',
    description: '',
    wage: '',
    duration: '',
    workersNeeded: '',
    contactPhone: currentUser.phone,
  })

  useEffect(() => {
    if (!showToast) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      navigate('/farmer', { replace: true })
    }, 1200)

    return () => window.clearTimeout(timeoutId)
  }, [navigate, showToast])

  const updateField = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    addJob({
      farmerId: currentUser.id,
      farmerName: currentUser.name,
      title: formData.title,
      description: formData.description,
      village: currentUser.village,
      district: currentUser.district,
      lat: currentUser.lat,
      lng: currentUser.lng,
      wage: Number(formData.wage),
      duration: formData.duration,
      workersNeeded: Number(formData.workersNeeded),
      workType: formData.workType,
      contactPhone: formData.contactPhone,
      postedAt: new Date().toISOString(),
      status: 'open',
    })

    setShowToast(true)
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
          <p className="text-sm font-medium text-green-700">Farmer Hiring</p>
          <h1 className="text-2xl font-black text-slate-900">Post a Job</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="title">
                Job Title
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(event) => updateField('title', event.target.value)}
                placeholder="e.g., Need labourers for paddy harvest"
                className="w-full rounded-2xl border border-slate-200 px-4 py-4 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-green-500"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="workType">
                Work Type
              </label>
              <select
                id="workType"
                value={formData.workType}
                onChange={(event) => updateField('workType', event.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-4 text-base text-slate-900 outline-none focus:border-green-500"
              >
                {workTypeOptions.map((option) => (
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
                className="w-full rounded-2xl border border-slate-200 px-4 py-4 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-green-500"
                placeholder="Describe the work, timing, and any special requirements"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="wage">
                  Daily Wage
                </label>
                <div className="relative">
                  <input
                    id="wage"
                    type="number"
                    min="1"
                    value={formData.wage}
                    onChange={(event) => updateField('wage', event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-4 pr-20 text-base text-slate-900 outline-none focus:border-green-500"
                    required
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm font-semibold text-slate-500">
                    INR/day
                  </span>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="duration">
                  Duration
                </label>
                <input
                  id="duration"
                  type="text"
                  value={formData.duration}
                  onChange={(event) => updateField('duration', event.target.value)}
                  placeholder="e.g., 3 days"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-4 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-green-500"
                  required
                />
              </div>
            </div>

            <div>
              <label
                className="mb-2 block text-sm font-semibold text-slate-700"
                htmlFor="workersNeeded"
              >
                Number of Workers Needed
              </label>
              <input
                id="workersNeeded"
                type="number"
                min="1"
                value={formData.workersNeeded}
                onChange={(event) => updateField('workersNeeded', event.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-4 text-base text-slate-900 outline-none focus:border-green-500"
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
                className="w-full rounded-2xl border border-slate-200 px-4 py-4 text-base text-slate-900 outline-none focus:border-green-500"
                required
              />
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-green-100 bg-green-50 p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-green-700">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-green-800">Location</p>
              <p className="mt-1 text-base font-semibold text-slate-900">
                {currentUser.village}, {currentUser.district}
              </p>
              <p className="mt-1 text-sm text-green-700/80">
                We&apos;ll use your profile location for this job post.
              </p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 py-4 text-base font-semibold text-white shadow-lg shadow-green-100 transition hover:bg-green-700"
        >
          <BriefcaseBusiness className="h-5 w-5" />
          Post Job
        </button>
      </form>

      {showToast ? (
        <div className="fixed inset-x-0 top-4 z-30 mx-auto w-[calc(100%-2rem)] max-w-[398px] rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-2xl">
          Job posted successfully! {partyEmoji}
        </div>
      ) : null}
    </div>
  )
}
