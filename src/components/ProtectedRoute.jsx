import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { getDashboardPath } from '../utils/auth.js'
import BottomNav from './BottomNav.jsx'

export default function ProtectedRoute({ children, role }) {
  const { currentUser, isLoggedIn } = useAuth()

  if (!isLoggedIn || !currentUser) {
    return <Navigate to="/login" replace />
  }

  if (role && currentUser.role !== role) {
    return <Navigate to={getDashboardPath(currentUser.role)} replace />
  }

  return (
    <div className="page-container">
      <div className="min-h-screen px-4 pb-24 pt-4">{children}</div>
      <BottomNav />
    </div>
  )
}
