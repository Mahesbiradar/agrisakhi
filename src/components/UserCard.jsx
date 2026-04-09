import { MessageCircle, Phone } from 'lucide-react'
import { getRoleColor } from '../utils/roleColors.js'

function formatPhone(phone) {
  return `+91${phone}`
}

export default function UserCard({ user, distanceKm }) {
  const roleColor = getRoleColor(user.role)

  return (
    <article className="min-w-[260px] snap-start rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold ${roleColor.light} ${roleColor.text}`}
          >
            {user.avatar}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{user.name}</h3>
            <p className="text-sm text-slate-500">
              {user.village}, {user.district}
            </p>
          </div>
        </div>
        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
          {distanceKm} km away
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <a
          href={`tel:${formatPhone(user.phone)}`}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-3 py-3 text-sm font-semibold text-white"
        >
          <Phone className="h-4 w-4" />
          Call
        </a>
        <a
          href={`https://wa.me/91${user.phone}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-600 px-3 py-3 text-sm font-semibold text-white"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </a>
      </div>
    </article>
  )
}
