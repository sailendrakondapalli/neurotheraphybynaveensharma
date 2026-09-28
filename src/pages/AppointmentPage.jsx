import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Calendar, Send, CheckCircle, Phone, MessageCircle } from 'lucide-react'
import { submitAppointment, getPublishedServices, getWebsiteSettings } from '../services/neurotherapyService'
import { useLanguage } from '../lib/LanguageContext'
import toast from 'react-hot-toast'
import { useSearchParams } from 'react-router-dom'

const TIME_SLOTS = [
  '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM',
]

export default function AppointmentPage() {
  const [services, setServices] = useState([])
  const [settings, setSettings] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [searchParams] = useSearchParams()
  const preselectedService = searchParams.get('service') || ''
  const { lang, t } = useLanguage()

  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    service_id: '', service_name: preselectedService,
    preferred_date: '', preferred_time: '', message: '',
  })

  useEffect(() => {
    Promise.all([getPublishedServices(), getWebsiteSettings()])
      .then(([s, w]) => { setServices(s); setSettings(w) })
      .catch(console.error)
  }, [])

  // If service preselected, match it
  useEffect(() => {
    if (preselectedService && services.length > 0) {
      const match = services.find(s => s.title === preselectedService || s.title_hi === preselectedService)
      if (match) setForm(f => ({ ...f, service_id: match.id, service_name: match.title }))
    }
  }, [preselectedService, services])

  const phone = settings.phone || '+91 88711 93506'
  const whatsapp = settings.whatsapp || '+91 88711 93506'
  const whatsappLink = `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = t.appointment.required
    if (!form.phone.trim()) errs.phone = t.appointment.required
    if (!form.phone.match(/^[0-9+\s-]{7,15}$/)) errs.phone = lang === 'hi' ? 'à¤…à¤®à¤¾à¤¨à¥à¤¯ à¤«à¥‹à¤¨ à¤¨à¤‚à¤¬à¤°' : 'Invalid phone number'
    if (form.email && !form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = lang === 'hi' ? 'à¤…à¤®à¤¾à¤¨à¥à¤¯ à¤ˆà¤®à¥‡à¤²' : 'Invalid email'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'service_id') {
      const svc = services.find(s => s.id === value)
      setForm(f => ({ ...f, service_id: value, service_name: svc?.title || '' }))
    } else {
      setForm(f => ({ ...f, [name]: value }))
    }
    setErrors(e => ({ ...e, [name]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      await submitAppointment({
        name: form.name,
        phone: form.phone,
        email: form.email || null,
        service_id: form.service_id || null,
        service_name: form.service_name || null,
        preferred_date: form.preferred_date || null,
        preferred_time: form.preferred_time || null,
        message: form.message || null,
      })
      setSubmitted(true)
    } catch (err) {
      toast.error(lang === 'hi' ? 'à¤¸à¤¬à¤®à¤¿à¤Ÿ à¤•à¤°à¤¨à¥‡ à¤®à¥‡à¤‚ à¤¤à¥à¤°à¥à¤Ÿà¤¿à¥¤ à¤•à¥ƒà¤ªà¤¯à¤¾ à¤ªà¥à¤¨à¤ƒ à¤ªà¥à¤°à¤¯à¤¾à¤¸ à¤•à¤°à¥‡à¤‚à¥¤' : 'Error submitting. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputCls = (field) =>
    `w-full px-4 py-3 rounded-xl border text-[#12304A] text-sm focus:outline-none focus:ring-2 focus:ring-[#0877B8]/30 focus:border-[#0877B8] transition-all ${errors[field] ? 'border-red-300 bg-red-50' : 'border-[#D4E8F0] bg-[#F5FAFC]'}`

  return (
    <>
      <Helmet>
        <title>{lang === 'hi' ? 'à¤…à¤ªà¥‰à¤‡à¤‚à¤Ÿà¤®à¥‡à¤‚à¤Ÿ â€“ Neurotherapist Naveen Sharma' : 'Book Appointment â€“ Neurotherapist Naveen Sharma'}</title>
        <meta name="description" content="Book a neurotherapy home visit appointment online." />
      </Helmet>

      <div className="bg-gradient-to-br from-[#063B63] to-[#0877B8] text-white py-10 md:py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4">{t.appointment.title}</h1>
          <p className="text-blue-100 text-base md:text-lg max-w-2xl mx-auto">{t.appointment.subtitle}</p>
          <div className="flex items-center justify-center gap-4 mt-5 flex-wrap">
            <span className="bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm font-semibold">ðŸ  {t.common.homeVisitOnly}</span>
            <span className="bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm font-semibold">ðŸ“… {t.common.appointmentBased}</span>
          </div>
        </div>
      </div>

      <section className="py-10 md:py-16 bg-[#F5FAFC]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              {submitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-2xl border border-green-100 p-10 text-center shadow-sm">
                  <CheckCircle size={60} className="text-green-500 mx-auto mb-4" />
                  <h2 className="text-[#063B63] font-bold text-2xl mb-3">
                    {lang === 'hi' ? 'à¤ªà¥‚à¤›à¤¤à¤¾à¤› à¤ªà¥à¤°à¤¾à¤ªà¥à¤¤ à¤¹à¥à¤ˆ!' : 'Enquiry Received!'}
                  </h2>
                  <p className="text-[#3D5A73] leading-relaxed">{t.appointment.success}</p>
                  <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                    <a href={`tel:${phone}`} className="inline-flex items-center justify-center gap-2 bg-[#063B63] text-white font-semibold px-5 py-3 rounded-full hover:shadow-lg transition-all text-sm">
                      <Phone size={16} /> {t.common.callNow}
                    </a>
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-semibold px-5 py-3 rounded-full hover:shadow-lg transition-all text-sm">
                      <MessageCircle size={16} /> WhatsApp
                    </a>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-blue-100 p-6 shadow-sm space-y-5">
                  <h2 className="text-[#063B63] font-bold text-xl mb-1">{lang === 'hi' ? 'à¤…à¤ªà¤¨à¥€ à¤œà¤¾à¤¨à¤•à¤¾à¤°à¥€ à¤­à¤°à¥‡à¤‚' : 'Fill in Your Details'}</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#063B63] mb-1.5">{t.appointment.name} *</label>
                      <input type="text" name="name" value={form.name} onChange={handleChange}
                        placeholder={lang === 'hi' ? 'à¤†à¤ªà¤•à¤¾ à¤ªà¥‚à¤°à¤¾ à¤¨à¤¾à¤®' : 'Your full name'}
                        className={inputCls('name')} />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#063B63] mb-1.5">{t.appointment.phone} *</label>
                      <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                        placeholder="+91 XXXXX XXXXX"
                        className={inputCls('phone')} />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#063B63] mb-1.5">{t.appointment.email}</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange}
                      placeholder={lang === 'hi' ? 'à¤ˆà¤®à¥‡à¤² (à¤µà¥ˆà¤•à¤²à¥à¤ªà¤¿à¤•)' : 'Email (optional)'}
                      className={inputCls('email')} />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#063B63] mb-1.5">{t.appointment.service}</label>
                    <select name="service_id" value={form.service_id} onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-[#D4E8F0] bg-[#F5FAFC] text-[#12304A] text-sm focus:outline-none focus:ring-2 focus:ring-[#0877B8]/30 focus:border-[#0877B8] transition-all">
                      <option value="">{lang === 'hi' ? 'à¤¸à¥‡à¤µà¤¾ à¤šà¥à¤¨à¥‡à¤‚ (à¤µà¥ˆà¤•à¤²à¥à¤ªà¤¿à¤•)' : 'Select a service (optional)'}</option>
                      {services.map(s => (
                        <option key={s.id} value={s.id}>{lang === 'hi' && s.title_hi ? s.title_hi : s.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#063B63] mb-1.5">{t.appointment.date}</label>
                      <input type="date" name="preferred_date" value={form.preferred_date} onChange={handleChange}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 rounded-xl border border-[#D4E8F0] bg-[#F5FAFC] text-[#12304A] text-sm focus:outline-none focus:ring-2 focus:ring-[#0877B8]/30 focus:border-[#0877B8] transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#063B63] mb-1.5">{t.appointment.time}</label>
                      <select name="preferred_time" value={form.preferred_time} onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-[#D4E8F0] bg-[#F5FAFC] text-[#12304A] text-sm focus:outline-none focus:ring-2 focus:ring-[#0877B8]/30 focus:border-[#0877B8] transition-all">
                        <option value="">{lang === 'hi' ? 'à¤¸à¤®à¤¯ à¤šà¥à¤¨à¥‡à¤‚' : 'Select a time'}</option>
                        {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#063B63] mb-1.5">{t.appointment.message}</label>
                    <textarea name="message" value={form.message} onChange={handleChange}
                      rows={4} placeholder={lang === 'hi' ? 'à¤•à¥‹à¤ˆ à¤…à¤¤à¤¿à¤°à¤¿à¤•à¥à¤¤ à¤œà¤¾à¤¨à¤•à¤¾à¤°à¥€...' : 'Any additional information...'}
                      className="w-full px-4 py-3 rounded-xl border border-[#D4E8F0] bg-[#F5FAFC] text-[#12304A] text-sm focus:outline-none focus:ring-2 focus:ring-[#0877B8]/30 focus:border-[#0877B8] transition-all resize-none" />
                  </div>

                  <button type="submit" disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#063B63] to-[#0877B8] text-white font-bold py-4 rounded-xl hover:shadow-lg transition-all disabled:opacity-60 text-sm">
                    {submitting ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send size={18} />}
                    {t.appointment.submit}
                  </button>

                  <p className="text-[#7A9BB5] text-xs text-center">
                    {lang === 'hi' ? '* à¤¹à¤® à¤œà¤²à¥à¤¦ à¤¹à¥€ à¤†à¤ªà¤¸à¥‡ à¤¸à¤‚à¤ªà¤°à¥à¤• à¤•à¤°à¥‡à¤‚à¤—à¥‡à¥¤' : '* We will contact you to confirm your appointment.'}
                  </p>
                </form>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-blue-50">
                <h3 className="font-bold text-[#063B63] mb-4">{lang === 'hi' ? 'à¤¸à¥€à¤§à¥‡ à¤¸à¤‚à¤ªà¤°à¥à¤• à¤•à¤°à¥‡à¤‚' : 'Contact Directly'}</h3>
                <a href={`tel:${phone}`}
                  className="flex items-center gap-3 bg-[#063B63] text-white rounded-xl p-3.5 mb-3 hover:bg-[#0877B8] transition-colors">
                  <Phone size={18} />
                  <div>
                    <div className="text-xs text-blue-200">{t.common.callNow}</div>
                    <div className="font-semibold text-sm">{phone}</div>
                  </div>
                </a>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-[#25D366] text-white rounded-xl p-3.5 hover:bg-[#1ebc5a] transition-colors">
                  <MessageCircle size={18} />
                  <div>
                    <div className="text-xs text-green-100">WhatsApp</div>
                    <div className="font-semibold text-sm">{whatsapp}</div>
                  </div>
                </a>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-blue-50">
                <h3 className="font-bold text-[#063B63] mb-3 text-sm">{lang === 'hi' ? 'à¤ªà¥à¤°à¤•à¥à¤°à¤¿à¤¯à¤¾' : 'How It Works'}</h3>
                <div className="space-y-3">
                  {[
                    { n: 1, text: lang === 'hi' ? 'à¤«à¥‰à¤°à¥à¤® à¤­à¤°à¥‡à¤‚' : 'Fill the form' },
                    { n: 2, text: lang === 'hi' ? 'à¤¹à¤® à¤†à¤ªà¤¸à¥‡ à¤¸à¤‚à¤ªà¤°à¥à¤• à¤•à¤°à¤¤à¥‡ à¤¹à¥ˆà¤‚' : 'We contact you' },
                    { n: 3, text: lang === 'hi' ? 'à¤…à¤ªà¥‰à¤‡à¤‚à¤Ÿà¤®à¥‡à¤‚à¤Ÿ à¤¤à¤¯ à¤¹à¥‹à¤¤à¥€ à¤¹à¥ˆ' : 'Appointment confirmed' },
                    { n: 4, text: lang === 'hi' ? 'à¤¹à¤® à¤†à¤ªà¤•à¥‡ à¤˜à¤° à¤†à¤¤à¥‡ à¤¹à¥ˆà¤‚' : 'We visit your home' },
                  ].map(step => (
                    <div key={step.n} className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#063B63] to-[#0877B8] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {step.n}
                      </div>
                      <span className="text-[#3D5A73] text-sm">{step.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                <p className="text-amber-800 text-xs leading-relaxed">
                  âš ï¸ {lang === 'hi'
                    ? 'à¤¯à¤¹ à¤à¤• à¤¹à¥‹à¤® à¤µà¤¿à¤œà¤¿à¤Ÿ à¤¸à¥‡à¤µà¤¾ à¤¹à¥ˆà¥¤ à¤•à¥‹à¤ˆ à¤¸à¤¾à¤°à¥à¤µà¤œà¤¨à¤¿à¤• à¤•à¥à¤²à¤¿à¤¨à¤¿à¤• à¤ªà¤¤à¤¾ à¤¨à¤¹à¥€à¤‚ à¤¹à¥ˆà¥¤ à¤¸à¤­à¥€ à¤¸à¤¤à¥à¤° à¤ªà¥‚à¤°à¥à¤µ à¤…à¤ªà¥‰à¤‡à¤‚à¤Ÿà¤®à¥‡à¤‚à¤Ÿ à¤ªà¤° à¤†à¤¯à¥‹à¤œà¤¿à¤¤ à¤•à¤¿à¤ à¤œà¤¾à¤¤à¥‡ à¤¹à¥ˆà¤‚à¥¤'
                    : 'This is a home visit service. There is no public clinic address. All sessions are by prior appointment only.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}


