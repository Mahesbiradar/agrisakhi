import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageToggle from '../components/LanguageToggle.jsx'

// ── Assets ─────────────────────────────────────────────────────────────
import heroImg    from '../assets/landing/labour.jpg'
import farmerImg  from '../assets/landing/farmer.jpg'
import labourImg  from '../assets/landing/hero-field.jpg'
import tractorImg from '../assets/landing/tractor.jpg'

// ── Icons (Lucide) ─────────────────────────────────────────────────────
import {
  Leaf, MapPin, Phone, User, Check, ChevronDown, Menu, X,
  ArrowRight, Star, ShieldCheck, Wallet, Languages, MessageCircle,
  Mic, Globe, CheckCircle, XCircle, ChevronUp, Briefcase,
  Users, Search, Handshake, BadgeCheck
} from 'lucide-react'

// ═══════════════════════════════════════════════════════════════════════
// DATA CONSTANTS
// ═══════════════════════════════════════════════════════════════════════

const heroStats = [
  { value: '10,000+', label: 'Farmers',    icon: User },
  { value: '5,000+',  label: 'Labourers',  icon: Users },
  { value: '31',      label: 'Districts',  icon: MapPin },
  { value: '100%',    label: 'Free',       icon: BadgeCheck },
]

const featureBadges = [
  { text: 'Free Platform',       icon: BadgeCheck },
  { text: 'Location Based',      icon: MapPin },
  { text: 'Direct Contact',      icon: Phone },
  { text: 'No Middlemen',        icon: Handshake },
  { text: 'Kannada Support',     icon: Languages },
]

const steps = [
  {
    icon: User, iconBg: 'bg-green-100 text-green-700',
    title: 'Create Your Profile',
    desc: 'Sign up in 2 minutes. Choose your role — Farmer, Labour, or Service Provider.',
    kannada: '2 ನಿಮಿಷದಲ್ಲಿ ನೋಂದಣಿ ಮಾಡಿ',
  },
  {
    icon: Search, iconBg: 'bg-amber-100 text-amber-700',
    title: 'Discover Nearby Opportunities',
    desc: 'GPS-based matching shows jobs, workers, and services within your area.',
    kannada: 'ಹತ್ತಿರದ ಅವಕಾಶಗಳನ್ನು ಹುಡುಕಿ',
  },
  {
    icon: Phone, iconBg: 'bg-blue-100 text-blue-700',
    title: 'Connect Directly',
    desc: 'Call or WhatsApp directly — no middlemen, no fees, no delays.',
    kannada: 'ನೇರವಾಗಿ ಸಂಪರ್ಕಿಸಿ',
  },
]

const roleCards = [
  {
    img: farmerImg, imgPosition: 'center center', role: 'farmer',
    label: 'Farmer', labelKn: 'ರೈತರು', count: '10,000+',
    benefit: 'Find workers within minutes',
    pillColor: 'text-green-700 bg-green-100',
    ctaColor: 'bg-green-600 hover:bg-green-700',
    features: ['Post job requirements','Find nearby labourers','Discover agri services','Manage applications'],
    cta: 'Join as Farmer',
  },
  {
    img: labourImg, imgPosition: 'center 60%', role: 'labour',
    label: 'Labour', labelKn: 'ಕೂಲಿ ಕಾರ್ಮಿಕರು', count: '5,000+',
    benefit: 'Discover jobs near your village',
    pillColor: 'text-amber-700 bg-amber-100',
    ctaColor: 'bg-amber-600 hover:bg-amber-700',
    features: ['Browse nearby jobs','See wage before applying','Contact farmer directly','Set daily availability'],
    cta: 'Find Work',
  },
  {
    img: tractorImg, imgPosition: 'center center', role: 'provider',
    label: 'Service Provider', labelKn: 'ಸೇವಾ ಪೂರೈಕೆದಾರರು', count: '500+',
    benefit: 'Reach farmers across Karnataka',
    pillColor: 'text-blue-700 bg-blue-100',
    ctaColor: 'bg-blue-600 hover:bg-blue-700',
    features: ['List your services','Set coverage area','Farmers find you','Manage enquiries'],
    cta: 'List Services',
  },
]

