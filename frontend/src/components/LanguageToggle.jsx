import { useTranslation } from 'react-i18next'

export default function LanguageToggle() {
  const { i18n } = useTranslation()
  const isEn = i18n.language === 'en'

  const switchTo = (lang) => {
    i18n.changeLanguage(lang)
    localStorage.setItem('agrisakhi_lang', lang)
  }

  return (
    <button
      type="button"
      className="flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1 text-sm shadow-sm"
      aria-label="Toggle language"
    >
      <span
        onClick={() => switchTo('en')}
        className={isEn ? 'font-bold text-green-700' : 'text-gray-400'}
      >
        EN
      </span>
      <span className="text-gray-300">|</span>
      <span
        onClick={() => switchTo('kn')}
        className={!isEn ? 'font-bold text-green-700' : 'text-gray-400'}
      >
        ಕನ್ನಡ
      </span>
    </button>
  )
}
