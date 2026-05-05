export const roleDashboardMap = {
  farmer: '/farmer',
  labour: '/labour',
  provider: '/provider',
  admin: '/admin',
}

export function getDashboardPath(role) {
  return roleDashboardMap[role] ?? '/login'
}