const whyChooseFeatures = [
  {
    icon: MapPin, title: 'Location-Based Matching',
    desc: 'Find opportunities within your village or district using GPS.',
    color: 'text-green-600 bg-green-50',
  },
  {
    icon: MessageCircle, title: 'Direct Communication',
    desc: 'Call or WhatsApp instantly. No agents or delays.',
    color: 'text-blue-600 bg-blue-50',
  },
  {
    icon: Wallet, title: 'No Commission',
    desc: '100% free platform. Zero hidden charges forever.',
    color: 'text-amber-600 bg-amber-50',
  },
  {
    icon: Languages, title: 'Kannada Support',
    desc: 'Full regional language support designed for Karnataka users.',
    color: 'text-purple-600 bg-purple-50',
  },
]

const comparisonData = [
  { feature: 'Finding labour',  agrisakhi: 'Instant & nearby',      traditional: 'Word of mouth' },
  { feature: 'Finding jobs',      agrisakhi: 'GPS matched alerts',     traditional: 'Travel to find' },
  { feature: 'Middlemen',         agrisakhi: 'None — direct contact', traditional: 'Multiple layers' },
  { feature: 'Cost',              agrisakhi: '100% Free',             traditional: 'Commission fees' },
  { feature: 'Speed',             agrisakhi: 'Real-time',             traditional: 'Days to weeks' },
  { feature: 'Transparency',      agrisakhi: 'Wage & location visible', traditional: 'Hidden details' },
]

const testimonials = [
  {
    name: 'Ramesh Gowda', role: 'Farmer', district: 'Mandya District',
    avatar: 'RG', avatarColor: 'bg-green-600',
    text: 'I found 5 workers for my paddy field within 2 hours. No agent, no commission. This platform is a blessing for small farmers like me.',
    rating: 5,
  },
  {
    name: 'Lakshmi Devi', role: 'Farm Labourer', district: 'Hassan District',
    avatar: 'LD', avatarColor: 'bg-amber-600',
    text: 'I get job alerts on WhatsApp every morning. I know the wage before I go. I have found work 3 days a week consistently.',
    rating: 5,
  },
  {
    name: 'Krishna Rao', role: 'Service Provider', district: 'Mysuru District',
    avatar: 'KR', avatarColor: 'bg-blue-600',
    text: 'My tractor rental bookings doubled after listing on AgriSakhi. Farmers from 3 nearby villages now contact me directly.',
    rating: 5,
  },
]

const faqs = [
  {
    question: 'How do I register on AgriSakhi?',
    answer: 'Sign up with your phone number, choose your role (Farmer, Labour, or Service Provider), and create your profile in under 2 minutes. No documents required.',
  },
  {
    question: 'Is AgriSakhi completely free?',
    answer: 'Yes. AgriSakhi is 100% free to use. There are no hidden charges, subscription fees, or commissions. We believe in empowering Karnataka farming communities.',
  },
  {
    question: 'Can I contact workers or farmers directly?',
    answer: 'Absolutely. Once you find a match, you get direct phone and WhatsApp contact details. There are no middlemen or agents involved.',
  },
  {
    question: 'Is Kannada language supported?',
    answer: 'Yes. The entire platform is available in both English and Kannada. You can switch languages anytime from the top navigation.',
  },
  {
    question: 'How does location matching work?',
    answer: 'We use your phone GPS to show nearby jobs, workers, and services within your area. You can also manually set your preferred work radius.',
  },
]

