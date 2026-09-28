import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { CheckCircle, Home, Calendar, ArrowRight, Phone, MessageCircle } from 'lucide-react'
import { getAboutSettings, getWebsiteSettings } from '../services/neurotherapyService'
import { useLanguage } from '../lib/LanguageContext'

const fadeUp = { hidden: { opacity: 0, y: 25 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }

export default function AboutPage() {
  const [about, setAbout] = useState({})
  const [settings, setSettings] = useState({})
  const { lang, t } = useLanguage()

  useEffect(() => {
    Promise.all([getAboutSettings(), getWebsiteSettings()])
      .then(([a, s]) => { setAbout(a); setSettings(s) })
      .catch(console.error)
  }, [])

  const phone = settings.phone || '+91 88711 93506'
  const whatsapp = settings.whatsapp || '+91 88711 93506'
  const whatsappLink = `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`

  return (
    <>
      <Helmet>
        <title>{lang === 'hi' ? 'हमारे बारे में' : 'About Us'} - Neurotherapist Naveen Sharma</title>
        <meta name="description" content="Learn about our professional neurotherapy home visit wellness approach." />
      </Helmet>

      <div className="bg-gradient-to-br from-[#063B63] to-[#0877B8] text-white py-10 md:py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block text-xs font-bold tracking-widest bg-white/15 rounded-full px-4 py-2 mb-4 text-blue-100">
            {lang === 'hi' ? 'हमारे बारे में' : 'About Us'}
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4">
            {lang === 'hi' ? 'न्यूरोथेरेपी वेलनेस के बारे में' : 'About Our Neurotherapy Wellness'}
          </h1>
          <p className="text-blue-100 text-base md:text-lg max-w-2xl mx-auto">
            {lang === 'hi' ? 'व्यावसायिक, कोमल होम विजिट देखभाल आपके आराम के लिए' : 'Professional, gentle home visit care designed for your comfort and well-being'}
          </p>
          <div className="flex items-center justify-center gap-4 mt-5 flex-wrap">
            <span className="bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm font-semibold">{t.common.homeVisitOnly}</span>
            <span className="bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm font-semibold">{t.common.appointmentBased}</span>
          </div>
        </div>
      </div>

      <section className="py-10 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" animate="show" variants={fadeUp}>
              <span className="inline-block text-xs font-bold tracking-widest text-[#159A8C] uppercase bg-teal-50 rounded-full px-4 py-1.5 mb-4">
                {lang === 'hi' ? 'हमारा दृष्टिकोण' : 'Our Approach'}
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#063B63] mb-5 leading-tight">
                {about.heading || (lang === 'hi' ? 'हमारे न्यूरोथेरेपी दृष्टिकोण के बारे में' : 'About Our Neurotherapy Approach')}
              </h2>
              <p className="text-[#3D5A73] text-sm md:text-base leading-relaxed mb-5">
                {about.description || 'We provide professional neurotherapy wellness support through home visits. Our approach focuses on supporting mobility, comfort and overall well-being in the familiar and comfortable environment of your own home.'}
              </p>
              {about.mission && (
                <div className="bg-blue-50 border-l-4 border-[#0877B8] rounded-r-xl p-4 mb-5">
                  <h3 className="font-bold text-[#063B63] mb-2 text-sm">{lang === 'hi' ? 'हमारा मिशन' : 'Our Mission'}</h3>
                  <p className="text-[#3D5A73] text-sm">{about.mission}</p>
                </div>
              )}
              <div className="space-y-3 mb-6">
                {[
                  lang === 'hi' ? 'पूरी तरह से होम विजिट सेवा' : 'Fully home visit based service',
                  lang === 'hi' ? 'पूर्व अपॉइंटमेंट आवश्यक' : 'Prior appointment required',
                  lang === 'hi' ? 'कोई सार्वजनिक क्लिनिक नहीं' : 'No public clinic or walk-in center',
                  lang === 'hi' ? 'व्यक्तिगत, अनुकूलित देखभाल' : 'Personalized, individualized care',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-[#3D5A73] text-sm">
                    <CheckCircle size={16} className="text-[#159447] flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
              <Link to="/appointment" className="inline-flex items-center gap-2 bg-gradient-to-r from-[#063B63] to-[#0877B8] text-white font-semibold px-6 py-3 rounded-full hover:shadow-lg transition-all">
                <Calendar size={17} /> {t.nav.bookAppointment}
              </Link>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              {about.image ? (
                <img src={about.image} alt="About neurotherapy" className="w-full rounded-3xl shadow-xl object-cover" />
              ) : (
                <div className="w-full aspect-square bg-gradient-to-br from-[#F5FAFC] to-[#E8F4FF] rounded-3xl flex items-center justify-center border border-blue-100">
                  <div className="text-center p-8">
                    <div className="w-20 h-20 bg-[#0877B8]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Home size={40} className="text-[#0877B8]" />
                    </div>
                    <p className="text-[#063B63] font-bold text-xl mb-2">{lang === 'hi' ? 'होम विजिट सेवा' : 'Home Visit Service'}</p>
                    <p className="text-[#3D5A73] text-sm">{lang === 'hi' ? 'हम आपके घर आते हैं' : 'We come to you'}</p>
                  </div>
                </div>
              )}
              {(about.founded_year || about.experience_text) && (
                <div className="grid grid-cols-3 gap-2 mt-4">
                  {[
                    { value: about.founded_year || '5+', label: about.experience_text || 'Years Experience' },
                    { value: '500+', label: about.patients_text || 'Patients Supported' },
                    { value: '11+', label: about.services_text || 'Services' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-gradient-to-br from-[#063B63] to-[#0877B8] rounded-xl p-3 text-center text-white">
                      <div className="text-xl font-bold">{stat.value}</div>
                      <div className="text-blue-200 text-xs mt-0.5">{stat.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-10 bg-[#F5FAFC]">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl border border-blue-100 p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-[#0877B8] font-bold text-lg">i</span>
              </div>
              <div>
                <h3 className="font-bold text-[#063B63] text-lg mb-2">
                  {lang === 'hi' ? 'महत्वपूर्ण जानकारी' : 'Important Information'}
                </h3>
                <p className="text-[#3D5A73] text-sm leading-relaxed mb-3">
                  {lang === 'hi'
                    ? 'यह एक केवल होम विजिट सेवा है। हमारा कोई सार्वजनिक क्लिनिक, अस्पताल या वॉक-इन केंद्र नहीं है। सभी सत्र पूर्व अपॉइंटमेंट के आधार पर आपके घर में आयोजित किए जाते हैं।'
                    : 'This is a HOME VISIT ONLY service. We do not have a public clinic, hospital, or walk-in center. All sessions are conducted in your home by prior appointment only.'}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-blue-50 text-[#0877B8] text-xs font-semibold px-3 py-1.5 rounded-full">{t.common.homeVisitOnly}</span>
                  <span className="bg-teal-50 text-[#159A8C] text-xs font-semibold px-3 py-1.5 rounded-full">{t.common.appointmentBased}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 md:py-12 bg-gradient-to-br from-[#063B63] to-[#0877B8] text-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-3">{lang === 'hi' ? 'संपर्क करें' : 'Get in Touch'}</h2>
          <p className="text-blue-100 mb-6">{lang === 'hi' ? 'अपॉइंटमेंट के लिए हमसे संपर्क करें।' : 'Contact us to schedule your home visit appointment.'}</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href={`tel:${phone}`} className="inline-flex items-center gap-2 bg-white text-[#063B63] font-bold px-5 py-3 rounded-full hover:shadow-lg transition-all">
              <Phone size={16} /> {t.common.callNow}
            </a>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#25D366] text-white font-bold px-5 py-3 rounded-full hover:shadow-lg transition-all">
              <MessageCircle size={16} /> WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
