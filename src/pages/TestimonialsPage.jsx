import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Star, Send, CheckCircle } from 'lucide-react'
import { getPublishedTestimonials, submitTestimonial } from '../services/neurotherapyService'
import { useLanguage } from '../lib/LanguageContext'
import toast from 'react-hot-toast'

const fadeUp = { hidden: { opacity: 0, y: 25 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }
const stagger = { show: { transition: { staggerChildren: 0.1 } } }

function StarRating({ rating = 5 }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={15} className={i <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'} />
      ))}
    </div>
  )
}

function StarSelector({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(i => (
        <button key={i} type="button" onClick={() => onChange(i)}
          className={`text-2xl transition-transform hover:scale-110 ${i <= value ? 'â­' : 'â˜†'}`}>
          {i <= value ? 'â­' : 'â˜†'}
        </button>
      ))}
    </div>
  )
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ patient_name: '', email: '', phone: '', testimonial: '', rating: 5 })
  const [errors, setErrors] = useState({})
  const { lang, t } = useLanguage()

  useEffect(() => {
    getPublishedTestimonials()
      .then(setTestimonials)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const validate = () => {
    const errs = {}
    if (!form.patient_name.trim()) errs.patient_name = t.appointment.required
    if (!form.testimonial.trim()) errs.testimonial = t.appointment.required
    if (form.email && !form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = lang === 'hi' ? 'à¤…à¤®à¤¾à¤¨à¥à¤¯ à¤ˆà¤®à¥‡à¤²' : 'Invalid email'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      await submitTestimonial(form)
      setSubmitted(true)
      setForm({ patient_name: '', email: '', phone: '', testimonial: '', rating: 5 })
    } catch (err) {
      toast.error(lang === 'hi' ? 'à¤¸à¤¬à¤®à¤¿à¤Ÿ à¤•à¤°à¤¨à¥‡ à¤®à¥‡à¤‚ à¤¤à¥à¤°à¥à¤Ÿà¤¿à¥¤ à¤•à¥ƒà¤ªà¤¯à¤¾ à¤ªà¥à¤¨à¤ƒ à¤ªà¥à¤°à¤¯à¤¾à¤¸ à¤•à¤°à¥‡à¤‚à¥¤' : 'Error submitting. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>{lang === 'hi' ? 'à¤ªà¥à¤°à¤¶à¤‚à¤¸à¤¾à¤ªà¤¤à¥à¤° â€“ Neurotherapist Naveen Sharma' : 'Testimonials â€“ Neurotherapist Naveen Sharma'}</title>
        <meta name="description" content="Read patient testimonials about our neurotherapy home visit wellness service." />
      </Helmet>

      <div className="bg-gradient-to-br from-[#063B63] to-[#0877B8] text-white py-10 md:py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block text-xs font-bold tracking-widest bg-white/15 rounded-full px-4 py-2 mb-4 text-blue-100">
            {lang === 'hi' ? 'à¤ªà¥à¤°à¤¶à¤‚à¤¸à¤¾à¤ªà¤¤à¥à¤°' : 'Testimonials'}
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4">
            {lang === 'hi' ? 'à¤°à¥‹à¤—à¤¿à¤¯à¥‹à¤‚ à¤•à¥‡ à¤…à¤¨à¥à¤­à¤µ' : 'Patient Experiences'}
          </h1>
          <p className="text-blue-100 text-base md:text-lg max-w-2xl mx-auto">
            {lang === 'hi' ? 'à¤µà¤¾à¤¸à¥à¤¤à¤µà¤¿à¤• à¤…à¤¨à¥à¤­à¤µ, à¤µà¤¾à¤¸à¥à¤¤à¤µà¤¿à¤• à¤²à¥‹à¤—à¥‹à¤‚ à¤¸à¥‡' : 'Real experiences from people we have supported on their wellness journey'}
          </p>
        </div>
      </div>

      {/* Testimonials Grid */}
      <section className="py-10 md:py-16 bg-[#F5FAFC] min-h-[40vh]">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-3 border-[#0877B8] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">ðŸ’¬</div>
              <p className="text-[#3D5A73] text-lg">{t.common.noContent}</p>
            </div>
          ) : (
            <motion.div initial="hidden" animate="show" variants={stagger}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {testimonials.map(item => (
                <motion.div key={item.id} variants={fadeUp}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-blue-50 hover:shadow-md transition-all flex flex-col">
                  <StarRating rating={item.rating} />
                  <p className="text-[#3D5A73] text-sm mt-3 mb-4 leading-relaxed italic flex-1">"{item.testimonial}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-blue-50">
                    {item.image ? (
                      <img src={item.image} alt={item.patient_name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0877B8] to-[#159A8C] flex items-center justify-center text-white font-bold text-sm">
                        {item.patient_name?.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="text-[#063B63] font-bold text-sm">{item.patient_name}</div>
                      <div className="text-[#7A9BB5] text-xs">{new Date(item.created_at).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', { year: 'numeric', month: 'long' })}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Submit Feedback Form */}
      <section className="py-10 md:py-16 bg-white">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-8">
            <span className="inline-block text-xs font-bold tracking-widest text-[#159A8C] uppercase bg-teal-50 rounded-full px-4 py-1.5 mb-3">
              {lang === 'hi' ? 'à¤…à¤ªà¤¨à¤¾ à¤…à¤¨à¥à¤­à¤µ à¤¸à¤¾à¤à¤¾ à¤•à¤°à¥‡à¤‚' : 'Share Your Experience'}
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-[#063B63]">{t.testimonial.shareTitle}</h2>
            <p className="text-[#3D5A73] mt-2 text-sm">{t.testimonial.shareSubtitle}</p>
          </div>

          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
              <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
              <h3 className="text-green-800 font-bold text-xl mb-2">
                {lang === 'hi' ? 'à¤§à¤¨à¥à¤¯à¤µà¤¾à¤¦!' : 'Thank you!'}
              </h3>
              <p className="text-green-700 text-sm leading-relaxed">{t.testimonial.success}</p>
              <button onClick={() => setSubmitted(false)}
                className="mt-5 text-[#0877B8] text-sm font-semibold hover:underline">
                {lang === 'hi' ? 'à¤¦à¥‚à¤¸à¤°à¥€ à¤ªà¥à¤°à¤¤à¤¿à¤•à¥à¤°à¤¿à¤¯à¤¾ à¤¸à¤¬à¤®à¤¿à¤Ÿ à¤•à¤°à¥‡à¤‚' : 'Submit Another Feedback'}
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-blue-100 p-6 shadow-sm space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#063B63] mb-1.5">{t.testimonial.name} *</label>
                  <input type="text" value={form.patient_name} onChange={e => setForm(f => ({...f, patient_name: e.target.value}))}
                    placeholder={lang === 'hi' ? 'à¤†à¤ªà¤•à¤¾ à¤¨à¤¾à¤®' : 'Your name'}
                    className={`w-full px-4 py-3 rounded-xl border text-[#12304A] text-sm focus:outline-none focus:ring-2 focus:ring-[#0877B8]/30 focus:border-[#0877B8] transition-all ${errors.patient_name ? 'border-red-300 bg-red-50' : 'border-[#D4E8F0] bg-[#F5FAFC]'}`} />
                  {errors.patient_name && <p className="text-red-500 text-xs mt-1">{errors.patient_name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#063B63] mb-1.5">{t.testimonial.email}</label>
                  <input type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))}
                    placeholder={lang === 'hi' ? 'à¤ˆà¤®à¥‡à¤² (à¤µà¥ˆà¤•à¤²à¥à¤ªà¤¿à¤•)' : 'Email (optional)'}
                    className={`w-full px-4 py-3 rounded-xl border text-[#12304A] text-sm focus:outline-none focus:ring-2 focus:ring-[#0877B8]/30 focus:border-[#0877B8] transition-all ${errors.email ? 'border-red-300 bg-red-50' : 'border-[#D4E8F0] bg-[#F5FAFC]'}`} />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#063B63] mb-1.5">{t.testimonial.phone}</label>
                <input type="tel" value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))}
                  placeholder={lang === 'hi' ? 'à¤«à¥‹à¤¨ (à¤µà¥ˆà¤•à¤²à¥à¤ªà¤¿à¤•)' : 'Phone (optional)'}
                  className="w-full px-4 py-3 rounded-xl border border-[#D4E8F0] bg-[#F5FAFC] text-[#12304A] text-sm focus:outline-none focus:ring-2 focus:ring-[#0877B8]/30 focus:border-[#0877B8] transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#063B63] mb-1.5">{t.testimonial.feedback} *</label>
                <textarea value={form.testimonial} onChange={e => setForm(f => ({...f, testimonial: e.target.value}))}
                  rows={4} placeholder={lang === 'hi' ? 'à¤…à¤ªà¤¨à¤¾ à¤…à¤¨à¥à¤­à¤µ à¤¸à¤¾à¤à¤¾ à¤•à¤°à¥‡à¤‚...' : 'Share your experience...'}
                  className={`w-full px-4 py-3 rounded-xl border text-[#12304A] text-sm focus:outline-none focus:ring-2 focus:ring-[#0877B8]/30 focus:border-[#0877B8] transition-all resize-none ${errors.testimonial ? 'border-red-300 bg-red-50' : 'border-[#D4E8F0] bg-[#F5FAFC]'}`} />
                {errors.testimonial && <p className="text-red-500 text-xs mt-1">{errors.testimonial}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#063B63] mb-2">{t.testimonial.rating}</label>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(i => (
                    <button key={i} type="button" onClick={() => setForm(f => ({...f, rating: i}))}
                      className="text-2xl hover:scale-110 transition-transform">
                      {i <= form.rating ? 'â­' : 'â˜†'}
                    </button>
                  ))}
                </div>
              </div>
              <button type="submit" disabled={submitting}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#063B63] to-[#0877B8] text-white font-bold py-3.5 rounded-xl hover:shadow-lg transition-all disabled:opacity-60">
                {submitting ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send size={17} />}
                {t.testimonial.submit}
              </button>
              <p className="text-[#7A9BB5] text-xs text-center">
                {lang === 'hi' ? '* à¤†à¤ªà¤•à¥€ à¤ªà¥à¤°à¤¤à¤¿à¤•à¥à¤°à¤¿à¤¯à¤¾ à¤ªà¥à¤°à¤•à¤¾à¤¶à¤¿à¤¤ à¤¹à¥‹à¤¨à¥‡ à¤¸à¥‡ à¤ªà¤¹à¤²à¥‡ à¤¸à¤®à¥€à¤•à¥à¤·à¤¾ à¤•à¥€ à¤œà¤¾à¤à¤—à¥€à¥¤' : '* Your feedback will be reviewed before being published.'}
              </p>
            </form>
          )}
        </div>
      </section>
    </>
  )
}


