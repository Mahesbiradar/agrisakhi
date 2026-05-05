import { Navigate } from 'react-router-dom'
import useAuthStore from '../store/authStore.js'
import { getDashboardPath } from '../utils/auth.js'
import AppLayout from './AppLayout.jsx'
import BottomNav from './BottomNav.jsx'

export default function ProtectedRoute({ children, role }) {
  const { isLoggedIn, user } = useAuthStore()

  if (!isLoggedIn || !user) {
    return <Navigate to="/login" replace />
  }

  if (role && user.role !== role) {
    return <Navigate to={getDashboardPath(user.role)} replace />
  }

  if (user.role === 'admin') {
    return (
      <AppLayout>
        <div className="min-h-screen px-4 pb-6 pt-4">{children}</div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="min-h-screen px-4 pb-24 pt-4">
        {children}
        <BottomNav />
      </div>
    </AppLayout>
  )
}
