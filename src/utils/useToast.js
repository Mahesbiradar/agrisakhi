import { useEffect, useState } from 'react'
import Toast from '../components/Toast.jsx'

export function useToast() {
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    type: 'success',
  })

  useEffect(() => {
    if (!toast.visible) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      setToast((current) => ({
        ...current,
        visible: false,
      }))
    }, 3000)

    return () => window.clearTimeout(timeoutId)
  }, [toast.visible])

  const showToast = (message, type = 'success') => {
    setToast({
      visible: true,
      message,
      type,
    })
  }

  const ToastComponent = () => (
    <Toast message={toast.message} type={toast.type} visible={toast.visible} />
  )

  return { showToast, ToastComponent }
}
