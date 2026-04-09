import { X } from 'lucide-react'

export default function BottomSheet({ isOpen, onClose, title, children }) {
  return (
    <div
      className={`fixed inset-0 z-40 transition-opacity duration-300 ${
        isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <button
        type="button"
        aria-label="Close sheet"
        onClick={onClose}
        className="absolute inset-0 h-full w-full bg-slate-950/35"
      />

      <div
        className={`absolute bottom-0 left-1/2 w-full max-w-[430px] -translate-x-1/2 rounded-t-[32px] bg-white px-5 pb-8 pt-5 shadow-2xl transition-transform duration-300 ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="mx-auto h-1.5 w-14 rounded-full bg-slate-200" />

        <div className="mt-5 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6">{children}</div>
      </div>
    </div>
  )
}
