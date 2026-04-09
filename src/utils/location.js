const toRadians = (value) => (value * Math.PI) / 180

export function getDistanceKm(lat1, lng1, lat2, lng2) {
  const earthRadiusKm = 6371
  const dLat = toRadians(lat2 - lat1)
  const dLng = toRadians(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return earthRadiusKm * c
}

export function getNearby(items, userLat, userLng, radiusKm = 50) {
  return items
    .map((item) => {
      const distanceKm = getDistanceKm(userLat, userLng, item.lat, item.lng)

      return {
        ...item,
        distanceKm: Number(distanceKm.toFixed(1)),
      }
    })
    .filter((item) => item.distanceKm <= radiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm)
}
