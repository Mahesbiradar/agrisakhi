import { useEffect, useState } from 'react'

export function useDelayedLoading(delay = 500) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setLoading(false)
    }, delay)

    return () => window.clearTimeout(timeoutId)
  }, [delay])

  return loading
}
