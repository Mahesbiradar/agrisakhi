import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Loader2, Users, Briefcase, Wrench, BarChart3, ChevronDown } from 'lucide-react'
import { adminAPI } from '../lib/api.js'

const TABS = ['Overview', 'Users', 'Jobs', 'Services']

const roleBadge = (role) => {
  const map = {
    farmer: 'bg-green-100 text-green-700',
    labour: 'bg-amber-100 text-amber-700',
    provider: 'bg-blue-100 text-blue-700',
    admin: 'bg-purple-100 text-purple-700',
  }
  return map[role] || 'bg-slate-100 text-slate-600'
}

function StatCard({ label, value, color }) {
  return (
    <div className={`rounded-2xl p-4 ${color}`}>
      <p className="text-sm font-medium opacity-80">{label}</p>
      <p className="mt-2 text-3xl font-black">{value ?? '—'}</p>
    </div>
  )
}

function OverviewTab() {
  const { data, isLoading } = useQuery({ queryKey: ['admin-stats'], queryFn: () => adminAPI.getStats() })
  const s = data?.data

  if (isLoading) return <div className="grid grid-cols-2 gap-3 mt-4">{[...Array(4)].map((_, i) => <div key={i} className="h-24 rounded-2xl bg-gray-200 animate-pulse" />)}</div>

  return (
    <div className="mt-4 space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Total Farmers" value={s?.farmers} color="bg-green-50 text-green-900" />
        <StatCard label="Total Labour" value={s?.labours} color="bg-amber-50 text-amber-900" />
        <StatCard label="Open Jobs" value={s?.open_jobs} color="bg-blue-50 text-blue-900" />
        <StatCard label="Total Services" value={s?.total_services} color="bg-purple-50 text-purple-900" />
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2 text-sm">
        <div className="flex justify-between"><span className="text-slate-500">Total Users</span><span className="font-semibold">{s?.total_users}</span></div>
        <div className="flex justify-between"><span className="text-slate-500">Total Jobs</span><span className="font-semibold">{s?.total_jobs}</span></div>
        <div className="flex justify-between"><span className="text-slate-500">Total Applications</span><span className="font-semibold">{s?.total_applications}</span></div>
        <div className="flex justify-between"><span className="text-slate-500">Pending Applications</span><span className="font-semibold">{s?.pending_applications}</span></div>
      </div>
    </div>
  )
}

