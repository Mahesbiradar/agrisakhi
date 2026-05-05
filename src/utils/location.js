const toRadians = (value) => (value * Math.PI) / 180

export function getDistanceKm(lat1, lng1, lat2, lng2) {
  return haversineKm(lat1, lng1, lat2, lng2)
}

export function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = toRadians(lat2 - lat1)
  const dLng = toRadians(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function getNearby(items, userLat, userLng, radiusKm = 50) {
  return items
    .map((item) => ({
      ...item,
      distanceKm: Number(haversineKm(userLat, userLng, item.lat, item.lng).toFixed(1)),
    }))
    .filter((item) => item.distanceKm <= radiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm)
}

export async function detectLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('location_failed'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude: lat, longitude: lng } = coords
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=en`,
          )
          const data = await res.json()
          const addr = data.address || {}
          resolve({
            lat,
            lng,
            village: addr.village || addr.suburb || addr.town || addr.hamlet || '',
            district: addr.county || addr.state_district || '',
          })
        } catch {
          reject(new Error('location_failed'))
        }
      },
      () => reject(new Error('location_failed')),
    )
  })
}
