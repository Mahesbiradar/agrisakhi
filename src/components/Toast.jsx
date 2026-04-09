import { CheckCircle2, CircleAlert } from 'lucide-react'

const toastStyles = {
  success: {
    container: 'bg-emerald-600 text-white',
    icon: CheckCircle2,
  },
  error: {
    container: 'bg-red-600 text-white',
    icon: CircleAlert,
  },
}

export default function Toast({ message, type = 'success', visible }) {
  if (!visible || !message) {
    return null
  }

  const config = toastStyles[type] ?? toastStyles.success
  const Icon = config.icon

  return (
    <div className="fixed inset-x-0 top-4 z-40 mx-auto w-[calc(100%-2rem)] max-w-[398px]">
      <div
        className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold shadow-2xl ${config.container}`}
      >
        <Icon className="h-5 w-5 shrink-0" />
        <span>{message}</span>
      </div>
    </div>
  )
}
