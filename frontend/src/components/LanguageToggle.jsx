import { useTranslation } from 'react-i18next'

export default function LanguageToggle() {
  const { i18n } = useTranslation()
  const current = i18n.language

  const toggle = (lang) => {
    i18n.changeLanguage(lang)
    localStorage.setItem('agrisakhi_lang', lang)
  }

  return (
    <div className="flex items-center rounded-full border border-gray-200 bg-white px-1 py-1 shadow-sm gap-1">
      <button
        type="button"
        onClick={() => toggle('en')}
        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
          current === 'en' ? 'bg-green-600 text-white' : 'text-gray-500 hover:text-green-700'
        }`}>
        EN
      </button>
      <button
        type="button"
        onClick={() => toggle('kn')}
        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
          current === 'kn' ? 'bg-green-600 text-white' : 'text-gray-500 hover:text-green-700'
        }`}>
        ಕನ್ನಡ
      </button>
    </div>
  )
}
