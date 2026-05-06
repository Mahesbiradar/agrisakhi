import { CirclePlus, Loader2, MapPin, Sparkles, Wrench } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import PageSkeleton from '../components/PageSkeleton.jsx'
import BottomSheet from '../components/BottomSheet.jsx'
import useAuthStore from '../store/authStore.js'
import { servicesAPI } from '../lib/api.js'
import { useToast } from '../utils/useToast.js'

const waveEmoji = '\u{1F44B}'
const tractorEmoji = '\u{1F69C}'
const CATEGORY_OPTIONS = ['machinery', 'chemical', 'seeds', 'testing', 'other']
const COVERAGE_OPTIONS = [10, 25, 50, 100]

export default function ProviderDashboard() {
  const { t } = useTranslation()
  const user = useAuthStore((s) => s.user)
  const queryClient = useQueryClient()
  const { showToast, ToastComponent } = useToast()

  const [editingService, setEditingService] = useState(null)
  const [editData, setEditData] = useState({})
  const [deletingService, setDeletingService] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['my-services'],
    queryFn: servicesAPI.myServices,
    enabled: !!user,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => servicesAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-services'] })
      setEditingService(null)
      showToast('Service updated')
    },
  })

  const toggleMutation = useMutation({
    mutationFn: ({ id, is_available }) => servicesAPI.update(id, { is_available }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-services'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => servicesAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-services'] })
      setDeletingService(null)
      showToast('Service deleted')
    },
  })

  if (isLoading) return <PageSkeleton variant="list" />

  const myServices = data?.data || []

  const openEdit = (service) => {
    setEditingService(service)
    setEditData({
      service_name: service.service_name,
      category: service.category,
      description: service.description || '',
      price_info: service.price_info,
      coverage_km: service.coverage_km || 50,
      is_available: service.is_available,
    })
  }

  return (
    <div className="space-y-6 pb-24">
      <section className="overflow-hidden rounded-[28px] bg-gradient-to-br from-sky-600 via-blue-600 to-cyan-500 px-5 py-6 text-white shadow-xl shadow-sky-100">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-sky-50">{t('providerDashboard')}</p>
            <h1 className="mt-2 text-2xl font-black leading-tight">{t('namaskara')}, {user?.name} {waveEmoji}</h1>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white/15 backdrop-blur">
            <Wrench className="h-7 w-7" />
          </div>
        </div>
        <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3 py-2 text-sm font-medium text-white/90">
          <MapPin className="h-4 w-4" />
          <span>{user?.village}, {user?.district}</span>
        </div>
      </section>

      {myServices.length === 0 && (
        <div className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4">
          <p className="text-sm font-semibold text-amber-800">⚡ Add your first service so farmers can find you!</p>
          <Link to="/provider/add-service" className="ml-3 shrink-0 rounded-xl bg-amber-400 px-3 py-2 text-xs font-semibold text-slate-900">
            Add Now →
          </Link>
        </div>
      )}

      <section className="grid grid-cols-2 gap-3">
        <article className="rounded-[24px] border border-sky-100 bg-sky-50 p-4">
          <p className="text-sm font-medium text-sky-700">{t('activeServices')}</p>
          <p className="mt-3 text-3xl font-black text-slate-900">{myServices.filter((s) => s.is_available).length}</p>
        </article>
        <article className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total Listed</p>
          <p className="mt-3 text-lg font-bold text-slate-900">{myServices.length}</p>
        </article>
      </section>

      <section>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-700" />
          <h2 className="text-lg font-bold text-slate-900">{t('myServices')}</h2>
        </div>

        {myServices.length > 0 ? (
          <div className="mt-4 space-y-3">
            {myServices.map((service) => (
              <div key={service.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
                <div className="flex items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 truncate">{service.service_name}</p>
                    <span className="mt-1 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 capitalize">
                      {service.category}
                    </span>
                  </div>
                </div>

                {service.description && (
                  <p className="text-sm text-slate-500 line-clamp-2">{service.description}</p>
                )}

                <div className="flex items-center gap-3 text-sm">
                  <span className="font-semibold text-green-700">₹ {service.price_info}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-500">📍 {service.coverage_km || 50} km radius</span>
                </div>

                <div className="flex gap-2">
                  <button type="button" onClick={() => openEdit(service)}
                    className="rounded-xl border border-blue-200 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50 transition">
                    Edit
                  </button>
                  <button type="button" onClick={() => setDeletingService(service)}
                    className="rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition">
                    Delete
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${service.is_available ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <span className={`text-xs font-medium ${service.is_available ? 'text-green-600' : 'text-gray-500'}`}>
                      {service.is_available ? 'Available Now' : 'Unavailable'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleMutation.mutate({ id: service.id, is_available: !service.is_available })}
                    className={`relative inline-flex items-center w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none flex-shrink-0 ${service.is_available ? 'bg-green-500' : 'bg-gray-300'}`}>
                    <span className={`inline-block w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ${service.is_available ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-[28px] border border-dashed border-blue-200 bg-blue-50 p-5 text-center">
            <p className="text-5xl">{tractorEmoji}</p>
            <p className="mt-3 text-lg font-semibold text-slate-900">{t('noServicesFound')}</p>
            <Link to="/provider/add-service"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-4 text-base font-semibold text-white shadow-lg shadow-blue-100">
              <CirclePlus className="h-5 w-5" />
              {t('addService')}
            </Link>
          </div>
        )}
      </section>

      <div className="pointer-events-none fixed inset-x-0 bottom-24 z-20 mx-auto flex w-full max-w-[430px] justify-end px-4">
        <Link to="/provider/add-service"
          className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-2xl shadow-green-100">
          <CirclePlus className="h-5 w-5" />
          {t('addService')}
        </Link>
      </div>

      <BottomSheet isOpen={!!editingService} onClose={() => setEditingService(null)} title="Edit Service">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Service Name</label>
            <input type="text" value={editData.service_name || ''}
              onChange={(e) => setEditData((d) => ({ ...d, service_name: e.target.value }))}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Category</label>
            <select value={editData.category || ''} onChange={(e) => setEditData((d) => ({ ...d, category: e.target.value }))}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500">
              {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Description</label>
            <textarea value={editData.description || ''} rows={3}
              onChange={(e) => setEditData((d) => ({ ...d, description: e.target.value }))}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 resize-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Price</label>
            <input type="text" value={editData.price_info || ''}
              onChange={(e) => setEditData((d) => ({ ...d, price_info: e.target.value }))}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Coverage Area</label>
            <div className="flex gap-2">
              {COVERAGE_OPTIONS.map((km) => (
                <button key={km} type="button" onClick={() => setEditData((d) => ({ ...d, coverage_km: km }))}
                  className={`flex-1 rounded-2xl border py-2 text-sm font-semibold transition ${editData.coverage_km === km ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600'}`}>
                  {km} km
                </button>
              ))}
            </div>
          </div>
          <button type="button" disabled={updateMutation.isPending}
            onClick={() => updateMutation.mutate({ id: editingService.id, data: editData })}
            className="w-full rounded-2xl bg-blue-600 py-3 text-sm font-semibold text-white disabled:opacity-60 flex items-center justify-center gap-2">
            {updateMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Save Changes
          </button>
        </div>
      </BottomSheet>

      <BottomSheet isOpen={!!deletingService} onClose={() => setDeletingService(null)} title="Delete Service?">
        <p className="text-sm text-slate-600 mb-2">This will permanently delete:</p>
        <p className="font-semibold text-red-600 mb-4">{deletingService?.service_name}</p>
        <div className="flex gap-3">
          <button type="button" onClick={() => setDeletingService(null)}
            className="flex-1 rounded-2xl border border-slate-200 py-3 text-sm font-semibold text-slate-700">
            Cancel
          </button>
          <button type="button" disabled={deleteMutation.isPending}
            onClick={() => deleteMutation.mutate(deletingService.id)}
            className="flex-1 rounded-2xl bg-red-600 py-3 text-sm font-semibold text-white disabled:opacity-60 flex items-center justify-center gap-2">
            {deleteMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Yes, Delete
          </button>
        </div>
      </BottomSheet>

      <ToastComponent />
    </div>
  )
}
