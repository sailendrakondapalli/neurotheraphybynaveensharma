import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { ChevronRight, Calendar, MessageCircle } from 'lucide-react'
import { getPublishedFaqs, getWebsiteSettings } from '../services/neurotherapyService'
import { useLanguage } from '../lib/LanguageContext'

export default function FaqsPage() {
  const [faqs, setFaqs] = useState([])
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeFaq, setActiveFaq] = useState(null)
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)
  const { lang, t } = useLanguage()

  useEffect(() => {
    Promise.all([getPublishedFaqs(), getWebsiteSettings()])
      .then(([f, s]) => {
        setFaqs(f)
        setSettings(s)
        const cats = [...new Set(f.map(q => q.category).filter(Boolean))]
        setCategories(cats)
      }).catch(console.error).finally(() => setLoading(false))
  }, [])

  const whatsapp = settings.whatsapp || '+91 88711 93506'
  const whatsappLink = `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`

  const filtered = activeCategory === 'all' ? faqs : faqs.filter(f => f.category === activeCategory)

  return (
    <>
      <Helmet>
        <title>{lang === 'hi' ? 'à¤¸à¤¾à¤®à¤¾à¤¨à¥à¤¯ à¤ªà¥à¤°à¤¶à¥à¤¨ â€“ Neurotherapist Naveen Sharma' : 'FAQs â€“ Neurotherapist Naveen Sharma'}</title>
        <meta name="description" content="Frequently asked questions about neurotherapy home visit wellness." />
      </Helmet>

      <div className="bg-gradient-to-br from-[#063B63] to-[#0877B8] text-white py-10 md:py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4">
            {lang === 'hi' ? 'à¤…à¤•à¥à¤¸à¤° à¤ªà¥‚à¤›à¥‡ à¤œà¤¾à¤¨à¥‡ à¤µà¤¾à¤²à¥‡ à¤ªà¥à¤°à¤¶à¥à¤¨' : 'Frequently Asked Questions'}
          </h1>
          <p className="text-blue-100 text-lg">
            {lang === 'hi' ? 'à¤¹à¤®à¤¾à¤°à¥€ à¤¸à¥‡à¤µà¤¾à¤“à¤‚ à¤•à¥‡ à¤¬à¤¾à¤°à¥‡ à¤®à¥‡à¤‚ à¤†à¤ªà¤•à¥‡ à¤ªà¥à¤°à¤¶à¥à¤¨à¥‹à¤‚ à¤•à¥‡ à¤‰à¤¤à¥à¤¤à¤°' : 'Answers to your questions about our neurotherapy wellness service'}
          </p>
        </div>
      </div>

      {/* Category filters */}
      {categories.length > 0 && (
        <div className="bg-white border-b border-gray-100 py-4 px-4">
          <div className="max-w-4xl mx-auto flex items-center gap-2 overflow-x-auto pb-1">
            <button onClick={() => setActiveCategory('all')}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${activeCategory === 'all' ? 'bg-[#063B63] text-white' : 'bg-gray-100 text-[#3D5A73] hover:bg-gray-200'}`}>
              {lang === 'hi' ? 'à¤¸à¤­à¥€' : 'All'}
            </button>
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${activeCategory === cat ? 'bg-[#063B63] text-white' : 'bg-gray-100 text-[#3D5A73] hover:bg-gray-200'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      <section className="py-10 md:py-16 bg-[#F5FAFC] min-h-[60vh]">
        <div className="max-w-4xl mx-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-3 border-[#0877B8] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">â“</div>
              <p className="text-[#3D5A73]">{t.common.noContent}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((faq, i) => (
                <motion.div key={faq.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl border border-blue-50 overflow-hidden shadow-sm hover:shadow-md transition-all">
                  <button
                    onClick={() => setActiveFaq(activeFaq === faq.id ? null : faq.id)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left gap-4"
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <span className="text-[#0877B8] font-bold text-lg flex-shrink-0">Q</span>
                      <span className="font-semibold text-[#063B63] text-sm">
                        {lang === 'hi' && faq.question_hi ? faq.question_hi : faq.question}
                      </span>
                    </div>
                    <ChevronRight size={18} className={`flex-shrink-0 text-[#0877B8] transition-transform duration-200 ${activeFaq === faq.id ? 'rotate-90' : ''}`} />
                  </button>
                  {activeFaq === faq.id && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="px-5 pb-5 border-t border-blue-50">
                      <div className="flex items-start gap-3 pt-3">
                        <span className="text-[#159447] font-bold text-lg flex-shrink-0">A</span>
                        <p className="text-[#3D5A73] text-sm leading-relaxed">
                          {lang === 'hi' && faq.answer_hi ? faq.answer_hi : faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          {/* Still have questions */}
          <div className="mt-12 bg-gradient-to-br from-[#063B63] to-[#0877B8] rounded-2xl p-8 text-white text-center">
            <h3 className="text-xl font-bold mb-2">
              {lang === 'hi' ? 'à¤”à¤° à¤ªà¥à¤°à¤¶à¥à¤¨ à¤¹à¥ˆà¤‚?' : 'Still Have Questions?'}
            </h3>
            <p className="text-blue-100 text-sm mb-5">
              {lang === 'hi' ? 'à¤¹à¤®à¤¸à¥‡ à¤¸à¥€à¤§à¥‡ à¤¸à¤‚à¤ªà¤°à¥à¤• à¤•à¤°à¥‡à¤‚à¥¤' : 'Contact us directly and we will be happy to help.'}
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/contact" className="inline-flex items-center gap-2 bg-white text-[#063B63] font-bold px-5 py-2.5 rounded-full hover:shadow-lg transition-all text-sm">
                <Calendar size={16} /> {t.nav.contact}
              </Link>
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] text-white font-bold px-5 py-2.5 rounded-full hover:shadow-lg transition-all text-sm">
                <MessageCircle size={16} /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}


