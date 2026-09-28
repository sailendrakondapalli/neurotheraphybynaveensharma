import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Calendar, MessageCircle, Sparkles } from 'lucide-react'
import { getPublishedBenefits, getWebsiteSettings } from '../services/neurotherapyService'
import { useLanguage } from '../lib/LanguageContext'

const fadeUp = { hidden: { opacity: 0, y: 25 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }
const stagger = { show: { transition: { staggerChildren: 0.1 } } }

export default function BenefitsPage() {
  const [benefits, setBenefits] = useState([])
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)
  const { lang, t } = useLanguage()

  useEffect(() => {
    Promise.all([getPublishedBenefits(), getWebsiteSettings()])
      .then(([b, s]) => { setBenefits(b); setSettings(s) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const whatsapp = settings.whatsapp || '+91 88711 93506'
  const whatsappLink = `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`

  return (
    <>
      <Helmet>
        <title>{lang === 'hi' ? 'लाभ' : 'Benefits'} - Neurotherapist Naveen Sharma</title>
        <meta name="description" content="Benefits of our home visit neurotherapy wellness service." />
      </Helmet>

      <div className="bg-gradient-to-br from-[#063B63] to-[#159A8C] text-white py-10 md:py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block text-xs font-bold tracking-widest bg-white/15 rounded-full px-4 py-2 mb-4 text-blue-100">
            {lang === 'hi' ? 'लाभ' : 'Benefits'}
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4">
            {lang === 'hi' ? 'होम विजिट देखभाल के लाभ' : 'Benefits of Home Visit Care'}
          </h1>
          <p className="text-blue-100 text-base md:text-lg max-w-2xl mx-auto">
            {lang === 'hi' ? 'जानें क्यों हमारी घर-आधारित वेलनेस सेवा एक बेहतर विकल्प है' : 'Discover why our home-based wellness approach makes quality care more accessible'}
          </p>
        </div>
      </div>

      <section className="py-10 md:py-16 bg-[#F5FAFC] min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-3 border-[#0877B8] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : benefits.length === 0 ? (
            <div className="text-center py-20 text-[#3D5A73]">{t.common.noContent}</div>
          ) : (
            <motion.div initial="hidden" animate="show" variants={stagger}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map(benefit => (
                <motion.div key={benefit.id} variants={fadeUp}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-blue-50 hover:shadow-md transition-all">
                  <div className="text-5xl mb-4">
                    {benefit.icon || <Sparkles size={40} className="text-[#0877B8]" />}
                  </div>
                  {benefit.image && (
                    <img src={benefit.image} alt={benefit.title} className="w-full h-32 object-cover rounded-xl mb-4" loading="lazy" />
                  )}
                  <h3 className="font-bold text-[#063B63] text-sm md:text-base mb-3">
                    {lang === 'hi' && benefit.title_hi ? benefit.title_hi : benefit.title}
                  </h3>
                  <p className="text-[#3D5A73] text-sm leading-relaxed">
                    {lang === 'hi' && benefit.description_hi ? benefit.description_hi : benefit.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <section className="py-12 bg-gradient-to-br from-[#159A8C] to-[#063B63] text-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-3">
            {lang === 'hi' ? 'इन लाभों का अनुभव करें' : 'Experience These Benefits'}
          </h2>
          <p className="text-teal-100 mb-6">
            {lang === 'hi' ? 'आज ही अपना होम विजिट अपॉइंटमेंट बुक करें।' : 'Book your home visit appointment today.'}
          </p>
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