const trustBadges = [
  { icon: MapPin,       label: 'GPS Matching',     desc: 'Precise location' },
  { icon: MessageCircle, label: 'WhatsApp Contact', desc: 'Instant chat' },
  { icon: Mic,          label: 'Voice Jobs',       desc: 'Speak to post' },
  { icon: Globe,        label: 'Multi-language',   desc: 'English & Kannada' },
  { icon: ShieldCheck,  label: 'Secure Platform',  desc: 'Verified users' },
]

const navLinks = [
  { label: 'Features',      href: '#why-choose' },
  { label: 'How It Works',  href: '#how-it-works' },
  { label: 'Roles',         href: '#roles' },
  { label: 'Contact',       href: '#footer' },
]

// ═══════════════════════════════════════════════════════════════════════
// ANIMATION VARIANTS
// ═══════════════════════════════════════════════════════════════════════

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

// ═══════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════

function Navbar({ scrolled }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  const handleNavClick = (href) => {
    setMobileOpen(false)
    const id = href.replace('#', '')
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/50 backdrop-blur-lg border-b border-white/10' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 rounded-lg">
            <div className="w-9 h-9 rounded-lg bg-green-500/20 border border-green-400/30 flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
              <Leaf className="w-5 h-5 text-green-400" aria-hidden="true" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-white tracking-tight">AgriSakhi</span>
              <span className="hidden sm:inline-flex text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-green-900/60 border border-green-700/50 text-green-400">
                Karnataka
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-sm font-medium text-white/80 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 rounded px-1"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <LanguageToggle />
            </div>
            <button
              onClick={() => navigate('/login')}
              className="hidden sm:inline-flex items-center px-4 py-2 rounded-lg border border-white/30 text-white text-sm font-medium hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
            >
              Login
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-black/90 backdrop-blur-xl border-b border-white/10 overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="block w-full text-left text-base font-medium text-white/90 hover:text-green-400 py-2 transition-colors"
                >
                  {link.label}
                </button>
              ))}
              <div className="pt-4 border-t border-white/10 flex flex-col gap-3 sm:hidden">
                <LanguageToggle />
                <button
                  onClick={() => { setMobileOpen(false); navigate('/login') }}
                  className="w-full py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors"
                >
                  Login
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

function FloatingCard({ icon: Icon, label, value, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay }}
      className={`absolute bg-black/70 backdrop-blur-xl border border-white/15 rounded-xl px-4 py-3 shadow-2xl flex items-center gap-3 ${className}`}
    >
      <div className="w-9 h-9 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-green-400" aria-hidden="true" />
      </div>
      <div>
        <p className="text-xs text-white/60 font-medium">{label}</p>
        <p className="text-sm font-bold text-white">{value}</p>
      </div>
    </motion.div>
  )
}

function StatCard({ stat }) {
  return (
    <motion.div
      variants={fadeInUp}
      className="flex-1 min-w-[130px] bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 transition-colors duration-300"
    >
      <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-white/10 flex items-center justify-center">
        <stat.icon className="w-5 h-5 text-green-400" aria-hidden="true" />
      </div>
      <p className="text-xl font-bold text-white">{stat.value}</p>
      <p className="text-xs text-green-200/80 mt-0.5">{stat.label}</p>
    </motion.div>
  )
}

