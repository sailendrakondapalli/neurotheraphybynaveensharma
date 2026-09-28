import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { Megaphone, ArrowRight, Calendar } from 'lucide-react'
import { getAllFlashNewsAdmin } from '../services/neurotherapyService'
import { useLanguage } from '../lib/LanguageContext'

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } }

export default function FlashNewsPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const { lang } = useLanguage()

  useEffect(() => {
    getAllFlashNewsAdmin()
      .then(data => setItems(data.filter(i => i.is_active)))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Helmet>
        <title>{lang === 'hi' ? 'सूचनाएं' : 'Announcements'} – Neurotherapist Naveen Sharma</title>
        <meta name="description" content="Latest announcements and updates." />
      </Helmet>

      <div className="bg-gradient-to-br from-[#063B63] to-[#0877B8] text-white py-10 md:py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 text-xs font-bold tracking-widest bg-white/15 rounded-full px-4 py-2 mb-4 text-blue-100">
            <Megaphone size={13} /> {lang === 'hi' ? 'सूचनाएं' : 'Announcements'}
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4">
            {lang === 'hi' ? 'नवीनतम अपडेट' : 'Latest Updates'}
          </h1>
          <p className="text-blue-100 text-base md:text-lg max-w-2xl mx-auto">
            {lang === 'hi' ? 'हमारी सेवाओं और घोषणाओं के बारे में नवीनतम जानकारी' : 'Stay up to date with our latest news and announcements'}
          </p>
        </div>
      </div>

      <section className="py-10 md:py-16 bg-[#F5FAFC] min-h-[50vh]">
        <div className="max-w-4xl mx-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-3 border-[#0877B8] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20">
              <Megaphone size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-[#3D5A73] text-lg">
                {lang === 'hi' ? 'अभी कोई सूचना उपलब्ध नहीं है।' : 'No announcements available at the moment.'}
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {items.map((item, i) => {
                const title = lang === 'hi' && item.title_hi ? item.title_hi : item.title
                const message = lang === 'hi' && item.message_hi ? item.message_hi : item.message
                const linkText = lang === 'hi' ? (item.link_text_hi || 'अधिक जानें') : (item.link_text || 'Learn More')

                return (
                  <motion.div key={item.id} initial="hidden" animate="show" variants={fadeUp} transition={{ delay: i * 0.05 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all">
                    <div className="flex flex-col sm:flex-row">
                      {item.image && (
                        <div className="sm:w-56 flex-shrink-0">
                          <img src={item.image} alt={title} className="w-full h-40 sm:h-full object-cover" />
                        </div>
                      )}
                      <div className="p-5 flex-1">
                        <div className="flex items-center gap-2 text-[#7A9BB5] text-xs mb-2">
                          <Calendar size={12} />
                          {new Date(item.created_at).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                        <h2 className="text-[#063B63] font-bold text-lg mb-2">{title}</h2>
                        {message && <p className="text-[#3D5A73] text-sm leading-relaxed mb-3 whitespace-pre-line">{message}</p>}
                        {item.link_url && (
                          item.link_url.startsWith('http') ? (
                            <a href={item.link_url} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-[#0877B8] font-semibold text-sm hover:underline">
                              {linkText} <ArrowRight size={14} />
                            </a>
                          ) : (
                            <Link to={item.link_url}
                              className="inline-flex items-center gap-1.5 text-[#0877B8] font-semibold text-sm hover:underline">
                              {linkText} <ArrowRight size={14} />
                            </Link>
                          )
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
