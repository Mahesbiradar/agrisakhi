import { lazy, Suspense } from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import PageSkeleton from './components/PageSkeleton.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

const AddServicePage = lazy(() => import('./pages/AddServicePage.jsx'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.jsx'))
const ApplicationsPage = lazy(() => import('./pages/ApplicationsPage.jsx'))
const FarmerDashboard = lazy(() => import('./pages/FarmerDashboard.jsx'))
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage.jsx'))
const JobDetailPage = lazy(() => import('./pages/JobDetailPage.jsx'))
const JobListPage = lazy(() => import('./pages/JobListPage.jsx'))
const LabourDashboard = lazy(() => import('./pages/LabourDashboard.jsx'))
const LandingPage = lazy(() => import('./pages/LandingPage.jsx'))
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'))
const PostJobPage = lazy(() => import('./pages/PostJobPage.jsx'))
const ProfilePage = lazy(() => import('./pages/ProfilePage.jsx'))
const ProviderDashboard = lazy(() => import('./pages/ProviderDashboard.jsx'))
const RegisterPage = lazy(() => import('./pages/RegisterPage.jsx'))

function App() {
  return (
    <HashRouter>
      <Suspense fallback={<PageSkeleton />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          <Route
            path="/farmer"
            element={
              <ProtectedRoute role="farmer">
                <FarmerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer/post-job"
            element={
              <ProtectedRoute role="farmer">
                <PostJobPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer/jobs"
            element={
              <ProtectedRoute role="farmer">
                <JobListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/farmer/jobs/:id/applications"
            element={
              <ProtectedRoute role="farmer">
                <ApplicationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/labour"
            element={
              <ProtectedRoute role="labour">
                <LabourDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/provider"
            element={
              <ProtectedRoute role="provider">
                <ProviderDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/provider/add-service"
            element={
              <ProtectedRoute role="provider">
                <AddServicePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs/:id"
            element={
              <ProtectedRoute>
                <JobDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </HashRouter>
  )
}

export default App
