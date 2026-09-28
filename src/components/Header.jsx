import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, MessageCircle, Mail, Menu, X } from 'lucide-react'
import { FacebookIcon, YoutubeIcon, InstagramIcon } from './SocialIcons'
import { useLanguage } from '../lib/LanguageContext'
import { getWebsiteSettings } from '../services/neurotherapyService'

const NAV_LINKS = (t) => [
  { to: '/', label: t.nav.home },
  { to: '/about', label: t.nav.about },
  { to: '/neurotherapy', label: t.nav.neurotherapy },
  { to: '/services', label: t.nav.services },
  { to: '/benefits', label: t.nav.benefits },
  { to: '/testimonials', label: t.nav.testimonials },
  { to: '/gallery', label: t.nav.gallery },
  { to: '/videos', label: t.nav.videos },
  { to: '/faqs', label: t.nav.faqs },
  { to: '/contact', label: t.nav.contact },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [settings, setSettings] = useState({})
  const { lang, switchLang, t } = useLanguage()
  const location = useLocation()

  useEffect(() => {
    getWebsiteSettings().then(setSettings).catch(() => {})
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  const phone = settings.phone || '+91 88711 93506'
  const whatsapp = settings.whatsapp || '+91 88711 93506'
  const email = settings.email || 'info@doctorsir.in'
  const whatsappLink = `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`

  return (
    <header className="sticky top-0 z-50 w-full overflow-x-hidden" style={{ fontFamily: "'Inter','Noto Sans Devanagari',sans-serif" }}>

      {/* TOP INFO BAR */}
      <div className="bg-[#0a2240] text-white hidden md:block">
        <div className="max-w-7xl mx-auto px-5 h-9 flex items-center justify-between">
          <div className="flex items-center gap-5 text-[11.5px]">
            <a href={`tel:${phone}`} className="flex items-center gap-1.5 text-gray-200 hover:text-white transition-colors">
              <Phone size={11} strokeWidth={2.5} />
              <span className="font-medium">{phone}</span>
            </a>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-gray-200 hover:text-[#25D366] transition-colors">
              <MessageCircle size={11} strokeWidth={2.5} />
              <span>{t.common.whatsapp}</span>
            </a>
            <a href={`mailto:${email}`} className="flex items-center gap-1.5 text-gray-200 hover:text-white transition-colors">
              <Mail size={11} strokeWidth={2.5} />
              <span>{email}</span>
            </a>
          </div>
          <div className="flex items-center gap-4 text-[11.5px]">
            <div className="flex items-center gap-2 text-gray-300">
              <span className="font-semibold text-white">{t.common.homeVisitOnly}</span>
              <span className="text-white/30">|</span>
              <span className="font-semibold text-white">{t.common.appointmentBased}</span>
              {settings.appointment_hours && (
                <>
                  <span className="text-white/30">|</span>
                  <span>{settings.appointment_hours}</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2 ml-1">
              {settings.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer"
                  className="w-6 h-6 bg-white/10 hover:bg-[#1877F2] rounded flex items-center justify-center transition-colors">
                  <FacebookIcon size={12} />
                </a>
              )}
              {settings.youtube_url && (
                <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer"
                  className="w-6 h-6 bg-white/10 hover:bg-[#FF0000] rounded flex items-center justify-center transition-colors">
                  <YoutubeIcon size={12} />
                </a>
              )}
              {settings.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer"
                  className="w-6 h-6 bg-white/10 hover:bg-[#E1306C] rounded flex items-center justify-center transition-colors">
                  <InstagramIcon size={12} />
                </a>
              )}
              <div className="flex items-center gap-0.5 ml-1 bg-white/10 rounded px-2 py-0.5 text-[11px]">
                <button onClick={() => switchLang('hi')} className={`px-1 transition-colors ${lang === 'hi' ? 'text-white font-bold' : 'text-gray-400 hover:text-white'}`}>
                  {'\u0939\u093f\u0902\u0926\u0940'}
                </button>
                <span className="text-white/30">|</span>
                <button onClick={() => switchLang('en')} className={`px-1 transition-colors ${lang === 'en' ? 'text-white font-bold' : 'text-gray-400 hover:text-white'}`}>EN</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN NAV */}
      <nav className={`bg-white transition-shadow duration-200 overflow-x-hidden ${scrolled ? 'shadow-md' : 'shadow-sm border-b border-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-[62px]">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0 min-w-0">
              <img src={settings.logo_url || '/logo.png'} alt={settings.site_name || 'Neurotherapy'} className="h-10 w-auto flex-shrink-0" />
              <div className="leading-tight min-w-0">
                <div className="text-[#063B63] font-bold text-[14px] leading-tight truncate max-w-[160px] sm:max-w-none" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  {settings.site_name || 'Neurotherapy'}
                </div>
                <div className="text-[#159A8C] text-[10px] font-medium tracking-wide">Natural Care for a Better Life</div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-0">
              {NAV_LINKS(t).map(({ to, label }) => (
                <NavLink key={to} to={to} end={to === '/'}
                  className={({ isActive }) =>
                    `relative px-2.5 py-1.5 text-[13px] font-medium transition-colors whitespace-nowrap group ${isActive ? 'text-[#0877B8]' : 'text-[#1a2e44] hover:text-[#0877B8]'}`
                  }>
                  {({ isActive }) => (
                    <>
                      {label}
                      <span className={`absolute bottom-0 left-2.5 right-2.5 h-[2px] rounded-full bg-[#0877B8] transition-all duration-200 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'}`} />
                    </>
                  )}
                </NavLink>
              ))}
            </div>

            {/* Right */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Mobile lang switcher */}
              <div className="lg:hidden flex items-center gap-0.5 bg-gray-100 rounded-full px-2 py-1 text-xs">
                <button onClick={() => switchLang('hi')} className={`px-1 ${lang === 'hi' ? 'text-[#063B63] font-bold' : 'text-gray-500'}`}>
                  {'\u0939\u093f'}
                </button>
                <span className="text-gray-300">|</span>
                <button onClick={() => switchLang('en')} className={`px-1 ${lang === 'en' ? 'text-[#063B63] font-bold' : 'text-gray-500'}`}>EN</button>
              </div>

              <Link to="/appointment"
                className="hidden md:inline-flex items-center gap-2 bg-[#159447] hover:bg-[#117a3a] text-white text-[13px] font-bold px-4 py-2 rounded-md transition-colors shadow-sm whitespace-nowrap">
                {t.nav.bookAppointment}
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                </svg>
              </Link>

              <button onClick={() => setMobileOpen(o => !o)}
                className="lg:hidden p-2 rounded-lg text-[#063B63] hover:bg-gray-100 transition-colors"
                aria-label="Toggle menu">
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22 }}
              className="lg:hidden overflow-hidden border-t border-gray-100 bg-white">
              <div className="px-4 py-3 space-y-0.5">
                {NAV_LINKS(t).map(({ to, label }) => (
                  <NavLink key={to} to={to} end={to === '/'}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive ? 'text-[#0877B8] bg-blue-50' : 'text-[#1a2e44] hover:bg-gray-50 hover:text-[#0877B8]'}`
                    }>
                    {label}
                  </NavLink>
                ))}
                <div className="pt-3 space-y-2 border-t border-gray-100 mt-2">
                  <Link to="/appointment"
                    className="flex items-center justify-center gap-2 bg-[#159447] text-white text-sm font-bold py-3 rounded-xl w-full">
                    {t.nav.bookAppointment}
                  </Link>
                  <div className="flex gap-2">
                    <a href={`tel:${phone}`} className="flex-1 flex items-center justify-center gap-1.5 bg-gray-100 text-[#063B63] text-sm font-medium py-2.5 rounded-xl">
                      <Phone size={15} /> {t.common.callNow}
                    </a>
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 bg-[#25D366] text-white text-sm font-medium py-2.5 rounded-xl">
                      <MessageCircle size={15} /> WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}
