import { ArrowLeft } from 'lucide-react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import PageSkeleton from '../components/PageSkeleton.jsx'
import { jobsAPI } from '../lib/api.js'

export default function ApplicationsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: jobRes, isLoading: jobLoading } = useQuery({
    queryKey: ['job', id],
    queryFn: () => jobsAPI.getById(id),
  })
  const { data: appsRes, isLoading: appsLoading } = useQuery({
    queryKey: ['applications', id],
    queryFn: () => jobsAPI.getApplications(id),
  })

  const updateMutation = useMutation({
    mutationFn: ({ appId, status }) => jobsAPI.updateApplication(appId, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['applications', id] }),
  })

  if (jobLoading || appsLoading) return <PageSkeleton variant="list" />

  const job = jobRes?.data
  const applications = appsRes?.data || []

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button type="button" onClick={() => navigate(-1)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <p className="text-sm font-medium text-green-700">Applications</p>
          <h1 className="text-xl font-black text-slate-900">{job?.title}</h1>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center">
          <p className="text-4xl">👥</p>
          <p className="mt-3 text-base font-semibold text-slate-800">No applications yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <div key={app.id} className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-slate-900">{app.labour_name}</p>
                  <p className="text-sm text-slate-500">{app.labour_village}</p>
                  <p className="text-xs text-slate-400">{app.labour_phone}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                  app.status === 'rejected' ? 'bg-red-100 text-red-600' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  {app.status}
                </span>
              </div>

              {app.status === 'pending' && (
                <div className="flex gap-2">
                  <button type="button"
                    onClick={() => updateMutation.mutate({ appId: app.id, status: 'accepted' })}
                    className="flex-1 rounded-xl bg-green-600 py-2 text-sm font-semibold text-white hover:bg-green-700 transition">
                    Accept
                  </button>
                  <button type="button"
                    onClick={() => updateMutation.mutate({ appId: app.id, status: 'rejected' })}
                    className="flex-1 rounded-xl border border-red-200 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition">
                    Reject
                  </button>
                </div>
              )}

              {app.status === 'accepted' && app.labour_phone && (
                <div className="flex gap-2">
                  <a href={`tel:+91${app.labour_phone}`}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-green-200 py-2 text-sm font-semibold text-green-700 hover:bg-green-50 transition">
                    📞 Call
                  </a>
                  <a href={`https://wa.me/91${app.labour_phone}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-green-600 py-2 text-sm font-semibold text-white hover:bg-green-700 transition">
                    💬 WhatsApp
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
