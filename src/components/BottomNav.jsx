import { BriefcaseBusiness, CirclePlus, Home, User } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const roleConfig = {
  farmer: {
    home: '/farmer',
    jobs: '/farmer/jobs',
    action: '/farmer/post-job',
    actionLabel: 'Post Job',
  },
  labour: {
    home: '/labour',
    jobs: '/labour',
    action: '/labour',
    actionLabel: 'Find Work',
  },
  provider: {
    home: '/provider',
    jobs: '/provider',
    action: '/provider/add-service',
    actionLabel: 'Add Service',
  },
}

function navLinkClass({ isActive }) {
  return `flex flex-col items-center gap-1 text-[11px] font-medium ${
    isActive ? 'text-green-700' : 'text-slate-500'
  }`
}

export default function BottomNav() {
  const { currentUser } = useAuth()
  const navConfig = roleConfig[currentUser?.role] ?? roleConfig.farmer

  return (
    <nav className="fixed bottom-0 left-1/2 z-20 flex w-full max-w-[430px] -translate-x-1/2 items-center justify-between border-t border-slate-200 bg-white px-4 py-3">
      <NavLink to={navConfig.home} className={navLinkClass}>
        <Home className="h-5 w-5" />
        <span>Home</span>
      </NavLink>

      <NavLink to={navConfig.jobs} className={navLinkClass}>
        <BriefcaseBusiness className="h-5 w-5" />
        <span>Jobs</span>
      </NavLink>

      <NavLink to={navConfig.action} className={navLinkClass}>
        <CirclePlus className="h-5 w-5" />
        <span>{navConfig.actionLabel}</span>
      </NavLink>

      <NavLink to="/profile" className={navLinkClass}>
        <User className="h-5 w-5" />
        <span>Profile</span>
      </NavLink>
    </nav>
  )
}
