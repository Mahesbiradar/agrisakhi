import { ArrowLeft, Leaf, MapPin, Truck, UserRound, Users } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { getDashboardPath } from '../utils/auth.js'

const districts = ['Shimoga', 'Davangere', 'Chitradurga', 'Shivamogga', 'Hassan', 'Tumkur']

const roleOptions = [
  {
    value: 'farmer',
    label: 'Farmer',
    icon: UserRound,
    description: 'Hire workers and manage farm needs',
  },
  {
    value: 'labour',
    label: 'Labour',
    icon: Users,
    description: 'Find nearby daily work quickly',
  },
  {
    value: 'provider',
    label: 'Service Provider',
    icon: Truck,
    description: 'List machinery, seeds, and agri services',
  },
]

export default function RegisterPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { register } = useAuth()
  const requestedRole = searchParams.get('role')
  const initialRole = roleOptions.some((option) => option.value === requestedRole)
    ? requestedRole
    : 'farmer'

  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    role: initialRole,
    village: '',
    district: 'Shimoga',
  })

  const updateField = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleNext = (event) => {
    event.preventDefault()
    setStep(2)
  }

  const handleCreateAccount = (event) => {
    event.preventDefault()
    const registeredUser = register(formData)
    navigate(getDashboardPath(registeredUser.role), { replace: true })
  }

  return (
    <div className="max-w-[430px] mx-auto min-h-screen bg-gradient-to-b from-green-50 via-white to-white relative">
      <div className="px-5 pb-8 pt-6">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => (step === 1 ? navigate(-1) : setStep(1))}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-2 text-xs font-semibold text-green-700">
            <Leaf className="h-4 w-4" />
            Step {step} of 2
          </div>
        </div>

        <div className="mt-8">
          <h1 className="text-3xl font-black text-slate-900">Create your account</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Join AgriSakhi and connect with nearby people, work, and farm services.
          </p>
        </div>

        <div className="mt-6 h-2 rounded-full bg-slate-100">
          <div
            className={`h-2 rounded-full bg-green-600 transition-all duration-300 ${
              step === 1 ? 'w-1/2' : 'w-full'
            }`}
          />
        </div>

        {step === 1 ? (
          <form onSubmit={handleNext} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="name">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(event) => updateField('name', event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-green-500"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="phone">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={formData.phone}
                onChange={(event) =>
                  updateField('phone', event.target.value.replace(/\D/g, '').slice(0, 10))
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-green-500"
                placeholder="Enter 10 digit mobile number"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(event) => updateField('password', event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-green-500"
                placeholder="Create a password"
                required
              />
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold text-slate-700">Select your role</p>
              <div className="space-y-3">
                {roleOptions.map((option) => {
                  const Icon = option.icon
                  const isActive = formData.role === option.value

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => updateField('role', option.value)}
                      className={`flex w-full items-center gap-4 rounded-3xl border px-4 py-4 text-left transition ${
                        isActive
                          ? 'border-green-600 bg-green-50 shadow-lg shadow-green-100'
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                          isActive ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{option.label}</p>
                        <p className="mt-1 text-sm text-slate-500">{option.description}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-green-600 px-4 py-4 text-base font-semibold text-white shadow-lg shadow-green-100 transition hover:bg-green-700"
            >
              Next
            </button>
          </form>
        ) : (
          <form onSubmit={handleCreateAccount} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="village">
                Village Name
              </label>
              <input
                id="village"
                type="text"
                value={formData.village}
                onChange={(event) => updateField('village', event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-green-500"
                placeholder="Enter your village"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="district">
                District
              </label>
              <select
                id="district"
                value={formData.district}
                onChange={(event) => updateField('district', event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-base text-slate-900 outline-none focus:border-green-500"
              >
                {districts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 rounded-3xl border border-green-100 bg-green-50 px-4 py-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-green-700">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-green-800">
                  We&apos;ll use this to show nearby opportunities
                </p>
                <p className="mt-1 text-sm leading-6 text-green-700/80">
                  Your location helps match jobs, labour, and services around your village.
                </p>
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-green-600 px-4 py-4 text-base font-semibold text-white shadow-lg shadow-green-100 transition hover:bg-green-700"
            >
              Create Account
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-green-700">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
