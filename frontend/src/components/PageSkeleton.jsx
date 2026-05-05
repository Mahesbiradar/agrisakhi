export default function PageSkeleton({ variant = 'dashboard' }) {
  if (variant === 'profile') {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="rounded-[28px] border border-slate-200 bg-white px-5 py-6 shadow-sm">
          <div className="mx-auto h-24 w-24 rounded-full bg-gray-200" />
          <div className="mx-auto mt-4 h-7 w-40 rounded-full bg-gray-200" />
          <div className="mx-auto mt-3 h-9 w-24 rounded-full bg-gray-200" />
          <div className="mx-auto mt-4 h-10 w-48 rounded-full bg-gray-200" />
        </div>
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="h-6 w-32 rounded-full bg-gray-200" />
          <div className="mt-5 space-y-4">
            <div className="h-16 rounded-2xl bg-gray-200" />
            <div className="h-16 rounded-2xl bg-gray-200" />
            <div className="h-16 rounded-2xl bg-gray-200" />
          </div>
        </div>
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="h-6 w-28 rounded-full bg-gray-200" />
          <div className="mt-5 h-20 rounded-2xl bg-gray-200" />
        </div>
      </div>
    )
  }

  if (variant === 'list') {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-28 rounded-[28px] bg-gray-200" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-24 rounded-[24px] bg-gray-200" />
          <div className="h-24 rounded-[24px] bg-gray-200" />
        </div>
        <div className="h-14 rounded-2xl bg-gray-200" />
        <div className="space-y-3">
          <div className="h-40 rounded-[24px] bg-gray-200" />
          <div className="h-40 rounded-[24px] bg-gray-200" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-36 rounded-[28px] bg-gray-200" />
      <div className="grid grid-cols-2 gap-3">
        <div className="h-28 rounded-[24px] bg-gray-200" />
        <div className="h-28 rounded-[24px] bg-gray-200" />
      </div>
      <div className="space-y-3">
        <div className="h-36 rounded-[24px] bg-gray-200" />
        <div className="h-36 rounded-[24px] bg-gray-200" />
      </div>
    </div>
  )
}
