export function getRoleColor(role) {
  const roleColors = {
    farmer: {
      bg: 'bg-green-600',
      light: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
    },
    labour: {
      bg: 'bg-amber-500',
      light: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-200',
    },
    provider: {
      bg: 'bg-blue-600',
      light: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
    },
  }

  return roleColors[role] ?? roleColors.farmer
}

export function getWorkTypeBadge(workType) {
  const workTypeColors = {
    harvesting: 'bg-green-100 text-green-700',
    planting: 'bg-teal-100 text-teal-700',
    irrigation: 'bg-blue-100 text-blue-700',
    spraying: 'bg-purple-100 text-purple-700',
    other: 'bg-gray-100 text-gray-700',
  }

  return workTypeColors[workType] ?? workTypeColors.other
}
