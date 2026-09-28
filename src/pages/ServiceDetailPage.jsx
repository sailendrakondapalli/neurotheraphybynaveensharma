import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Calendar, ChevronRight, MessageCircle, Phone, CheckCircle, ArrowLeft, Stethoscope } from 'lucide-react'
import { getServiceBySlug, getPublishedServices, getWebsiteSettings } from '../services/neurotherapyService'
import { useLanguage } from '../lib/LanguageContext'

export default function ServiceDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [service, setService] = useState(null)
  const [related, setRelated] = useState([])
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)
  const { lang, t } = useLanguage()

  useEffect(() => {
    setLoading(true)
    Promise.all([getServiceBySlug(slug), getPublishedServices(), getWebsiteSettings()])
      .then(([svc, all, w]) => {
        if (!svc) { navigate('/services', { replace: true }); return }
        setService(svc)
        setSettings(w)
        setRelated(all.filter(s => s.id !== svc.id).slice(0, 4))
      })
      .catch(() => navigate('/services', { replace: true }))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-10 h-10 border-3 border-[#0877B8] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!service) return null

  const phone = settings.phone || '+91 88711 93506'
  const whatsapp = settings.whatsapp || '+91 88711 93506'
  const whatsappLink = `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`
  const benefits = service.benefits ? (typeof service.benefits === 'string' ? JSON.parse(service.benefits) : service.benefits) : []

  const title = lang === 'hi' && service.title_hi ? service.title_hi : service.title
  const shortDesc = lang === 'hi' && service.short_description_hi ? service.short_description_hi : service.short_description
  const desc = lang === 'hi' && service.description_hi ? service.description_hi : service.description

  return (
    <>
      <Helmet>
        <title>{title} - Neurotherapist Naveen Sharma</title>
        <meta name="description" content={shortDesc} />
      </Helmet>

      <div className="bg-gradient-to-br from-[#063B63] to-[#0877B8] text-white py-10 md:py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/services" className="inline-flex items-center gap-2 text-blue-200 hover:text-white text-sm mb-5 transition-colors">
            <ArrowLeft size={16} /> {lang === 'hi' ? 'सभी सेवाएं' : 'All Services'}
          </Link>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4">{title}</h1>
          {shortDesc && <p className="text-blue-100 text-lg max-w-2xl">{shortDesc}</p>}
          <div className="flex items-center gap-3 mt-4 flex-wrap">
            <span className="bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm font-semibold">{t.common.homeVisitOnly}</span>
            <span className="bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm font-semibold">{t.common.appointmentBased}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 md:py-16">
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 order-2 lg:order-1">
            {service.image && (
              <img src={service.image} alt={title} className="w-full rounded-2xl shadow-lg object-cover mb-8 max-h-80" />
            )}

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              {desc && (
                <div className="prose prose-blue max-w-none mb-8">
                  <p className="text-[#3D5A73] leading-relaxed text-base">{desc}</p>
                </div>
              )}

              {benefits.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-[#063B63] mb-4">
                    {lang === 'hi' ? 'सहायता क्षेत्र' : 'Support Areas'}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-3 bg-[#F5FAFC] rounded-xl p-3 border border-blue-50">
                        <CheckCircle size={16} className="text-[#159447] flex-shrink-0" />
                        <span className="text-[#3D5A73] text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          <div className="space-y-5 order-1 lg:order-2">
            <div className="bg-gradient-to-br from-[#063B63] to-[#0877B8] rounded-2xl p-6 text-white">
              <h3 className="font-bold text-lg mb-2">{lang === 'hi' ? 'अपॉइंटमेंट बुक करें' : 'Book Appointment'}</h3>
              <p className="text-blue-100 text-sm mb-4">{lang === 'hi' ? 'हम आपके घर आएंगे।' : 'We come to your home.'}</p>
              <Link to={`/appointment?service=${encodeURIComponent(service.title)}`}
                className="w-full flex items-center justify-center gap-2 bg-white text-[#063B63] font-bold py-3 rounded-xl hover:shadow-lg transition-all">
                <Calendar size={17} /> {t.nav.bookAppointment}
              </Link>
              <a href={`tel:${phone}`} className="w-full mt-3 flex items-center justify-center gap-2 bg-white/10 border border-white/30 text-white font-semibold py-2.5 rounded-xl hover:bg-white/20 transition-all text-sm">
                <Phone size={15} /> {t.common.callNow}
              </a>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
                className="w-full mt-2 flex items-center justify-center gap-2 bg-[#25D366] text-white font-semibold py-2.5 rounded-xl hover:bg-[#1ebc5a] transition-all text-sm">
                <MessageCircle size={15} /> WhatsApp
              </a>
            </div>

            <div className="bg-[#F5FAFC] rounded-2xl p-5 border border-blue-100">
              <h4 className="font-bold text-[#063B63] mb-3 text-sm">{lang === 'hi' ? 'महत्वपूर्ण' : 'Important'}</h4>
              <div className="space-y-2">
                {[
                  lang === 'hi' ? 'केवल होम विजिट' : 'Home Visit Only',
                  lang === 'hi' ? 'पूर्व अपॉइंटमेंट आवश्यक' : 'Prior appointment required',
                  lang === 'hi' ? 'कोई वॉक-इन नहीं' : 'No walk-ins accepted',
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-2 text-[#3D5A73] text-sm">
                    <CheckCircle size={14} className="text-[#159447] flex-shrink-0" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {related.length > 0 && (
              <div>
                <h4 className="font-bold text-[#063B63] mb-3 text-sm">{lang === 'hi' ? 'अन्य सेवाएं' : 'Other Services'}</h4>
                <div className="space-y-2">
                  {related.map(svc => (
                    <Link key={svc.id} to={`/services/${svc.slug}`}
                      className="flex items-center gap-2 bg-white rounded-xl p-3 border border-blue-50 hover:border-blue-200 hover:shadow-sm transition-all group">
                      <div className="w-10 h-10 rounded-lg bg-[#F5FAFC] overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {svc.image ? <img src={svc.image} alt={svc.title} className="w-full h-full object-cover" /> : <Stethoscope size={16} className="text-[#0877B8]" />}
                      </div>
                      <span className="text-[#3D5A73] text-xs font-medium group-hover:text-[#0877B8] transition-colors flex-1 line-clamp-2">
                        {lang === 'hi' && svc.title_hi ? svc.title_hi : svc.title}
                      </span>
                      <ChevronRight size={14} className="text-gray-400 flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