function FAQItem({ faq }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-inset"
        aria-expanded={open}
      >
        <span className="text-sm sm:text-base font-semibold text-slate-800 pr-4">{faq.question}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0">
          <ChevronUp className="w-5 h-5 text-slate-400" />
        </motion.div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════

export default function LandingPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white scroll-smooth">
      {/* ─── HERO ─── */}
      <section
        id="hero"
        className="relative min-h-[100dvh] w-full overflow-hidden bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,#166534_0%,#0a1f0e_60%)]"
      >
        {/* Texture overlays */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay">
          <svg width="100%" height="100%">
            <filter id="noiseHero"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" /></filter>
            <rect width="100%" height="100%" filter="url(#noiseHero)" />
          </svg>
        </div>
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: `linear-gradient(rgba(74,222,128,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(74,222,128,0.06) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        <Navbar scrolled={scrolled} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 lg:pt-40 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[calc(100dvh-160px)]">
            {/* Left */}
            <div className="max-w-xl">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-900/50 border border-green-700/40 text-green-400 text-[11px] font-bold tracking-widest uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Karnataka Agriculture Platform
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mt-6 text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-white leading-[1.1] tracking-tight"
              >
                Find Farm Workers,
                <br />
                <span className="text-green-400">Agricultural Jobs,</span>
                <br />
                and Farming Services{' '}
                <span className="text-green-400">Near You</span>
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-6 space-y-2"
              >
                <p className="text-base sm:text-lg text-green-100/80 leading-relaxed max-w-md">
                  Post farming jobs, find skilled labour nearby, and discover agricultural services — all in one platform.
                </p>
                <p className="text-sm sm:text-base text-green-400/90 italic">
                  ನಿಮ್ಮ ಹತ್ತಿರದಲ್ಲಿ ಕೃಷಿ ಕಾರ್ಮಿಕರು, ಕೃಷಿ ಉದ್ಯೋಗಗಳು ಮತ್ತು ಕೃಷಿ ಸೇವೆಗಳನ್ನು ಹುಡುಕಿ
                </p>
              </motion.div>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-8 flex flex-col sm:flex-row gap-3"
              >
                <button
                  onClick={() => navigate('/register')}
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-green-500 text-green-950 font-bold text-base hover:bg-green-400 hover:-translate-y-0.5 transition-all duration-200 shadow-lg shadow-green-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a1f0e]"
                >
                  Create Free Account
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl border border-white/25 text-white font-semibold text-base hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                >
                  Explore Opportunities
                </button>
              </motion.div>

              {/* Feature Badges */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-8 flex flex-wrap gap-2"
              >
                {featureBadges.map((badge) => (
                  <span
                    key={badge.text}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-green-200 text-xs font-medium"
                  >
                    <badge.icon className="w-3.5 h-3.5 text-green-400" aria-hidden="true" />
                    {badge.text}
                  </span>
                ))}
              </motion.div>

              {/* Stats */}
              <motion.div
                variants={staggerContainer} initial="hidden" animate="visible"
                transition={{ delay: 0.5 }}
                className="mt-8 flex flex-wrap gap-3"
              >
                {heroStats.map((stat) => (
                  <StatCard key={stat.label} stat={stat} />
                ))}
              </motion.div>
            </div>

            {/* Right: Hero Image + Floating Cards */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:block relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10">
                <img
                  src={heroImg}
                  alt="Karnataka farmland with workers in green fields"
                  loading="eager"
                  decoding="async"
                  className="w-full h-[480px] object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1f0e] via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a1f0e]/30 to-transparent" />

                <FloatingCard icon={Briefcase} label="Active Jobs" value="1,240+" delay={0.6} className="top-8 right-8" />
                <FloatingCard icon={Users} label="Nearby Workers" value="850+" delay={0.8} className="bottom-24 left-8" />

                <div className="absolute bottom-8 right-8">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1 }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500 text-green-950 text-xs font-bold"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-950 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-950" />
                    </span>
                    LIVE
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden lg:block">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
            <ChevronDown className="w-6 h-6 text-white/40" aria-hidden="true" />
          </motion.div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how-it-works" className="py-20 lg:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <p className="text-xs font-bold tracking-widest text-green-600 uppercase">How It Works</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900">Three steps to connect</h2>
            <p className="mt-2 text-slate-500 text-base sm:text-lg">Simple enough for first-time smartphone users</p>
          </motion.div>

          <div className="relative grid md:grid-cols-3 gap-8 lg:gap-12">
            {/* Connector line */}
            <div className="hidden md:block absolute top-12 left-[16.67%] right-[16.67%] h-0.5 bg-gradient-to-r from-green-200 via-amber-200 to-blue-200" />

            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative"
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`relative z-10 w-14 h-14 rounded-2xl ${step.iconBg} flex items-center justify-center shadow-lg mb-6`}>
                    <step.icon className="w-6 h-6" aria-hidden="true" />
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center border-2 border-white">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed max-w-xs">{step.desc}</p>
                  <p className="mt-2 text-xs text-green-600 font-medium italic">{step.kannada}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHY CHOOSE AGRISAKHI ─── */}
      <section id="why-choose" className="py-20 lg:py-28 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <p className="text-xs font-bold tracking-widest text-green-600 uppercase">Why Choose Us</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900">Built for Karnataka's farmers</h2>
            <p className="mt-2 text-slate-500 text-base sm:text-lg">Designed with trust, simplicity, and rural needs in mind</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseFeatures.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6" aria-hidden="true" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ROLE CARDS ─── */}
      <section id="roles" className="py-20 lg:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Built for everyone in agriculture</h2>
            <p className="mt-3 text-slate-500 text-base sm:text-lg">Whether you grow crops, work fields, or provide services</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {roleCards.map((card, i) => (
              <motion.div
                key={card.role}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={card.img}
                    alt={`${card.label} working in Karnataka`}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ objectPosition: card.imgPosition }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${card.pillColor}`}>
                      {card.label.toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white font-bold text-lg leading-tight">{card.benefit}</p>
                    <p className="text-white/80 text-xs mt-1">{card.labelKn}</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-4 h-4 text-slate-400" aria-hidden="true" />
                    <span className="text-xs font-semibold text-slate-500">{card.count} active users</span>
                  </div>
                  <ul className="space-y-2.5 mb-6">
                    {card.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => navigate(`/register?role=${card.role}`)}
                    className={`w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl text-white font-semibold text-sm ${card.ctaColor} transition-all duration-200 hover:-translate-y-0.5 shadow-md hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white`}
                  >
                    {card.cta}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" aria-hidden="true" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PLATFORM BENEFITS (Comparison) ─── */}
      <section className="py-20 lg:py-28 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <p className="text-xs font-bold tracking-widest text-green-600 uppercase">Platform Benefits</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900">AgriSakhi vs Traditional</h2>
            <p className="mt-2 text-slate-500 text-base">See why thousands are switching</p>
          </motion.div>

          {/* Desktop Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
          >
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Feature</th>
                  <th className="px-6 py-4 text-xs font-bold text-green-700 uppercase tracking-wider">AgriSakhi</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Traditional Method</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {comparisonData.map((row) => (
                  <tr key={row.feature} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{row.feature}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700">
                        <CheckCircle className="w-4 h-4 text-green-500" aria-hidden="true" />
                        {row.agrisakhi}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 text-sm text-slate-500">
                        <XCircle className="w-4 h-4 text-slate-300" aria-hidden="true" />
                        {row.traditional}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {comparisonData.map((row, i) => (
              <motion.div
                key={row.feature}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.3, delay: i * 0.05 }}
                className="bg-white rounded-xl p-4 shadow-sm border border-slate-200"
              >
                <p className="text-sm font-semibold text-slate-900 mb-3">{row.feature}</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-green-700 font-medium">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" aria-hidden="true" />
                    <span>AgriSakhi: {row.agrisakhi}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <XCircle className="w-4 h-4 text-slate-300 flex-shrink-0" aria-hidden="true" />
                    <span>Traditional: {row.traditional}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <p className="text-xs font-bold tracking-widest text-green-600 uppercase">Testimonials</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900">Loved by the community</h2>
            <p className="mt-2 text-slate-500 text-base">Real stories from real users across Karnataka</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-11 h-11 rounded-full ${t.avatarColor} flex items-center justify-center text-white font-bold text-sm`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role} · {t.district}</p>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, ri) => (
                    <Star key={ri} className="w-4 h-4 text-amber-400 fill-amber-400" aria-hidden="true" />
                  ))}
                </div>
                <p className="text-sm text-slate-600 leading-relaxed italic">"{t.text}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-20 lg:py-28 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <p className="text-xs font-bold tracking-widest text-green-600 uppercase">FAQ</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900">Common questions</h2>
            <p className="mt-2 text-slate-500 text-base">Everything you need to know before getting started</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="space-y-3"
          >
            {faqs.map((faq, i) => (
              <FAQItem key={i} faq={faq} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── TRUST BAND ─── */}
      <section className="py-12 lg:py-16 bg-green-50 border-y border-green-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer} initial="hidden" whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="flex flex-wrap justify-center gap-4 lg:gap-6"
          >
            {trustBadges.map((badge) => (
              <motion.div
                key={badge.label}
                variants={fadeInUp}
                whileHover={{ y: -3 }}
                className="flex items-center gap-3 bg-white rounded-xl px-5 py-3 shadow-sm border border-green-100 hover:shadow-md transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                  <badge.icon className="w-5 h-5 text-green-600" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{badge.label}</p>
                  <p className="text-xs text-slate-500">{badge.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── CTA SECTION ─── */}
      <section className="relative py-24 lg:py-32 bg-gradient-to-b from-[#0a1f0e] to-[#052e16] overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500 rounded-full blur-[128px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-[128px]" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              Ready to Grow Your{' '}
              <span className="text-green-400">Farming Network?</span>
            </h2>
            <p className="mt-4 text-lg text-green-100/80 max-w-2xl mx-auto">
              Join thousands of farmers, workers, and service providers across Karnataka.
            </p>
            <p className="mt-2 text-green-400/90 italic">ಕರ್ನಾಟಕದಾದ್ಯಂತ ಸೇರಿ</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-green-500 text-green-950 font-bold text-base hover:bg-green-400 hover:-translate-y-0.5 transition-all duration-200 shadow-lg shadow-green-500/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#052e16]"
            >
              Create Account
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/30 text-white font-semibold text-base hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            >
              Login
            </button>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer id="footer" className="bg-slate-950 text-slate-400 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 mb-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-green-400" aria-hidden="true" />
                </div>
                <span className="text-lg font-bold text-white">AgriSakhi</span>
              </div>
              <p className="text-sm leading-relaxed mb-4">
                Connecting Karnataka's farming community with technology that respects rural simplicity.
              </p>
              <div className="flex gap-3">
                {['twitter', 'facebook', 'instagram'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-slate-800 hover:border-slate-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                    aria-label={`Follow us on ${social}`}
                  >
                    <Globe className="w-4 h-4" aria-hidden="true" />
                  </a>
                ))}
              </div>
            </div>

            {/* Platform */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Platform</h4>
              <ul className="space-y-2.5">
                {['Features', 'How It Works', 'Roles', 'Testimonials'].map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => {
                        const map = { 'Features': 'why-choose', 'How It Works': 'how-it-works', 'Roles': 'roles', 'Testimonials': '' }
                        const id = map[item]
                        if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
                      }}
                      className="text-sm hover:text-green-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Support</h4>
              <ul className="space-y-2.5">
                <li>
                  <a href="tel:18001801551" className="text-sm hover:text-green-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded">
                    Kisan Helpline: 1800-180-1551
                  </a>
                </li>
                <li>
                  <button onClick={() => navigate('/login')} className="text-sm hover:text-green-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded">
                    Login to Account
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('/register')} className="text-sm hover:text-green-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded">
                    Create Account
                  </button>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Legal</h4>
              <ul className="space-y-2.5">
                <li><Link to="/privacy" className="text-sm hover:text-green-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-sm hover:text-green-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded">Terms of Service</Link></li>
                <li><Link to="/contact" className="text-sm hover:text-green-400 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 rounded">Contact Us</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-500">© 2026 AgriSakhi. Built for Karnataka's farming communities.</p>
            <p className="text-xs text-slate-500">Available in English and ಕನ್ನಡ</p>
          </div>
        </div>
      </footer>
    </div>
  )
}