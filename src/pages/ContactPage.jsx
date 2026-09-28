import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Phone, MessageCircle, Mail, Clock, MapPin, Calendar } from 'lucide-react'
import { FacebookIcon, YoutubeIcon, InstagramIcon } from '../components/SocialIcons'
import { getContactSettings, getWebsiteSettings } from '../services/neurotherapyService'
import { useLanguage } from '../lib/LanguageContext'

export default function ContactPage() {
  const [contact, setContact] = useState({})
  const [settings, setSettings] = useState({})
  const { lang, t } = useLanguage()

  useEffect(() => {
    Promise.all([getContactSettings(), getWebsiteSettings()])
      .then(([c, s]) => { setContact(c); setSettings(s) })
      .catch(console.error)
  }, [])

  const phone = contact.phone || settings.phone || '+91 88711 93506'
  const whatsapp = contact.whatsapp || settings.whatsapp || '+91 88711 93506'
  const email = contact.email || settings.email || 'info@doctorsir.in'
  const whatsappLink = `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`

  const contactItems = [
    {
      icon: <Phone size={24} className="text-white" />,
      color: 'from-[#063B63] to-[#0877B8]',
      label: lang === 'hi' ? 'à¤•à¥‰à¤² à¤•à¤°à¥‡à¤‚' : 'Call Us',
      value: phone,
      action: `tel:${phone}`,
      btnText: t.common.callNow,
      btnColor: 'bg-[#063B63] hover:bg-[#0877B8]',
    },
    {
      icon: <MessageCircle size={24} className="text-white" />,
      color: 'from-[#25D366] to-[#128C7E]',
      label: 'WhatsApp',
      value: whatsapp,
      action: whatsappLink,
      btnText: lang === 'hi' ? 'à¤µà¥à¤¹à¤¾à¤Ÿà¥à¤¸à¤à¤ª à¤ªà¤° à¤¸à¤‚à¤¦à¥‡à¤¶ à¤­à¥‡à¤œà¥‡à¤‚' : 'Send WhatsApp Message',
      btnColor: 'bg-[#25D366] hover:bg-[#128C7E]',
      external: true,
    },
    {
      icon: <Mail size={24} className="text-white" />,
      color: 'from-[#159A8C] to-[#0877B8]',
      label: lang === 'hi' ? 'à¤ˆà¤®à¥‡à¤² à¤•à¤°à¥‡à¤‚' : 'Email Us',
      value: email,
      action: `mailto:${email}`,
      btnText: lang === 'hi' ? 'à¤ˆà¤®à¥‡à¤² à¤­à¥‡à¤œà¥‡à¤‚' : 'Send Email',
      btnColor: 'bg-[#159A8C] hover:bg-[#0877B8]',
    },
  ]

  return (
    <>
      <Helmet>
        <title>{lang === 'hi' ? 'à¤¸à¤‚à¤ªà¤°à¥à¤• â€“ Neurotherapist Naveen Sharma' : 'Contact â€“ Neurotherapist Naveen Sharma'}</title>
        <meta name="description" content="Contact us for neurotherapy home visit appointment enquiries." />
      </Helmet>

      <div className="bg-gradient-to-br from-[#063B63] to-[#0877B8] text-white py-10 md:py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4">{lang === 'hi' ? 'à¤¸à¤‚à¤ªà¤°à¥à¤• à¤•à¤°à¥‡à¤‚' : 'Contact Us'}</h1>
          <p className="text-blue-100 text-base md:text-lg max-w-2xl mx-auto">
            {lang === 'hi' ? 'à¤…à¤ªà¥‰à¤‡à¤‚à¤Ÿà¤®à¥‡à¤‚à¤Ÿ à¤¬à¥à¤• à¤•à¤°à¤¨à¥‡ à¤¯à¤¾ à¤ªà¥à¤°à¤¶à¥à¤¨ à¤ªà¥‚à¤›à¤¨à¥‡ à¤•à¥‡ à¤²à¤¿à¤ à¤¹à¤®à¤¸à¥‡ à¤¸à¤‚à¤ªà¤°à¥à¤• à¤•à¤°à¥‡à¤‚' : 'Get in touch to book an appointment or ask us anything'}
          </p>
          <div className="flex items-center justify-center gap-4 mt-5 flex-wrap">
            <span className="bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm font-semibold">ðŸ  {t.common.homeVisitOnly}</span>
            <span className="bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm font-semibold">ðŸ“… {t.common.appointmentBased}</span>
          </div>
        </div>
      </div>

      <section className="py-10 md:py-16 bg-[#F5FAFC]">
        <div className="max-w-5xl mx-auto px-4">
          {/* Contact cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
            {contactItems.map((item, i) => (
              <a key={i} href={item.action} target={item.external ? '_blank' : undefined} rel={item.external ? 'noopener noreferrer' : undefined}
                className="bg-white rounded-2xl p-6 shadow-sm border border-blue-50 hover:shadow-lg hover:shadow-blue-100 transition-all group text-center block">
                <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <p className="text-[#7A9BB5] text-xs font-semibold uppercase tracking-widest mb-1">{item.label}</p>
                <p className="text-[#063B63] font-bold text-base mb-4 break-all">{item.value}</p>
                <span className={`inline-flex items-center justify-center gap-1.5 ${item.btnColor} text-white text-sm font-semibold px-4 py-2.5 rounded-full transition-all w-full`}>
                  {item.btnText}
                </span>
              </a>
            ))}
          </div>

          {/* Additional info */}
          <div className="grid md:grid-cols-2 gap-5">
            {/* Hours & Area */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-50">
              <h3 className="font-bold text-[#063B63] text-lg mb-4">
                {lang === 'hi' ? 'à¤¸à¤®à¤¯ à¤”à¤° à¤¸à¥‡à¤µà¤¾ à¤•à¥à¤·à¥‡à¤¤à¥à¤°' : 'Hours & Service Area'}
              </h3>
              <div className="space-y-4">
                {(contact.appointment_hours || settings.appointment_hours) && (
                  <div className="flex items-start gap-3">
                    <Clock size={18} className="text-[#0877B8] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[#3D5A73] text-sm font-medium">{lang === 'hi' ? 'à¤…à¤ªà¥‰à¤‡à¤‚à¤Ÿà¤®à¥‡à¤‚à¤Ÿ à¤¸à¤®à¤¯' : 'Appointment Hours'}</p>
                      <p className="text-[#063B63] font-semibold text-sm">{contact.appointment_hours || settings.appointment_hours}</p>
                    </div>
                  </div>
                )}
                {contact.response_time && (
                  <div className="flex items-start gap-3">
                    <MessageCircle size={18} className="text-[#159A8C] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[#3D5A73] text-sm font-medium">{lang === 'hi' ? 'à¤ªà¥à¤°à¤¤à¤¿à¤•à¥à¤°à¤¿à¤¯à¤¾ à¤¸à¤®à¤¯' : 'Response Time'}</p>
                      <p className="text-[#063B63] font-semibold text-sm">{contact.response_time}</p>
                    </div>
                  </div>
                )}
                {(contact.service_area || settings.service_area) && (
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-[#159447] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[#3D5A73] text-sm font-medium">{lang === 'hi' ? 'à¤¸à¥‡à¤µà¤¾ à¤•à¥à¤·à¥‡à¤¤à¥à¤°' : 'Service Area'}</p>
                      <p className="text-[#063B63] font-semibold text-sm">{contact.service_area || settings.service_area}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Important notice */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-blue-50">
              <h3 className="font-bold text-[#063B63] text-lg mb-4">
                {lang === 'hi' ? 'à¤®à¤¹à¤¤à¥à¤µà¤ªà¥‚à¤°à¥à¤£ à¤œà¤¾à¤¨à¤•à¤¾à¤°à¥€' : 'Important Information'}
              </h3>
              <div className="bg-blue-50 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-2 text-[#063B63] font-bold text-sm mb-2">
                  ðŸ  {t.common.homeVisitOnly}
                </div>
                <p className="text-[#3D5A73] text-xs leading-relaxed">
                  {contact.note || (lang === 'hi'
                    ? 'à¤¯à¤¹ à¤à¤• à¤•à¥‡à¤µà¤² à¤¹à¥‹à¤® à¤µà¤¿à¤œà¤¿à¤Ÿ à¤¸à¥‡à¤µà¤¾ à¤¹à¥ˆà¥¤ à¤¹à¤®à¤¾à¤°à¤¾ à¤•à¥‹à¤ˆ à¤¸à¤¾à¤°à¥à¤µà¤œà¤¨à¤¿à¤• à¤•à¥à¤²à¤¿à¤¨à¤¿à¤• à¤¯à¤¾ à¤µà¥‰à¤•-à¤‡à¤¨ à¤•à¥‡à¤‚à¤¦à¥à¤° à¤¨à¤¹à¥€à¤‚ à¤¹à¥ˆà¥¤'
                    : 'This is a HOME VISIT ONLY service. We do not have a public clinic or walk-in center.')}
                </p>
              </div>
              <div className="bg-teal-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-[#159A8C] font-bold text-sm mb-2">
                  ðŸ“… {t.common.appointmentBased}
                </div>
                <p className="text-[#3D5A73] text-xs leading-relaxed">
                  {lang === 'hi'
                    ? 'à¤¸à¤­à¥€ à¤¸à¤¤à¥à¤° à¤ªà¥‚à¤°à¥à¤µ à¤…à¤ªà¥‰à¤‡à¤‚à¤Ÿà¤®à¥‡à¤‚à¤Ÿ à¤•à¥‡ à¤†à¤§à¤¾à¤° à¤ªà¤° à¤†à¤¯à¥‹à¤œà¤¿à¤¤ à¤•à¤¿à¤ à¤œà¤¾à¤¤à¥‡ à¤¹à¥ˆà¤‚à¥¤'
                    : 'All sessions are conducted by prior appointment only. No walk-ins accepted.'}
                </p>
              </div>
              {/* Social links */}
              {(settings.facebook_url || settings.youtube_url || settings.instagram_url) && (
                <div className="mt-4">
                  <p className="text-[#7A9BB5] text-xs font-semibold uppercase tracking-widest mb-2">{t.footer.followUs}</p>
                  <div className="flex gap-3">
                    {settings.facebook_url && (
                      <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer"
                        className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-[#063B63] hover:bg-[#063B63] hover:text-white transition-all">
                        <FacebookIcon size={16} />
                      </a>
                    )}
                    {settings.youtube_url && (
                      <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer"
                        className="w-9 h-9 bg-red-100 rounded-full flex items-center justify-center text-red-600 hover:bg-red-600 hover:text-white transition-all">
                        <YoutubeIcon size={16} />
                      </a>
                    )}
                    {settings.instagram_url && (
                      <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer"
                        className="w-9 h-9 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 hover:bg-pink-600 hover:text-white transition-all">
                        <InstagramIcon size={16} />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Book appointment CTA */}
          <div className="mt-8 bg-gradient-to-br from-[#063B63] to-[#0877B8] rounded-2xl p-8 text-white text-center">
            <h3 className="text-xl font-bold mb-2">{lang === 'hi' ? 'à¤…à¤ªà¥‰à¤‡à¤‚à¤Ÿà¤®à¥‡à¤‚à¤Ÿ à¤¬à¥à¤• à¤•à¤°à¥‡à¤‚' : 'Book Your Appointment'}</h3>
            <p className="text-blue-100 text-sm mb-5">{lang === 'hi' ? 'à¤¹à¤®à¤¾à¤°à¥‡ à¤‘à¤¨à¤²à¤¾à¤‡à¤¨ à¤«à¥‰à¤°à¥à¤® à¤•à¥‡ à¤®à¤¾à¤§à¥à¤¯à¤® à¤¸à¥‡ à¤ªà¥‚à¤›à¤¤à¤¾à¤› à¤¸à¤¬à¤®à¤¿à¤Ÿ à¤•à¤°à¥‡à¤‚à¥¤' : 'Submit an enquiry through our online form and we will be in touch.'}</p>
            <Link to="/appointment" className="inline-flex items-center gap-2 bg-white text-[#063B63] font-bold px-7 py-3 rounded-full hover:shadow-lg transition-all">
              <Calendar size={17} /> {t.nav.bookAppointment}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}


