export const roleDashboardMap = {
  farmer: '/farmer',
  labour: '/labour',
  provider: '/provider',
}

export function getDashboardPath(role) {
  return roleDashboardMap[role] ?? '/login'
}
