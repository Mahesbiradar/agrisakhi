import { BriefcaseBusiness, CirclePlus, Home, User } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import useAuthStore from '../store/authStore.js'
import { getRoleColor } from '../utils/roleColors.js'
import LanguageToggle from './LanguageToggle.jsx'

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
  return `flex min-h-[44px] flex-col items-center justify-center gap-1 rounded-2xl px-3 text-[11px] font-medium transition ${
    isActive ? 'bg-slate-100 text-slate-900' : 'text-slate-500'
  }`
}

export default function BottomNav() {
  const currentUser = useAuthStore((s) => s.user)
  const navConfig = roleConfig[currentUser?.role] ?? roleConfig.farmer
  const roleColor = getRoleColor(currentUser?.role)

  return (
    <nav className="relative fixed bottom-0 left-1/2 z-20 flex w-full max-w-[430px] -translate-x-1/2 items-center justify-between border-t border-slate-200 bg-white px-4 py-3">
      <div className="absolute -top-8 right-4">
        <LanguageToggle />
      </div>

      <NavLink
        to={navConfig.home}
        className={({ isActive }) => `${navLinkClass({ isActive })} ${isActive ? roleColor.text : ''}`}
      >
        <Home className="h-5 w-5" />
        <span>Home</span>
      </NavLink>

      <NavLink
        to={navConfig.jobs}
        className={({ isActive }) => `${navLinkClass({ isActive })} ${isActive ? roleColor.text : ''}`}
      >
        <BriefcaseBusiness className="h-5 w-5" />
        <span>Jobs</span>
      </NavLink>

      <NavLink
        to={navConfig.action}
        className={({ isActive }) => `${navLinkClass({ isActive })} ${isActive ? roleColor.text : ''}`}
      >
        <CirclePlus className="h-5 w-5" />
        <span>{navConfig.actionLabel}</span>
      </NavLink>

      <NavLink
        to="/profile"
        className={({ isActive }) => `${navLinkClass({ isActive })} ${isActive ? roleColor.text : ''}`}
      >
        <User className="h-5 w-5" />
        <span>Profile</span>
      </NavLink>
    </nav>
  )
}
