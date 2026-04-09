import { Leaf, Tractor } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

const kannadaTagline = '\u0CB0\u0CC8\u0CA4\u0CB0 \u0CAE\u0CA4\u0CCD\u0CA4\u0CC1 \u0C95\u0CC2\u0CB2\u0CBF\u0C95\u0CBE\u0CB0\u0CB0 \u0CB8\u0CC7\u0CA4\u0CC1'
const farmerEmoji = '\u{1F468}\u200D\u{1F33E}'
const labourEmoji = '\u{1F477}'
const providerEmoji = '\u{1F69C}'
const sproutEmoji = '\u{1F33E}'

const roleCards = [
  {
    label: 'Farmer',
    emoji: farmerEmoji,
    role: 'farmer',
    accent: 'from-green-500 to-emerald-600',
  },
  {
    label: 'Labour',
    emoji: labourEmoji,
    role: 'labour',
    accent: 'from-lime-500 to-green-600',
  },
  {
    label: 'Service Provider',
    emoji: providerEmoji,
    role: 'provider',
    accent: 'from-emerald-500 to-teal-600',
  },
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="page-container overflow-hidden bg-white">
      <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-green-50 to-white" />
      <div className="relative flex min-h-screen flex-col px-5 pb-8 pt-7">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-600 text-white shadow-lg shadow-green-100">
            <Leaf className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">AgriSakhi</h1>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-green-700">
              Karnataka Rural Network
            </p>
          </div>
        </div>

        <div className="mt-10">
          <p className="text-3xl font-black leading-tight text-slate-900">{kannadaTagline}</p>
          <p className="mt-3 max-w-xs text-sm leading-6 text-slate-600">
            Connecting Farmers, Labour &amp; Services
          </p>
        </div>

        <div className="mt-8 overflow-hidden rounded-[28px] bg-gradient-to-br from-green-500 via-emerald-500 to-lime-400 p-6 text-white shadow-xl shadow-green-100">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-green-50">
                Farm to Field Support
              </p>
              <h2 className="mt-3 text-2xl font-black leading-tight">
                Grow faster with people and services nearby
              </h2>
              <p className="mt-3 text-sm leading-6 text-emerald-50">
                Discover jobs, hire workers, and find agricultural services in one simple mobile-first app.
              </p>
            </div>
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-3xl bg-white/20 backdrop-blur">
              <Tractor className="h-8 w-8" />
            </div>
          </div>
          <div className="mt-6 rounded-3xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-medium text-white/90">
            {sproutEmoji} Built for local farming communities across Karnataka
          </div>
        </div>

        <div className="mt-8">
          <p className="text-sm font-semibold text-slate-700">Choose your role to get started</p>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {roleCards.map((card) => (
              <button
                key={card.role}
                type="button"
                onClick={() => navigate(`/register?role=${card.role}`)}
                className={`rounded-3xl bg-gradient-to-br ${card.accent} px-3 py-5 text-left text-white shadow-lg shadow-green-100 transition-transform duration-200 active:scale-95`}
              >
                <div className="text-2xl">{card.emoji}</div>
                <div className="mt-4 text-sm font-semibold leading-5">{card.label}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-10">
          <p className="text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-green-700">
              Login
            </Link>
          </p>
          <p className="mt-6 text-center text-xs font-medium tracking-wide text-slate-400">
            Available in Kannada &amp; English
          </p>
        </div>
      </div>
    </div>
  )
}
