import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { ChevronRight, Calendar, MessageCircle } from 'lucide-react'
import { getPublishedServices, getWebsiteSettings } from '../services/neurotherapyService'
import { useLanguage } from '../lib/LanguageContext'

const fadeUp = { hidden: { opacity: 0, y: 25 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }
const stagger = { show: { transition: { staggerChildren: 0.08 } } }

export default function ServicesPage() {
  const [services, setServices] = useState([])
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)
  const { lang, t } = useLanguage()

  useEffect(() => {
    Promise.all([getPublishedServices(), getWebsiteSettings()])
      .then(([s, w]) => { setServices(s); setSettings(w) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const whatsapp = settings.whatsapp || '+91 88711 93506'
  const whatsappLink = `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`

  return (
    <>
      <Helmet>
        <title>{lang === 'hi' ? 'à¤¸à¥‡à¤µà¤¾à¤à¤‚ â€“ Neurotherapist Naveen Sharma' : 'Services â€“ Neurotherapist Naveen Sharma'}</title>
        <meta name="description" content="Browse all neurotherapy home visit wellness services." />
      </Helmet>

      <div className="bg-gradient-to-br from-[#063B63] to-[#0877B8] text-white py-10 md:py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block text-xs font-bold tracking-widest bg-white/15 rounded-full px-4 py-2 mb-4 text-blue-100">
            {lang === 'hi' ? 'à¤¹à¤®à¤¾à¤°à¥€ à¤¸à¥‡à¤µà¤¾à¤à¤‚' : 'Our Services'}
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4">
            {lang === 'hi' ? 'à¤¨à¥à¤¯à¥‚à¤°à¥‹à¤¥à¥‡à¤°à¥‡à¤ªà¥€ à¤¸à¥‡à¤µà¤¾à¤à¤‚' : 'Neurotherapy Services'}
          </h1>
          <p className="text-blue-100 text-base md:text-lg max-w-2xl mx-auto">
            {lang === 'hi' ? 'à¤†à¤ªà¤•à¥‡ à¤˜à¤° à¤ªà¤° à¤µà¥à¤¯à¤•à¥à¤¤à¤¿à¤—à¤¤ à¤µà¥‡à¤²à¤¨à¥‡à¤¸ à¤¸à¤¹à¤¾à¤¯à¤¤à¤¾' : 'Individualized home-based wellness support, delivered to your door'}
          </p>
        </div>
      </div>

      <section className="py-10 md:py-16 bg-[#F5FAFC] min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-3 border-[#0877B8] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">ðŸ©º</div>
              <p className="text-[#3D5A73] text-lg">{t.common.noContent}</p>
              <Link to="/contact" className="inline-flex items-center gap-2 mt-4 text-[#0877B8] font-semibold hover:underline">
                {t.nav.contact} â†’
              </Link>
            </div>
          ) : (
            <motion.div initial="hidden" animate="show" variants={stagger}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {services.map(service => (
                <motion.div key={service.id} variants={fadeUp}>
                  <Link to={`/services/${service.slug}`}
                    className="block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-blue-100 transition-all duration-300 group border border-transparent hover:border-blue-100 h-full">
                    <div className="h-36 sm:h-44 overflow-hidden bg-gradient-to-br from-[#E8F4FF] to-[#F0F9FF]">
                      {service.image ? (
                        <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-5xl">ðŸ©º</div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-[#063B63] text-sm md:text-base mb-2 group-hover:text-[#0877B8] transition-colors">
                        {lang === 'hi' && service.title_hi ? service.title_hi : service.title}
                      </h3>
                      <p className="text-[#3D5A73] text-xs md:text-sm leading-relaxed line-clamp-3">
                        {lang === 'hi' && service.short_description_hi ? service.short_description_hi : service.short_description}
                      </p>
                      <div className="flex items-center gap-1 mt-3 text-[#0877B8] text-xs font-semibold">
                        {lang === 'hi' ? 'à¤…à¤§à¤¿à¤• à¤œà¤¾à¤¨à¥‡à¤‚' : 'Learn More'} <ChevronRight size={13} />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-gradient-to-br from-[#063B63] to-[#0877B8] text-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-3">{lang === 'hi' ? 'à¤…à¤ªà¥‰à¤‡à¤‚à¤Ÿà¤®à¥‡à¤‚à¤Ÿ à¤¬à¥à¤• à¤•à¤°à¥‡à¤‚' : 'Book an Appointment'}</h2>
          <p className="text-blue-100 mb-6">{lang === 'hi' ? 'à¤¹à¤® à¤†à¤ªà¤•à¥‡ à¤˜à¤° à¤†à¤à¤‚à¤—à¥‡à¥¤' : 'Contact us to schedule your home visit.'}</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/appointment" className="inline-flex items-center gap-2 bg-white text-[#063B63] font-bold px-6 py-3 rounded-full hover:shadow-lg transition-all">
              <Calendar size={17} /> {t.nav.bookAppointment}
            </Link>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white font-bold px-6 py-3 rounded-full hover:shadow-lg transition-all">
              <MessageCircle size={17} /> WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  )
}


