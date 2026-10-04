import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import {
  Phone, MessageCircle, Star, ChevronRight, Calendar,
  ArrowRight, CheckCircle, Play, Send, X
} from 'lucide-react'
import {
  getHomepageSettings, getWebsiteSettings, getPublishedServices,
  getPublishedBenefits, getPublishedTestimonials, getPublishedGallery,
  getPublishedVideos, getPublishedFaqs, submitAppointment
} from '../services/neurotherapyService'
import { getYouTubeEmbedUrl, getYouTubeThumbnail } from '../services/uploadService'
import { useLanguage } from '../lib/LanguageContext'
import toast from 'react-hot-toast'

const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }
const stagger = { show: { transition: { staggerChildren: 0.08 } } }

function StarRating({ rating = 5 }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={14} className={i <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />
      ))}
    </div>
  )
}

function InlineAppointmentForm({ services }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', service_id: '', preferred_date: '', preferred_time: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState({})
  const { lang } = useLanguage()

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = true
    if (!form.phone.trim()) e.phone = true
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    setErrors(er => ({ ...er, [name]: false }))
    if (name === 'service_id') {
      const svc = services.find(s => s.id === value)
      setForm(f => ({ ...f, service_id: value, service_name: svc?.title || '' }))
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      const svc = services.find(s => s.id === form.service_id)
      await submitAppointment({
        name: form.name, phone: form.phone,
        email: form.email || null,
        service_id: form.service_id || null,
        service_name: svc?.title || null,
        preferred_date: form.preferred_date || null,
        preferred_time: form.preferred_time || null,
        message: form.message || null,
      })
      setSubmitted(true)
    } catch {
      toast.error('Submission failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const inp = (field) => `w-full px-3 py-2.5 text-sm border rounded-md outline-none transition-all ${errors[field] ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white focus:border-[#0877B8] focus:ring-1 focus:ring-[#0877B8]/20'}`

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <CheckCircle size={48} className="text-[#159447] mb-3" />
        <h3 className="text-white font-bold text-lg mb-2">
          {lang === 'hi' ? 'पूछताछ प्राप्त हुई!' : 'Enquiry Received!'}
        </h3>
        <p className="text-blue-100 text-sm leading-relaxed max-w-xs">
          {lang === 'hi'
            ? 'धन्यवाद। हम जल्द आपसे संपर्क करेंगे।'
            : 'Thank you. Your appointment enquiry has been received. We will contact you soon.'}
        </p>
        <button onClick={() => setSubmitted(false)} className="mt-4 text-[#5BC8F5] text-sm hover:underline">
          {lang === 'hi' ? 'एक और सबमिट करें' : 'Submit another'}
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2.5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <input name="name" value={form.name} onChange={handleChange}
          placeholder={lang === 'hi' ? 'आपका नाम *' : 'Your Name *'} className={inp('name')} />
        <input name="phone" value={form.phone} onChange={handleChange}
          placeholder={lang === 'hi' ? 'फोन नंबर *' : 'Phone Number *'} className={inp('phone')} />
        <input type="email" name="email" value={form.email} onChange={handleChange}
          placeholder={lang === 'hi' ? 'ईमेल (वैकल्पिक)' : 'Email (Optional)'} className={inp('email')} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <select name="service_id" value={form.service_id} onChange={handleChange} className={`${inp('service_id')} text-gray-500`}>
          <option value="">{lang === 'hi' ? 'सेवा चुनें' : 'Select Service'}</option>
          {services.map(s => <option key={s.id} value={s.id}>{lang === 'hi' && s.title_hi ? s.title_hi : s.title}</option>)}
        </select>
        <input type="date" name="preferred_date" value={form.preferred_date} onChange={handleChange}
          min={new Date().toISOString().split('T')[0]} className={inp('preferred_date')} />
        <input type="time" name="preferred_time" value={form.preferred_time} onChange={handleChange} className={inp('preferred_time')} />
      </div>
      <input name="message" value={form.message} onChange={handleChange}
        placeholder={lang === 'hi' ? 'आपका संदेश (वैकल्पिक)' : 'Your Message (Optional)'} className={inp('message')} />
      <button type="submit" disabled={submitting}
        className="w-full flex items-center justify-center gap-2 bg-[#159447] hover:bg-[#117a3a] text-white font-bold py-3 rounded-md transition-colors text-sm disabled:opacity-60">
        {submitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send size={16} />}
        {lang === 'hi' ? 'पूछताछ भेजें →' : 'Submit Enquiry →'}
      </button>
    </form>
  )
}

export default function HomePage() {
  const [homepage, setHomepage] = useState({})
  const [settings, setSettings] = useState({})
  const [services, setServices] = useState([])
  const [allServices, setAllServices] = useState([])
  const [benefits, setBenefits] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [gallery, setGallery] = useState([])
  const [videos, setVideos] = useState([])
  const [faqs, setFaqs] = useState([])
  const [activeVideo, setActiveVideo] = useState(null)
  const [activeFaq, setActiveFaq] = useState(null)
  const [loading, setLoading] = useState(true)
  const { t, lang } = useLanguage()
  const servicesScrollRef = useRef(null)

  useEffect(() => {
    Promise.all([
      getHomepageSettings(), getWebsiteSettings(), getPublishedServices(),
      getPublishedBenefits(), getPublishedTestimonials(), getPublishedGallery(),
      getPublishedVideos(), getPublishedFaqs()
    ]).then(([home, site, svcs, bens, tests, gals, vids, fqs]) => {
      setHomepage(home)
      setSettings(site)
      setAllServices(svcs)
      setServices(svcs.slice(0, 8))
      setBenefits(bens.slice(0, 6))
      setTestimonials(tests.slice(0, 3))
      setGallery(gals.slice(0, 6))
      setVideos(vids.slice(0, 3))
      setFaqs(fqs.slice(0, 5))
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

  const phone = settings.phone || '+91 88711 93506'
  const whatsapp = settings.whatsapp || '+91 88711 93506'
  const whatsappLink = `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#0877B8] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>{settings.seo_title || 'Home Visit Neurotherapy Service in Bhopal | Neurotherapist Naveen Sharma'}</title>
        <meta name="description" content={settings.seo_description || 'Professional neurotherapy home visit wellness. Appointment-based supportive care for mobility, comfort and well-being by Naveen Sharma, Bhopal.'} />
      </Helmet>

      {/* HERO — desktop + mobile images with clickable overlays */}
      <section className="w-full bg-[#e8f4fb]">
        {/* Desktop */}
        <div className="relative hidden md:block w-full">
          <img
            key={lang}
            src={homepage.hero_image || (lang === 'hi' ? '/hero-hi.png' : '/hero.png')}
            alt="Neurotherapy for Better Movement and Healthier Living – Home Visit Only"
            className="w-full h-auto block"
            style={{ maxHeight: '600px', objectFit: 'cover', objectPosition: 'center top' }}
            loading="eager"
          />
          <Link to="/appointment" className="absolute cursor-pointer"
            style={{ top: '60%', left: '2%', width: '22%', height: '12%' }}
            aria-label="Book Appointment" />
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
            className="absolute cursor-pointer"
            style={{ top: '74%', left: '2%', width: '18%', height: '12%' }}
            aria-label="Send Enquiry on WhatsApp" />
        </div>
        {/* Mobile */}
        <div className="relative block md:hidden w-full">
          <img
            key={`mobile-${lang}`}
            src={lang === 'hi' ? '/hero-mobile-hi.png' : (homepage.hero_image_mobile || '/hero-mobile.png')}
            alt="Neurotherapy Home Visit – Appointment Based"
            className="w-full h-auto block"
            loading="eager"
          />
          <Link to="/appointment" className="absolute left-[5%] right-[5%] cursor-pointer"
            style={{ top: '73.5%', height: '6%' }} aria-label="Book Appointment" />
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
            className="absolute left-[5%] right-[5%] cursor-pointer"
            style={{ top: '81%', height: '6%' }} aria-label="Send Enquiry on WhatsApp" />
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-[#063B63]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {lang === 'hi' ? 'हमारी सेवाएं' : 'Our Services'}
                <span className="inline-block ml-2 w-8 h-[3px] bg-[#063B63] rounded-full align-middle" />
              </h2>
              <p className="text-[#7A9BB5] text-xs mt-0.5">
                {lang === 'hi' ? 'एक स्वस्थ जीवन के लिए सहायक देखभाल' : 'Supportive care for a healthier, more active life'}
              </p>
            </div>
            <Link to="/services" className="flex items-center gap-1 text-[#0877B8] text-xs font-semibold hover:underline whitespace-nowrap">
              {lang === 'hi' ? 'सभी देखें' : 'View All'} <ChevronRight size={13} />
            </Link>
          </div>
          {services.length === 0 ? (
            <div className="text-center py-10 text-[#7A9BB5] text-sm">
              {lang === 'hi' ? 'अभी कोई सेवा नहीं है।' : 'No services yet. Add services from the admin panel.'}
            </div>
          ) : (
            <div className="relative">
              <div ref={servicesScrollRef}
                className="flex gap-3 overflow-x-auto pb-2"
                style={{ scrollbarWidth: 'none' }}>
                {services.map((service, i) => (
                  <motion.div key={service.id}
                    initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                    className="flex-shrink-0 w-[150px] sm:w-[170px]">
                    <Link to={`/services/${service.slug}`}
                      className="flex flex-col bg-white rounded-xl border border-gray-100 hover:border-[#c5e0f5] hover:shadow-lg transition-all group overflow-hidden h-full">
                      <div className="h-[85px] bg-gradient-to-br from-[#eaf4fb] to-[#dff0f8] overflow-hidden flex-shrink-0">
                        {service.image
                          ? <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                          : <div className="w-full h-full flex items-center justify-center text-4xl">🩺</div>}
                      </div>
                      <div className="p-2.5 flex flex-col flex-1">
                        <h3 className="font-bold text-[#063B63] text-[12px] leading-snug mb-1 group-hover:text-[#0877B8] transition-colors">
                          {lang === 'hi' && service.title_hi ? service.title_hi : service.title}
                        </h3>
                        <p className="text-[#7A9BB5] text-[11px] leading-relaxed line-clamp-2 flex-1">
                          {lang === 'hi' && service.short_description_hi ? service.short_description_hi : service.short_description}
                        </p>
                        <div className="mt-2 w-6 h-6 bg-[#eaf4fb] group-hover:bg-[#0877B8] rounded-full flex items-center justify-center transition-colors">
                          <ArrowRight size={11} className="text-[#0877B8] group-hover:text-white transition-colors" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
              <div className="absolute right-0 top-0 flex gap-1">
                <button onClick={() => servicesScrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' })}
                  className="w-7 h-7 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50">
                  <ChevronRight size={13} className="rotate-180 text-[#3D5A73]" />
                </button>
                <button onClick={() => servicesScrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' })}
                  className="w-7 h-7 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50">
                  <ChevronRight size={13} className="text-[#3D5A73]" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ABOUT + APPOINTMENT FORM */}
      <section className="py-10 bg-[#f5fafc]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* About */}
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
              <h2 className="text-xl font-bold text-[#063B63] mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {homepage.about_heading || (lang === 'hi' ? 'न्यूरोथेरेपी के बारे में' : 'About Neurotherapy')}
              </h2>
              <div className="flex flex-col sm:flex-row sm:gap-4 items-start gap-4">
                <div className="relative w-full sm:w-[160px] flex-shrink-0">
                  {homepage.about_image ? (
                    <img src={homepage.about_image} alt="About neurotherapy"
                      className="w-full sm:w-[160px] h-40 sm:h-[175px] object-cover rounded-2xl shadow-md" />
                  ) : (
                    <div className="w-full sm:w-[160px] h-40 sm:h-[175px] bg-gradient-to-br from-[#c5e8d5] to-[#bde5f8] rounded-2xl flex items-center justify-center shadow-md">
                      <div className="text-center p-3">
                        <div className="text-4xl mb-1">🌿</div>
                        <p className="text-[#063B63] font-bold text-[10px] leading-tight">Natural Care<br/>for a Healthier<br/>Tomorrow</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-[#159447] rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white text-lg">🌿</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-[#4a6070] text-sm leading-relaxed mb-4">
                    {homepage.about_description || (lang === 'hi'
                      ? 'न्यूरोथेरेपी एक प्राकृतिक दृष्टिकोण है जो शरीर की गतिशीलता और समग्र वेलनेस को बेहतर बनाने पर ध्यान केंद्रित करता है।'
                      : "Neurotherapy is a natural and holistic approach that focuses on supporting the body's natural functions, improving mobility and enhancing overall well-being.")}
                  </p>
                  <Link to={homepage.about_btn_url || '/about'}
                    className="inline-flex items-center gap-2 bg-[#063B63] hover:bg-[#0877B8] text-white font-bold px-5 py-2.5 rounded-md text-sm transition-colors">
                    {homepage.about_btn_text || (lang === 'hi' ? 'और पढ़ें' : 'Read More')} <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Appointment Form */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
              <div className="bg-[#0a2240] rounded-2xl p-5 shadow-xl">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 bg-[#159447]/20 rounded-lg flex items-center justify-center">
                    <Calendar size={14} className="text-[#5BD88A]" />
                  </div>
                  <h3 className="text-white font-bold text-base">
                    {lang === 'hi' ? 'अपॉइंटमेंट बुक करें' : 'Book an Appointment'}
                  </h3>
                </div>
                <p className="text-blue-300 text-xs mb-4">
                  {lang === 'hi' ? 'विवरण भरें और हम जल्द संपर्क करेंगे।' : 'Fill in the details and we will get back to you soon.'}
                </p>
                <InlineAppointmentForm services={allServices} />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      {benefits.length > 0 && (
        <section className="py-10 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-[#063B63]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {lang === 'hi' ? 'होम विजिट केयर क्यों चुनें?' : 'Why Choose Home Visit Care?'}
              </h2>
            </div>
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {benefits.map(benefit => (
                <motion.div key={benefit.id} variants={fadeUp}
                  className="flex items-start gap-3 bg-[#f5fafc] rounded-xl p-4 border border-blue-50 hover:border-[#c5e0f5] transition-all">
                  <div className="text-2xl flex-shrink-0">{benefit.icon || '✨'}</div>
                  <div>
                    <h3 className="font-bold text-[#063B63] text-sm mb-1">
                      {lang === 'hi' && benefit.title_hi ? benefit.title_hi : benefit.title}
                    </h3>
                    <p className="text-[#7A9BB5] text-xs leading-relaxed">
                      {lang === 'hi' && benefit.description_hi ? benefit.description_hi : benefit.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            <div className="text-center mt-5">
              <Link to="/benefits" className="inline-flex items-center gap-2 border border-[#0877B8] text-[#0877B8] text-sm font-semibold px-5 py-2.5 rounded-md hover:bg-[#0877B8] hover:text-white transition-all">
                {lang === 'hi' ? 'सभी लाभ देखें' : 'View All Benefits'} <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      <section className="py-10 bg-[#f5fafc]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-[#063B63]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {lang === 'hi' ? 'हमारे मरीज़ क्या कहते हैं' : 'What Our Patients Say'}
              </h2>
              <p className="text-[#7A9BB5] text-xs mt-0.5">
                {lang === 'hi' ? 'वास्तविक अनुभव, वास्तविक लोगों से' : 'Real experiences from people we have supported'}
              </p>
            </div>
            <Link to="/testimonials" className="text-[#0877B8] text-xs font-semibold hover:underline whitespace-nowrap hidden sm:block">
              {lang === 'hi' ? 'सभी देखें →' : 'View All →'}
            </Link>
          </div>
          {testimonials.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: lang === 'hi' ? 'राजेश कुमार' : 'Rajesh Kumar', text: lang === 'hi' ? 'न्यूरोथेरेपी ने मेरी गर्दन के दर्द में बहुत राहत दी।' : 'Neurotherapy has provided great relief for my neck pain. The home visit service is very convenient.', rating: 5 },
                { name: lang === 'hi' ? 'सुनीता देवी' : 'Sunita Devi', text: lang === 'hi' ? 'घर पर आकर देखभाल करना बहुत अच्छा लगा।' : 'Receiving care at home was wonderful. Got great relief from back pain.', rating: 5 },
                { name: lang === 'hi' ? 'अमित शर्मा' : 'Amit Sharma', text: lang === 'hi' ? 'बहुत पेशेवर और कोमल देखभाल।' : 'Very professional and gentle care. Improvement in knee pain noticed.', rating: 4 },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <StarRating rating={item.rating} />
                  <p className="text-[#4a6070] text-sm mt-3 mb-4 leading-relaxed italic">"{item.text}"</p>
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0877B8] to-[#159A8C] flex items-center justify-center text-white text-xs font-bold">
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-[#063B63] font-bold text-sm">{item.name}</div>
                      <div className="text-[#7A9BB5] text-xs">{lang === 'hi' ? 'सत्यापित मरीज़' : 'Verified Patient'}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {testimonials.map(item => (
                <motion.div key={item.id} variants={fadeUp}
                  className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                  <StarRating rating={item.rating} />
                  <p className="text-[#4a6070] text-sm mt-3 mb-4 leading-relaxed italic line-clamp-4">"{item.testimonial}"</p>
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                    {item.image
                      ? <img src={item.image} alt={item.patient_name} className="w-8 h-8 rounded-full object-cover" />
                      : <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0877B8] to-[#159A8C] flex items-center justify-center text-white text-xs font-bold">{item.patient_name?.charAt(0)}</div>}
                    <div>
                      <div className="text-[#063B63] font-bold text-sm">{item.patient_name}</div>
                      <div className="text-[#7A9BB5] text-xs">{lang === 'hi' ? 'सत्यापित मरीज़' : 'Verified Patient'}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
          <div className="text-center mt-5">
            <Link to="/testimonials" className="inline-flex items-center gap-2 border border-[#0877B8] text-[#0877B8] text-sm font-semibold px-5 py-2.5 rounded-md hover:bg-[#0877B8] hover:text-white transition-all">
              {lang === 'hi' ? 'सभी प्रशंसापत्र देखें' : 'View All Testimonials'} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-end justify-between mb-4">
            <h2 className="text-xl font-bold text-[#063B63]" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {lang === 'hi' ? 'हमारी गैलरी' : 'Our Gallery'}
            </h2>
            <Link to="/gallery" className="text-[#0877B8] text-xs font-semibold hover:underline">
              {lang === 'hi' ? 'सभी देखें →' : 'View All →'}
            </Link>
          </div>
          {gallery.length === 0 ? (
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {[
                { bg: 'from-[#cce8f8] to-[#b3d9f0]', icon: '🏥', label: lang === 'hi' ? 'थेरेपी' : 'Therapy' },
                { bg: 'from-[#c5e8d5] to-[#a8d9c2]', icon: '🌿', label: lang === 'hi' ? 'प्राकृतिक' : 'Natural' },
                { bg: 'from-[#d4e8fb] to-[#bdd5f0]', icon: '🤲', label: lang === 'hi' ? 'होम विजिट' : 'Home Visit' },
                { bg: 'from-[#e0f0d0] to-[#c5e0b5]', icon: '💆', label: lang === 'hi' ? 'वेलनेस' : 'Wellness' },
                { bg: 'from-[#cce8f8] to-[#b3d9f0]', icon: '🩺', label: lang === 'hi' ? 'देखभाल' : 'Care' },
                { bg: 'from-[#fde8cc] to-[#f5d5a8]', icon: '❤️', label: lang === 'hi' ? 'स्वास्थ्य' : 'Health' },
              ].map((item, i) => (
                <Link to="/gallery" key={i}
                  className={`aspect-square overflow-hidden rounded-xl group bg-gradient-to-br ${item.bg} flex flex-col items-center justify-center border border-blue-100 hover:shadow-md transition-all`}>
                  <div className="text-3xl mb-1">{item.icon}</div>
                  <p className="text-[#063B63] text-[10px] font-semibold text-center px-1">{item.label}</p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {gallery.map(item => (
                <Link to="/gallery" key={item.id} className="relative aspect-square overflow-hidden rounded-xl group">
                  <img src={item.image} alt={item.title || 'Gallery'}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" loading="lazy" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* VIDEOS */}
      {videos.length > 0 && (
        <section className="py-10 bg-[#f5fafc]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-end justify-between mb-4">
              <h2 className="text-xl font-bold text-[#063B63]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {lang === 'hi' ? 'जानकारीपूर्ण वीडियो' : 'Informational Videos'}
              </h2>
              <Link to="/videos" className="text-[#0877B8] text-xs font-semibold hover:underline">
                {lang === 'hi' ? 'सभी देखें →' : 'View All →'}
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {videos.map(video => {
                const thumb = video.thumbnail || getYouTubeThumbnail(video.video_url)
                return (
                  <button key={video.id} onClick={() => setActiveVideo(video)}
                    className="group text-left bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all">
                    <div className="relative h-40 bg-gray-100 overflow-hidden">
                      {thumb
                        ? <img src={thumb} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                        : <div className="w-full h-full bg-gradient-to-br from-[#063B63] to-[#0877B8] flex items-center justify-center"><Play size={36} className="text-white" /></div>}
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 flex items-center justify-center transition-all">
                        <div className="w-11 h-11 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play size={16} className="text-[#063B63] ml-1" />
                        </div>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-bold text-[#063B63] text-xs line-clamp-2">{video.title}</h3>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="py-10 bg-white">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-xl font-bold text-[#063B63] mb-5 text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {lang === 'hi' ? 'अक्सर पूछे जाने वाले प्रश्न' : 'Frequently Asked Questions'}
            </h2>
            <div className="space-y-2">
              {faqs.map(faq => (
                <div key={faq.id} className="border border-gray-100 rounded-xl overflow-hidden bg-[#f5fafc]">
                  <button onClick={() => setActiveFaq(activeFaq === faq.id ? null : faq.id)}
                    className="w-full flex items-center justify-between px-4 py-3.5 text-left gap-3">
                    <span className="font-semibold text-[#063B63] text-sm">
                      {lang === 'hi' && faq.question_hi ? faq.question_hi : faq.question}
                    </span>
                    <ChevronRight size={16} className={`flex-shrink-0 text-[#0877B8] transition-transform duration-200 ${activeFaq === faq.id ? 'rotate-90' : ''}`} />
                  </button>
                  {activeFaq === faq.id && (
                    <div className="px-4 pb-4 text-[#4a6070] text-sm leading-relaxed border-t border-gray-100 pt-3 bg-white">
                      {lang === 'hi' && faq.answer_hi ? faq.answer_hi : faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="text-center mt-4">
              <Link to="/faqs" className="text-[#0877B8] text-sm font-semibold hover:underline">
                {lang === 'hi' ? 'सभी प्रश्न देखें →' : 'View All FAQs →'}
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-12 bg-gradient-to-r from-[#063B63] to-[#0877B8]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-white font-bold text-2xl mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {homepage.cta_heading || (lang === 'hi' ? 'अपनी वेलनेस यात्रा शुरू करें?' : 'Ready to Start Your Wellness Journey?')}
          </h2>
          <p className="text-blue-200 text-sm mb-6">
            {homepage.cta_description || (lang === 'hi' ? 'आज ही होम विजिट अपॉइंटमेंट बुक करें। हम आपके घर आते हैं।' : 'Book your home visit appointment today. We come to you.')}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/appointment"
              className="inline-flex items-center gap-2 bg-white text-[#063B63] font-bold px-6 py-3 rounded-md hover:shadow-lg transition-all text-sm">
              <Calendar size={16} /> {lang === 'hi' ? 'अपॉइंटमेंट बुक करें' : 'Book Appointment'}
            </Link>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white font-bold px-6 py-3 rounded-md hover:shadow-lg transition-all text-sm">
              <MessageCircle size={16} /> WhatsApp
            </a>
            <a href={`tel:${phone}`}
              className="inline-flex items-center gap-2 border-2 border-white/50 text-white font-bold px-6 py-3 rounded-md hover:bg-white/10 transition-all text-sm">
              <Phone size={16} /> {lang === 'hi' ? 'अभी कॉल करें' : 'Call Now'}
            </a>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4" onClick={() => setActiveVideo(null)}>
          <div className="relative w-full max-w-3xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <button onClick={() => setActiveVideo(null)}
              className="absolute top-3 right-3 z-10 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors">
              <X size={18} />
            </button>
            {activeVideo.video_url.includes('youtube') || activeVideo.video_url.includes('youtu.be') ? (
              <iframe src={getYouTubeEmbedUrl(activeVideo.video_url)} title={activeVideo.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen />
            ) : (
              <video src={activeVideo.video_url} controls autoPlay className="w-full h-full" />
            )}
          </div>
        </div>
      )}
    </>
  )
}
