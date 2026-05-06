import { useQuery } from '@tanstack/react-query'
import { adminAPI } from '../lib/api.js'
import LanguageToggle from './LanguageToggle.jsx'

export default function AppLayout({ children }) {
  const { data } = useQuery({
    queryKey: ['platform-stats'],
    queryFn: adminAPI.getStats,
    staleTime: 5 * 60 * 1000,
    retry: false,
  })
  const stats = data?.data

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-0 py-0 md:px-4 md:py-6 flex gap-6 justify-center">

        <div className="w-full sm:max-w-[520px] md:max-w-[480px] bg-white sm:rounded-2xl sm:shadow-lg min-h-screen sm:min-h-0 relative">
          <div className="absolute top-3 right-3 z-40">
            <LanguageToggle />
          </div>
          {children}
        </div>

        <div className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-6 space-y-4">

            <div className="bg-white rounded-2xl shadow p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-xl">🌾</div>
                <div>
                  <h3 className="font-semibold text-gray-800">AgriSakhi</h3>
                  <p className="text-xs text-gray-500">Karnataka Agriculture Platform</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Connecting farmers, labourers and service providers across Karnataka.
              </p>
            </div>

            <div className="bg-green-50 rounded-2xl shadow p-5">
              <h4 className="font-medium text-green-800 mb-3 text-sm">Platform Stats</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Active Jobs</span>
                  <span className="font-medium text-green-700">{stats?.open_jobs ?? '—'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Registered Farmers</span>
                  <span className="font-medium text-green-700">{stats?.farmers ?? '—'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Available Labour</span>
                  <span className="font-medium text-green-700">{stats?.labours ?? '—'}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow p-5">
              <h4 className="font-medium text-gray-800 mb-2 text-sm">Need Help?</h4>
              <p className="text-xs text-gray-500 mb-3">
                For support, contact your nearest agriculture extension officer.
              </p>
              <a href="tel:18001801551" className="text-green-700 text-sm font-medium">
                📞 Kisan Call Center: 1800-180-1551
              </a>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}
