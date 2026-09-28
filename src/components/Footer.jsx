import { Link } from 'react-router-dom'
import { Phone, MessageCircle, Mail, MapPin, Clock } from 'lucide-react'
import { FacebookIcon, YoutubeIcon, InstagramIcon } from './SocialIcons'
import { useEffect, useState } from 'react'
import { getWebsiteSettings } from '../services/neurotherapyService'
import { useLanguage } from '../lib/LanguageContext'

export default function Footer() {
  const [settings, setSettings] = useState({})
  const { t, lang } = useLanguage()

  useEffect(() => {
    getWebsiteSettings().then(setSettings).catch(() => {})
  }, [])

  const phone = settings.phone || '+91 88711 93506'
  const whatsapp = settings.whatsapp || '+91 88711 93506'
  const email = settings.email || 'info@doctorsir.in'
  const whatsappLink = `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`
  const siteName = settings.site_name || 'Neurotherapist Naveen Sharma'

  const quickLinks = [
    { to: '/', label: t.nav.home },
    { to: '/about', label: t.nav.about },
    { to: '/neurotherapy', label: t.nav.neurotherapy },
    { to: '/services', label: t.nav.services },
    { to: '/benefits', label: t.nav.benefits },
    { to: '/testimonials', label: t.nav.testimonials },
    { to: '/gallery', label: t.nav.gallery },
    { to: '/faqs', label: t.nav.faqs },
  ]

  const serviceLinks = [
    { to: '/services/cervical-neck-pain', label: lang === 'hi' ? '\u0938\u0930\u094d\u0935\u093e\u0907\u0915\u0932 / \u0917\u0930\u094d\u0926\u0928 \u0926\u0930\u094d\u0926' : 'Cervical / Neck Pain' },
    { to: '/services/back-pain-sciatica', label: lang === 'hi' ? '\u0915\u092e\u0930 \u0926\u0930\u094d\u0926 / \u0938\u093e\u0907\u091f\u093f\u0915\u093e' : 'Back Pain / Sciatica' },
    { to: '/services/knee-joint-pain', label: lang === 'hi' ? '\u0918\u0941\u091f\u0928\u093e / \u091c\u094b\u0921\u093c \u0926\u0930\u094d\u0926' : 'Knee & Joint Pain' },
    { to: '/services/migraine-headache', label: lang === 'hi' ? '\u092e\u093e\u0907\u0917\u094d\u0930\u0947\u0928 / \u0938\u093f\u0930\u0926\u0930\u094d\u0926' : 'Migraine / Headache' },
    { to: '/services/senior-citizen-home-care', label: lang === 'hi' ? '\u0938\u0940\u0928\u093f\u092f\u0930 \u0938\u093f\u091f\u093f\u091c\u0928 \u0915\u0947\u092f\u0930' : 'Senior Citizen Care' },
  ]

  return (
    <footer className="bg-[#063B63] text-white" style={{ fontFamily: "'Inter','Noto Sans Devanagari',sans-serif" }}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              {settings.logo_url ? (
                <img src={settings.logo_url} alt={siteName} className="h-10 w-auto brightness-0 invert" />
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-sm">N</div>
                  <div>
                    <div className="font-bold text-base leading-tight">{siteName}</div>
                    <div className="text-[#5BC8F5] text-xs">Home Visit Wellness</div>
                  </div>
                </div>
              )}
            </Link>
            <p className="text-blue-200 text-sm leading-relaxed mb-4">
              {settings.footer_text || 'Professional neurotherapy home visit wellness service in Bhopal by Naveen Sharma.'}
            </p>
            <div className="flex flex-col gap-2">
              <span className="bg-[#159447]/20 text-[#5BC8F5] text-xs font-semibold px-3 py-1.5 rounded-full border border-[#159447]/30 w-fit">
                Home Visit Only
              </span>
              <span className="bg-[#159A8C]/20 text-[#5BC8F5] text-xs font-semibold px-3 py-1.5 rounded-full border border-[#159A8C]/30 w-fit">
                Appointment Based
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 pb-2 border-b border-white/10">
              {t.footer.quickLinks}
            </h3>
            <ul className="space-y-2">
              {quickLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-blue-200 hover:text-white text-sm transition-colors block hover:pl-1 duration-200">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 pb-2 border-b border-white/10">
              {t.footer.services}
            </h3>
            <ul className="space-y-2">
              {serviceLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-blue-200 hover:text-white text-sm transition-colors block hover:pl-1 duration-200">
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/services" className="text-[#5BC8F5] hover:text-white text-sm transition-colors font-medium block mt-1">
                  {t.common.viewAll} →
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 pb-2 border-b border-white/10">
              {t.footer.contact}
            </h3>
            <ul className="space-y-3">
              <li>
                <a href={`tel:${phone}`} className="flex items-start gap-2.5 text-blue-200 hover:text-white transition-colors group">
                  <Phone size={14} className="mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{phone}</span>
                </a>
              </li>
              <li>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2.5 text-blue-200 hover:text-[#25D366] transition-colors">
                  <MessageCircle size={14} className="mt-0.5 flex-shrink-0" />
                  <span className="text-sm">WhatsApp</span>
                </a>
              </li>
              <li>
                <a href={`mailto:${email}`} className="flex items-start gap-2.5 text-blue-200 hover:text-white transition-colors">
                  <Mail size={14} className="mt-0.5 flex-shrink-0" />
                  <span className="text-sm break-all">{email}</span>
                </a>
              </li>
              {settings.appointment_hours && (
                <li className="flex items-start gap-2.5 text-blue-200">
                  <Clock size={14} className="mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{settings.appointment_hours}</span>
                </li>
              )}
              {settings.service_area && (
                <li className="flex items-start gap-2.5 text-blue-200">
                  <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{settings.service_area}</span>
                </li>
              )}
            </ul>
            <div className="flex items-center gap-3 mt-4">
              {settings.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                  <FacebookIcon size={14} />
                </a>
              )}
              {settings.youtube_url && (
                <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                  <YoutubeIcon size={14} />
                </a>
              )}
              {settings.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                  <InstagramIcon size={14} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-blue-300">
          <p>{settings.footer_text ? settings.footer_text : `\u00A9 ${new Date().getFullYear()} ${siteName}. All rights reserved.`}</p>
          <div className="flex items-center gap-3">
            <span>Home Visit Only</span>
            <span className="text-white/20">|</span>
            <span>Appointment Based</span>
          </div>
        </div>
      </div>

      {/* Mobile bottom CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 flex">
        <Link to="/appointment"
          className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#063B63] to-[#0877B8] text-white text-sm font-semibold py-3.5">
          {t.nav.bookAppointment}
        </Link>
        <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 bg-[#25D366] text-white text-sm font-semibold py-3.5">
          <MessageCircle size={16} /> WhatsApp
        </a>
      </div>
    </footer>
  )
}