function UsersTab() {
  const qc = useQueryClient()
  const [roleFilter, setRoleFilter] = useState('')
  const [search, setSearch] = useState('')
  const [resetInputs, setResetInputs] = useState({})

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', roleFilter, search],
    queryFn: () => adminAPI.getUsers({ role: roleFilter || undefined, search: search || undefined }),
  })

  const toggleMutation = useMutation({
    mutationFn: (userId) => adminAPI.toggleUser(userId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  })

  const resetMutation = useMutation({
    mutationFn: ({ user_id, new_password }) => adminAPI.resetUserPassword(user_id, new_password),
    onSuccess: (_, vars) => {
      setResetInputs((p) => ({ ...p, [vars.user_id]: '' }))
      qc.invalidateQueries({ queryKey: ['admin-users'] })
    },
  })

  const users = data?.data || []

  return (
    <div className="mt-4 space-y-3">
      <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-green-500"
        placeholder="Search by name or phone..." />
      <div className="flex gap-2 text-xs">
        {['', 'farmer', 'labour', 'provider'].map((r) => (
          <button key={r} type="button" onClick={() => setRoleFilter(r)}
            className={`rounded-full px-3 py-1 font-medium border transition ${roleFilter === r ? 'bg-green-600 text-white border-green-600' : 'bg-white text-slate-600 border-slate-200'}`}>
            {r || 'All'}
          </button>
        ))}
      </div>
      {isLoading && <div className="space-y-2">{[...Array(3)].map((_, i) => <div key={i} className="h-16 rounded-2xl bg-gray-200 animate-pulse" />)}</div>}
      {users.map((u) => (
        <div key={u.id} className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-semibold text-slate-900">{u.name}</p>
              <p className="text-xs text-slate-500">{u.phone} · {u.village}, {u.district}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${roleBadge(u.role)}`}>{u.role}</span>
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${u.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                {u.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => toggleMutation.mutate(u.id)}
              className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${u.is_active ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}>
              {u.is_active ? 'Deactivate' : 'Activate'}
            </button>
          </div>
          <div className="flex gap-2">
            <input type="password" value={resetInputs[u.id] || ''}
              onChange={(e) => setResetInputs((p) => ({ ...p, [u.id]: e.target.value }))}
              className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs outline-none focus:border-green-500"
              placeholder="New password (min 6 chars)" />
            <button type="button"
              disabled={!resetInputs[u.id] || resetInputs[u.id].length < 6 || resetMutation.isPending}
              onClick={() => resetMutation.mutate({ user_id: u.id, new_password: resetInputs[u.id] })}
              className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 disabled:opacity-40">
              Reset
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

function JobsTab() {
  const qc = useQueryClient()
  const [statusFilter, setStatusFilter] = useState('')
  const { data, isLoading } = useQuery({
    queryKey: ['admin-jobs', statusFilter],
    queryFn: () => adminAPI.getJobs({ status: statusFilter || undefined }),
  })
  const closeMutation = useMutation({
    mutationFn: (jobId) => adminAPI.closeJob(jobId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-jobs'] }),
  })
  const jobs = data?.data || []

  return (
    <div className="mt-4 space-y-3">
      <div className="flex gap-2 text-xs">
        {['', 'open', 'closed'].map((s) => (
          <button key={s} type="button" onClick={() => setStatusFilter(s)}
            className={`rounded-full px-3 py-1 font-medium border transition ${statusFilter === s ? 'bg-green-600 text-white border-green-600' : 'bg-white text-slate-600 border-slate-200'}`}>
            {s || 'All'}
          </button>
        ))}
      </div>
      {isLoading && <div className="space-y-2">{[...Array(3)].map((_, i) => <div key={i} className="h-16 rounded-2xl bg-gray-200 animate-pulse" />)}</div>}
      {jobs.map((job) => (
        <div key={job.id} className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-semibold text-slate-900">{job.title}</p>
              <p className="text-xs text-slate-500">{job.farmer_name} · {job.village}, {job.district}</p>
            </div>
            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${job.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
              {job.status}
            </span>
          </div>
          <p className="text-xs text-slate-500">₹{job.wage_per_day}/day · {job.duration_days} days · {job.workers_needed} workers</p>
          {job.status === 'open' && (
            <button type="button" onClick={() => closeMutation.mutate(job.id)}
              className="rounded-xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 transition">
              Close Job
            </button>
          )}
        </div>
      ))}
    </div>
  )
}

function ServicesTab() {
  const { data, isLoading } = useQuery({ queryKey: ['admin-services'], queryFn: () => adminAPI.getServices() })
  const services = data?.data || []

  return (
    <div className="mt-4 space-y-3">
      {isLoading && <div className="space-y-2">{[...Array(3)].map((_, i) => <div key={i} className="h-16 rounded-2xl bg-gray-200 animate-pulse" />)}</div>}
      {services.map((svc) => (
        <div key={svc.id} className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-semibold text-slate-900">{svc.service_name}</p>
              <p className="text-xs text-slate-500">{svc.provider_name} · {svc.village}, {svc.district}</p>
              <p className="text-xs text-slate-400 mt-1">{svc.category} · {svc.price_info}</p>
            </div>
            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${svc.is_available ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
              {svc.is_available ? 'Available' : 'Unavailable'}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <div className="space-y-4 px-4 pt-6 pb-10">
      <div>
        <p className="text-sm font-medium text-purple-700">Admin Panel</p>
        <h1 className="text-2xl font-black text-slate-900">AgriSakhi Dashboard</h1>
      </div>

      <div className="flex gap-1 rounded-2xl bg-slate-100 p-1">
        {TABS.map((tab, i) => (
          <button key={tab} type="button" onClick={() => setActiveTab(i)}
            className={`flex-1 rounded-xl py-2 text-xs font-semibold transition ${activeTab === i ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 0 && <OverviewTab />}
      {activeTab === 1 && <UsersTab />}
      {activeTab === 2 && <JobsTab />}
      {activeTab === 3 && <ServicesTab />}
    </div>
  )
}
