import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import LanguageToggle from './components/LanguageToggle.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import AddServicePage from './pages/AddServicePage.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx'
import JobDetailPage from './pages/JobDetailPage.jsx'
import FarmerDashboard from './pages/FarmerDashboard.jsx'
import JobListPage from './pages/JobListPage.jsx'
import LabourDashboard from './pages/LabourDashboard.jsx'
import LandingPage from './pages/LandingPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import PostJobPage from './pages/PostJobPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import ProviderDashboard from './pages/ProviderDashboard.jsx'
import RegisterPage from './pages/RegisterPage.jsx'

function App() {
  return (
    <HashRouter>
      <div className="fixed top-3 right-3 z-50">
        <LanguageToggle />
      </div>
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
    </HashRouter>
  )
}

export default App
