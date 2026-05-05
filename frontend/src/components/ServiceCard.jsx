import { Phone } from 'lucide-react'

const categoryStyles = {
  machinery: 'bg-emerald-100 text-emerald-700',
  chemical: 'bg-lime-100 text-lime-700',
  seeds: 'bg-amber-100 text-amber-700',
  testing: 'bg-sky-100 text-sky-700',
  other: 'bg-slate-100 text-slate-700',
}

function formatPhone(phone) {
  return `+91${phone}`
}

export default function ServiceCard({ service, showDistance = false, compact = false, action }) {
  return (
    <article className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{service.serviceName}</h3>
          <p className="mt-1 text-sm text-slate-500">{service.providerName}</p>
        </div>

        {showDistance ? (
          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
            {service.distanceKm} km
          </span>
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            categoryStyles[service.category] ?? categoryStyles.other
          }`}
        >
          {service.category}
        </span>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
          {service.priceInfo}
        </span>
      </div>

      <p
        className={`mt-3 overflow-hidden text-sm leading-6 text-slate-600 ${
          compact ? '[display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]' : ''
        }`}
      >
        {service.description}
      </p>

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          {service.village}, {service.district}
        </p>

        {action ?? (
          <a
            href={`tel:${formatPhone(service.contactPhone)}`}
            className="inline-flex items-center gap-2 rounded-2xl bg-green-600 px-4 py-3 text-sm font-semibold text-white"
          >
            <Phone className="h-4 w-4" />
            Call
          </a>
        )}
      </div>
    </article>
  )
}
