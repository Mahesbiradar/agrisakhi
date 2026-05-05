import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AudioRecorder } from '../utils/audio.js'
import { uploadAudio } from '../utils/cloudinary.js'

export default function AudioRecorderComponent({ onAudioReady, existingUrl }) {
  const { t } = useTranslation()
  const [state, setState] = useState(existingUrl ? 'done' : 'idle')
  const [url, setUrl] = useState(existingUrl || '')
  const [error, setError] = useState('')
  const [seconds, setSeconds] = useState(0)
  const recorderRef = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => () => clearInterval(timerRef.current), [])

  const handleTap = async () => {
    if (state === 'idle') {
      setState('requesting')
      try {
        recorderRef.current = new AudioRecorder()
        await recorderRef.current.start()
        setState('recording')
        setSeconds(0)
        timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000)
      } catch {
        setState('error')
        setError('Microphone access denied.')
      }
    } else if (state === 'recording') {
      clearInterval(timerRef.current)
      setState('uploading')
      try {
        const blob = await recorderRef.current.stop()
        const audioUrl = await uploadAudio(blob)
        setUrl(audioUrl)
        setState('done')
        onAudioReady(audioUrl)
      } catch {
        setState('error')
        setError('Upload failed. Try again.')
      }
    }
  }

  const pad = (n) => String(n).padStart(2, '0')
  const duration = `${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}`

  if (state === 'done') {
    return (
      <div className="space-y-2">
        <audio controls src={url} className="w-full" />
        <button
          type="button"
          onClick={() => { setState('idle'); setUrl(''); onAudioReady('') }}
          className="text-sm text-green-700 underline"
        >
          {t('reRecord')}
        </button>
      </div>
    )
  }

  if (state === 'uploading') {
    return (
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-green-500 border-t-transparent" />
        {t('uploading')}
      </div>
    )
  }

  if (state === 'error') {
    return (
      <div className="space-y-2">
        <p className="text-sm text-red-600">{error}</p>
        <button type="button" onClick={() => setState('idle')} className="text-sm text-green-700 underline">
          {t('retry')}
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={handleTap}
        disabled={state === 'requesting'}
        className={`flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition ${
          state === 'recording'
            ? 'animate-pulse bg-red-500'
            : 'bg-green-600 hover:bg-green-700'
        }`}
        aria-label={state === 'recording' ? t('stopRecording') : t('tapToRecord')}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
          <path d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm-1 17.93V21h-2v2h6v-2h-2v-2.07A8 8 0 0 0 20 11h-2a6 6 0 0 1-12 0H4a8 8 0 0 0 7 7.93z" />
        </svg>
      </button>
      <p className="text-sm text-slate-500">
        {state === 'recording' ? `${t('stopRecording')} ${duration}` : t('tapToRecord')}
      </p>
    </div>
  )
}
