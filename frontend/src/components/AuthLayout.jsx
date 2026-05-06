const features = [
  { icon: '📍', text: 'Location-based matching' },
  { icon: '🎙️', text: 'Voice job descriptions' },
  { icon: '💬', text: 'Direct WhatsApp connect' },
  { icon: '🌐', text: 'English & ಕನ್ನಡ support' },
]

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen w-full flex">
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12"
        style={{ background: 'linear-gradient(135deg, #1a4731 0%, #2d6a4f 50%, #52b788 100%)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-2xl">🌿</div>
          <div>
            <p className="text-white font-bold text-lg">AgriSakhi</p>
            <p className="text-green-200 text-xs tracking-widest">KARNATAKA RURAL NETWORK</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-8">
          <div className="text-center">
            <div className="text-8xl mb-4">🌾</div>
            <h2 className="text-white text-3xl font-bold leading-tight">
              "Connecting farmers<br />with the right hands<br />at the right time"
            </h2>
            <p className="text-green-200 mt-4 text-lg">ರೈತರ ಮತ್ತು ಕೂಲಿಕಾರರ ಸೇತು</p>
          </div>

          <div className="flex flex-col gap-3 w-full max-w-xs">
            {features.map((f) => (
              <div key={f.text} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3">
                <span className="text-xl">{f.icon}</span>
                <span className="text-white text-sm">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-green-300 text-xs">Free to use · Works on all phones · No subscription</p>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 p-6 min-h-screen">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  )
}
