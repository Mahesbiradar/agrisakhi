import { ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { authAPI } from '../lib/api.js'

export default function ForgotPasswordPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [phone, setPhone] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleVerify = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await authAPI.forgotPassword(phone.trim())
      setStep(2)
    } catch (err) {
      setError(err.userMessage || 'Phone number not found. Please register.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = async (e) => {
    e.preventDefault()
    setError('')
    if (newPassword.length < 6) { setError(t('passwordTooShort')); return }
    if (newPassword !== confirmPassword) { setError(t('passwordMismatch')); return }
    setLoading(true)
    try {
      await authAPI.resetPassword(phone.trim(), newPassword)
      setStep(3)
    } catch (err) {
      setError(err.userMessage || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container bg-gradient-to-b from-green-50 via-white to-white">
      <div className="px-5 pb-8 pt-6">
        <button type="button" onClick={() => (step === 1 ? navigate('/login') : setStep(step - 1))}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm">
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div className="mt-8">
          <h1 className="text-3xl font-black text-slate-900">{t('resetPassword')}</h1>
          <p className="mt-2 text-sm text-slate-600">
            {step === 1 && 'Enter your registered phone number to continue.'}
            {step === 2 && 'Set a new password for your account.'}
          </p>
        </div>

        {step === 1 && (
          <form onSubmit={handleVerify} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="fp-phone">
                {t('phone')}
              </label>
              <input id="fp-phone" type="tel" inputMode="numeric" maxLength={10} value={phone}
                onChange={(e) => { setPhone(e.target.value.replace(/\D/g, '').slice(0, 10)); setError('') }}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-green-500"
                placeholder="Enter 10 digit mobile number" required />
            </div>
            {error && <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
            <button type="submit" disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 py-4 text-base font-semibold text-white shadow-lg shadow-green-100 transition hover:bg-green-700 disabled:opacity-60">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {t('verifyPhone')}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleReset} className="mt-8 space-y-5">
            <div className="flex items-center gap-2 rounded-2xl bg-green-50 px-4 py-3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span className="text-sm font-semibold text-green-700">✓ {t('phoneVerified')}</span>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="new-pw">
                {t('newPassword')}
              </label>
              <input id="new-pw" type="password" value={newPassword}
                onChange={(e) => { setNewPassword(e.target.value); setError('') }}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-green-500"
                placeholder="Min 6 characters" required />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="confirm-pw">
                {t('confirmPassword')}
              </label>
              <input id="confirm-pw" type="password" value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setError('') }}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 text-base text-slate-900 outline-none placeholder:text-slate-400 focus:border-green-500"
                placeholder="Repeat your new password" required />
            </div>
            {error && <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
            <button type="submit" disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 py-4 text-base font-semibold text-white shadow-lg shadow-green-100 transition hover:bg-green-700 disabled:opacity-60">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {t('resetPassword')}
            </button>
          </form>
        )}

        {step === 3 && (
          <div className="mt-12 flex flex-col items-center text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-5xl">✓</div>
            <h2 className="mt-6 text-2xl font-black text-slate-900">{t('passwordResetSuccess')}</h2>
            <p className="mt-3 text-sm text-slate-500">You can now login with your new password.</p>
            <button type="button" onClick={() => navigate('/login')}
              className="mt-8 w-full rounded-2xl bg-green-600 px-4 py-4 text-base font-semibold text-white shadow-lg shadow-green-100 transition hover:bg-green-700">
              {t('loginNow')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
