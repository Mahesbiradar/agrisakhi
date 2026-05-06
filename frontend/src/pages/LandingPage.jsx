import { motion, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import LanguageToggle from '../components/LanguageToggle.jsx'

// ── SVG Icons ──────────────────────────────────────────────────────────
const LeafIcon = ({ size = 24, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2-8 2s2-6-7-3z" />
  </svg>
)

const LocationIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
)

const PhoneIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
  </svg>
)

const UserIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
)

const CheckIcon = ({ size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
  </svg>
)

const ChevronDownIcon = () => (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="rgba(255,255,255,0.4)">
    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z" />
  </svg>
)

// ── Animated Counter ────────────────────────────────────────────────────
function Counter({ target, suffix = '+' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 1500
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [inView, target])

  return <span ref={ref}>{count}{suffix}</span>
}

// ── Phone Mockup ─────────────────────────────────────────────────────────
function PhoneMockup({ content }) {
  return (
    <div style={{
      width: 200, height: 360, background: '#111827',
      borderRadius: 28, border: '4px solid #374151',
      overflow: 'hidden', flexShrink: 0, position: 'relative',
    }}>
      <div style={{ height: 20, background: '#1f2937', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 50, height: 4, background: '#374151', borderRadius: 4 }} />
      </div>
      {content}
    </div>
  )
}

const step1Screen = (
  <div style={{ padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 8 }}>
    <div style={{ background: 'linear-gradient(135deg,#166534,#14532d)', borderRadius: 8, padding: '10px 12px' }}>
      <div style={{ color: '#4ade80', fontSize: 9, fontWeight: 700, letterSpacing: 1 }}>AGRISAKHI</div>
      <div style={{ color: '#f0fdf4', fontSize: 12, fontWeight: 700, marginTop: 4 }}>Create Account</div>
    </div>
    {['Full Name', 'Phone Number', 'Password'].map(p => (
      <div key={p} style={{ background: '#1f2937', borderRadius: 6, padding: '7px 10px', border: '1px solid #374151' }}>
        <div style={{ color: '#6b7280', fontSize: 8 }}>{p}</div>
        <div style={{ background: '#374151', height: 4, borderRadius: 2, marginTop: 4 }} />
      </div>
    ))}
    <div style={{ background: '#4ade80', borderRadius: 8, padding: '8px 0', textAlign: 'center', color: '#052e16', fontSize: 10, fontWeight: 700, marginTop: 4 }}>
      Get Started →
    </div>
  </div>
)

const step2Screen = (
  <div style={{ padding: '10px 8px', display: 'flex', flexDirection: 'column', gap: 6 }}>
    <div style={{ color: '#f0fdf4', fontSize: 10, fontWeight: 700, marginBottom: 2 }}>Nearby Jobs</div>
    {[['Harvesting', '5.2 km', '₹500/day'], ['Planting', '8.1 km', '₹450/day'], ['Spraying', '12 km', '₹600/day']].map(([t, d, w]) => (
      <div key={t} style={{ background: '#1f2937', borderRadius: 8, padding: '8px 10px', border: '1px solid #374151' }}>
        <div style={{ color: '#f0fdf4', fontSize: 9, fontWeight: 600 }}>{t}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 3 }}>
          <span style={{ color: '#4ade80', fontSize: 8 }}>📍 {d}</span>
          <span style={{ color: '#86efac', fontSize: 8, fontWeight: 600 }}>{w}</span>
        </div>
      </div>
    ))}
  </div>
)

