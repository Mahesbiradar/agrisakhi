export default function SkeletonCard({ lines = 3, showAvatar = false }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm animate-pulse">
      {showAvatar && (
        <div className="mb-3 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gray-200" />
          <div className="h-4 w-32 rounded-full bg-gray-200" />
        </div>
      )}
      <div className="space-y-2">
        {[...Array(lines)].map((_, i) => (
          <div
            key={i}
            className="h-3 rounded-full bg-gray-200"
            style={{ width: i === 0 ? '75%' : i === lines - 1 ? '50%' : '100%' }}
          />
        ))}
      </div>
    </div>
  )
}