const step3Screen = (
  <div style={{ padding: '16px 10px', display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center' }}>
    <div style={{ color: '#f0fdf4', fontSize: 10, fontWeight: 700, textAlign: 'center' }}>Contact Farmer</div>
    <div style={{ color: '#86efac', fontSize: 9, textAlign: 'center' }}>Raju Patil · Dharwad</div>
    <div style={{ background: '#166534', borderRadius: 10, padding: '10px 0', width: '100%', textAlign: 'center', color: '#4ade80', fontSize: 9, fontWeight: 700 }}>
      Call Farmer
    </div>
    <div style={{ borderRadius: 10, padding: '10px 0', width: '100%', textAlign: 'center', color: 'white', fontSize: 9, fontWeight: 700, background: '#25D366' }}>
      WhatsApp
    </div>
  </div>
)

const steps = [
  {
    num: '01', icon: <UserIcon size={22} color="#166534" />, iconBg: '#dcfce7',
    title: 'Create Your Profile',
    desc: 'Sign up in 2 minutes. Choose your role — Farmer, Labour, or Service Provider.',
    kn: '2 ನಿಮಿಷದಲ್ಲಿ ನೋಂದಣಿ ಮಾಡಿ',
    screen: step1Screen,
  },
  {
    num: '02', icon: <LocationIcon size={22} color="#d97706" />, iconBg: '#fef3c7',
    title: 'Find Nearby Opportunities',
    desc: 'We use your GPS location to show jobs, workers, and services within your area.',
    kn: 'ಹತ್ತಿರದ ಅವಕಾಶಗಳನ್ನು ಹುಡುಕಿ',
    screen: step2Screen,
  },
  {
    num: '03', icon: <PhoneIcon size={22} color="#2563eb" />, iconBg: '#dbeafe',
    title: 'Connect Directly',
    desc: 'Call or WhatsApp directly — no middlemen, no fees, no delays.',
    kn: 'ನೇರವಾಗಿ ಸಂಪರ್ಕಿಸಿ',
    screen: step3Screen,
  },
]

const roleCards = [
  {
    img: 'https://images.unsplash.com/photo-1589923188651-268a9765e432?w=600&q=80&auto=format',
    role: 'farmer', label: 'Farmer', labelKn: 'ರೈತರು',
    pillBg: '#dcfce7', pillColor: '#166534',
    checkColor: '#16a34a', ctaBg: '#16a34a', ctaHover: '#15803d',
    features: ['Post job requirements', 'Find nearby labourers', 'Discover agri services', 'Manage applications'],
    cta: 'Join as Farmer',
  },
  {
    img: 'https://images.unsplash.com/photo-1599059813005-11265ba4b4ce?w=600&q=80&auto=format',
    role: 'labour', label: 'Labour', labelKn: 'ಕೂಲಿ ಕಾರ್ಮಿಕರು',
    pillBg: '#fef3c7', pillColor: '#b45309',
    checkColor: '#d97706', ctaBg: '#d97706', ctaHover: '#b45309',
    features: ['Browse nearby jobs', 'See wage before applying', 'Contact farmer directly', 'Set daily availability'],
    cta: 'Find Work',
  },
  {
    img: 'https://images.unsplash.com/photo-1592878904946-b3cd8ae243d4?w=600&q=80&auto=format',
    role: 'provider', label: 'Service Provider', labelKn: 'ಸೇವಾ ಪೂರೈಕೆದಾರರು',
    pillBg: '#dbeafe', pillColor: '#1d4ed8',
    checkColor: '#2563eb', ctaBg: '#2563eb', ctaHover: '#1d4ed8',
    features: ['List your services', 'Set coverage area', 'Farmers find you', 'Manage enquiries'],
    cta: 'List Services',
  },
]

const avatars = [
  { bg: '#166534', letter: 'M' }, { bg: '#15803d', letter: 'R' },
  { bg: '#16a34a', letter: 'K' }, { bg: '#22c55e', letter: 'P' },
  { bg: '#4ade80', letter: 'S' },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="min-h-screen w-full overflow-x-hidden">

      {/* ── HERO ── */}
      <section style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% -10%, #166534 0%, #0a1f0e 60%)',
        minHeight: '100vh', width: '100%', position: 'relative', overflow: 'hidden',
      }}>
        {/* Noise texture */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.03, pointerEvents: 'none' }}>
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>

        {/* Grid lines */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: `linear-gradient(rgba(74,222,128,0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(74,222,128,0.05) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }} />

        {/* Nav */}
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/40 backdrop-blur-md' : ''}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LeafIcon size={22} color="#4ade80" />
              <span style={{ color: '#f0fdf4', fontWeight: 700, fontSize: 17 }}>AgriSakhi</span>
              <span style={{
                background: 'rgba(22,101,52,0.6)', border: '1px solid #15803d',
                color: '#4ade80', fontSize: 10, padding: '2px 8px', borderRadius: 100,
              }}>Karnataka</span>
            </div>
            <div className="flex items-center gap-3">
              <LanguageToggle />
              <button onClick={() => navigate('/login')} style={{
                border: '1px solid rgba(255,255,255,0.3)', color: '#f0fdf4',
                padding: '8px 16px', borderRadius: 8, background: 'transparent',
                cursor: 'pointer', fontSize: 14, fontWeight: 500,
              }}
                onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.1)'}
                onMouseLeave={e => e.target.style.background = 'transparent'}>
                Login
              </button>
            </div>
          </div>
        </nav>

        {/* Hero content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[calc(100vh-128px)]">

            {/* Left */}
            <div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <span style={{
                  background: 'linear-gradient(135deg,#166534,#14532d)',
                  border: '1px solid rgba(22,163,74,0.25)', color: '#4ade80',
                  fontSize: 11, letterSpacing: '0.1em',
                  padding: '6px 14px', borderRadius: 100, display: 'inline-block',
                }}>
                  KARNATAKA AGRICULTURE PLATFORM
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                style={{ fontSize: 'clamp(36px,5vw,64px)', fontWeight: 800, lineHeight: 1.1, color: '#f0fdf4', marginTop: 20 }}>
                Connecting<br />
                Karnataka's<br />
                <span style={{ color: '#4ade80' }}>Farmers &amp;</span><br />
                <span style={{ color: '#4ade80' }}>Workers</span>
              </motion.h1>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                <p style={{ fontSize: 18, color: '#86efac', maxWidth: 440, lineHeight: 1.6, marginTop: 20 }}>
                  Post farming jobs, find skilled labour nearby, and discover agricultural services — all in one platform.
                </p>
                <p style={{ color: '#4ade80', fontStyle: 'italic', marginTop: 6, fontSize: 15 }}>
                  ರೈತರ ಮತ್ತು ಕೂಲಿಕಾರರ ಸೇತು
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 32 }}>
                <button onClick={() => navigate('/register')} style={{
                  background: '#4ade80', color: '#052e16', fontWeight: 700,
                  fontSize: 15, padding: '14px 28px', borderRadius: 10, border: 'none',
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { e.target.style.background = '#86efac'; e.target.style.transform = 'translateY(-1px)' }}
                  onMouseLeave={e => { e.target.style.background = '#4ade80'; e.target.style.transform = 'none' }}>
                  Get Started Free
                </button>
                <button onClick={() => navigate('/login')} style={{
                  background: 'transparent', color: '#f0fdf4', fontWeight: 500,
                  padding: '14px 24px', borderRadius: 10,
                  border: '1px solid rgba(255,255,255,0.25)', cursor: 'pointer', fontSize: 15,
                }}
                  onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.08)'}
                  onMouseLeave={e => e.target.style.background = 'transparent'}>
                  Login →
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 32, flexWrap: 'wrap' }}>
                <span style={{ color: '#86efac', fontSize: 13 }}>
                  Trusted by farmers across 10+ districts
                </span>
                <div style={{ display: 'flex' }}>
                  {avatars.map((a, i) => (
                    <div key={a.letter} style={{
                      width: 32, height: 32, borderRadius: '50%', background: a.bg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#f0fdf4', fontSize: 12, fontWeight: 700,
                      marginLeft: i === 0 ? 0 : -8, border: '2px solid #0a1f0e',
                    }}>{a.letter}</div>
                  ))}
                </div>
                <span style={{ color: '#4ade80', fontSize: 13, fontWeight: 600 }}>500+ users</span>
              </motion.div>
            </div>

            {/* Right: image */}
            <div className="hidden lg:block">
              <div style={{ borderRadius: 20, overflow: 'hidden', position: 'relative', boxShadow: '0 40px 80px rgba(0,0,0,0.5)' }}>
                <img
                  src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=700&q=80&auto=format"
                  alt="Karnataka farmland"
                  style={{ width: '100%', height: 440, objectFit: 'cover', display: 'block' }}
                />
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0, height: 200,
                  background: 'linear-gradient(transparent, #0a1f0e)',
                }} />
                <div style={{
                  position: 'absolute', bottom: 20, left: 20, right: 20,
                  background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)',
                  borderRadius: 14, padding: '16px 20px',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 40, height: 40, background: '#166534', borderRadius: 10,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <LocationIcon size={20} color="white" />
                    </div>
                    <div>
                      <p style={{ color: 'white', fontSize: 14, fontWeight: 600, margin: 0 }}>Live location matching</p>
                      <p style={{ color: '#86efac', fontSize: 12, margin: 0 }}>Shows workers within 50km of your farm</p>
                    </div>
                    <div style={{
                      marginLeft: 'auto', background: '#4ade80',
                      borderRadius: 100, padding: '4px 10px',
                      fontSize: 11, fontWeight: 700, color: '#052e16',
                    }}>LIVE</div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                {[['500+', 'Farmers'], ['1200+', 'Workers'], ['50+', 'Services']].map(([n, l]) => (
                  <div key={l} style={{
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                    padding: '10px 16px', borderRadius: 10, flex: 1, textAlign: 'center',
                  }}>
                    <div style={{ color: 'white', fontWeight: 700, fontSize: 20 }}>{n}</div>
                    <div style={{ color: '#86efac', fontSize: 11, marginTop: 2 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
            <ChevronDownIcon />
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="bg-white py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <p className="text-xs font-semibold tracking-widest text-green-600 uppercase">How It Works</p>
            <h2 className="text-4xl font-bold text-gray-900 mt-2">Three steps to connect</h2>
            <p className="text-gray-500 mt-2">Simple enough for first-time smartphone users</p>
          </div>

          <div className="space-y-20">
            {steps.map((s, i) => (
              <motion.div key={s.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}>

                <div className="flex-1 space-y-4">
                  <div style={{ color: '#16a34a', fontSize: 72, fontWeight: 900, lineHeight: 1, opacity: 0.15 }}>
                    {s.num}
                  </div>
                  <div style={{
                    width: 48, height: 48, background: s.iconBg, borderRadius: 12,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {s.icon}
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900">{s.title}</h3>
                  <p className="text-gray-500 leading-relaxed text-base">{s.desc}</p>
                  <p className="text-green-600 text-sm italic">{s.kn}</p>
                </div>

                <div className="flex-1 flex justify-center">
                  <PhoneMockup content={s.screen} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO IS IT FOR ── */}
      <section className="bg-gray-50 py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-gray-900">Built for everyone in agriculture</h2>
            <p className="text-gray-500 mt-3">Whether you grow crops, work fields, or provide services</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {roleCards.map((card, i) => (
              <motion.div key={card.role}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 transition-shadow duration-300 hover:shadow-xl">
                <img src={card.img} alt={card.label}
                  style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }} />
                <div style={{ padding: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ background: card.pillBg, color: card.pillColor, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 100 }}>
                      {card.label.toUpperCase()}
                    </span>
                  </div>
                  <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 14 }}>{card.labelKn}</p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {card.features.map((f) => (
                      <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#374151' }}>
                        <span style={{ color: card.checkColor, flexShrink: 0 }}>
                          <CheckIcon size={16} color={card.checkColor} />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => navigate(`/register?role=${card.role}`)}
                    style={{
                      width: '100%', background: card.ctaBg, color: 'white',
                      border: 'none', borderRadius: 12, padding: '12px 0',
                      fontSize: 14, fontWeight: 600, cursor: 'pointer',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => e.target.style.background = card.ctaHover}
                    onMouseLeave={e => e.target.style.background = card.ctaBg}>
                    {card.cta} →
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-16 px-4" style={{ background: '#111827' }}>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto flex flex-wrap justify-center items-center">
          {[
            { target: 2000, label: 'Registered Users' },
            { target: 500, label: 'Jobs Posted' },
            { target: 50, label: 'Services Listed' },
            { target: 10, label: 'Districts' },
          ].map((s, i) => (
            <div key={s.label} className="flex items-center">
              <div className="text-center px-8 py-4">
                <div style={{ fontSize: 48, fontWeight: 900, color: 'white', lineHeight: 1 }}>
                  <Counter target={s.target} />
                </div>
                <p style={{ color: '#9ca3af', fontSize: 13, marginTop: 6 }}>{s.label}</p>
              </div>
              {i < 3 && <div className="hidden md:block w-px h-12 bg-gray-700" />}
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4 text-center" style={{ background: 'linear-gradient(180deg, #0a1f0e 0%, #052e16 100%)' }}>
        <h2 style={{ color: 'white', fontWeight: 700, fontSize: 40 }}>Start connecting today</h2>
        <p style={{ color: '#4ade80', marginTop: 8, fontSize: 18 }}>ಈಗಲೇ ಪ್ರಾರಂಭಿಸಿ</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap', marginTop: 32 }}>
          <Link to="/register" style={{
            background: '#4ade80', color: '#052e16', fontWeight: 700,
            padding: '16px 32px', borderRadius: 12, fontSize: 16, textDecoration: 'none',
            display: 'inline-block', transition: 'background 0.2s',
          }}
            onMouseEnter={e => e.target.style.background = '#86efac'}
            onMouseLeave={e => e.target.style.background = '#4ade80'}>
            Create Free Account
          </Link>
          <Link to="/login" style={{
            border: '1px solid rgba(255,255,255,0.3)', color: 'white',
            padding: '16px 32px', borderRadius: 12, fontSize: 16,
            textDecoration: 'none', display: 'inline-block',
            transition: 'background 0.2s',
          }}
            onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.08)'}
            onMouseLeave={e => e.target.style.background = 'transparent'}>
            Login →
          </Link>
        </div>
        <p style={{ color: '#166534', fontSize: 14, marginTop: 24 }}>
          Free to use · No subscription · Works on all phones
        </p>
      </section>

      {/* Footer */}
      <footer style={{ background: '#000', padding: '20px 32px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <span style={{ color: '#6b7280', fontSize: 13 }}>© 2026 AgriSakhi · Karnataka</span>
        <span style={{ color: '#6b7280', fontSize: 13 }}>Kisan Helpline: 1800-180-1551</span>
      </footer>
    </div>
  )
}
