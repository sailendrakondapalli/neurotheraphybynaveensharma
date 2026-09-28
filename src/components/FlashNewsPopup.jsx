import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Megaphone, ArrowRight } from 'lucide-react'
import { getActiveFlashNews } from '../services/neurotherapyService'
import { useLanguage } from '../lib/LanguageContext'

export default function FlashNewsPopup() {
  const [news, setNews] = useState(null)
  const [open, setOpen] = useState(false)
  const { lang } = useLanguage()
  const navigate = useNavigate()

  useEffect(() => {
    getActiveFlashNews()
      .then(item => {
        if (item) {
          setNews(item)
          setOpen(true)
        }
      })
      .catch(() => {})
  }, [])

  const close = () => setOpen(false)

  const goToAnnouncements = () => {
    setOpen(false)
    navigate('/announcements')
  }

  if (!news) return null

  const title = lang === 'hi' && news.title_hi ? news.title_hi : news.title
  const message = lang === 'hi' && news.message_hi ? news.message_hi : news.message

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4"
          onClick={close}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden cursor-pointer group"
            onClick={(e) => { e.stopPropagation(); goToAnnouncements() }}
          >
            {/* Close button */}
            <button
              onClick={(e) => { e.stopPropagation(); close() }}
              className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-colors"
              aria-label="Close"
            >
              <X size={16} className="text-[#063B63]" />
            </button>

            {/* Image */}
            {news.image ? (
              <div className="relative overflow-hidden">
                <img src={news.image} alt={title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
            ) : (
              <div className="w-full h-32 bg-gradient-to-br from-[#063B63] to-[#0877B8] flex items-center justify-center">
                <Megaphone size={40} className="text-white/80" />
              </div>
            )}

            {/* Content */}
            <div className="p-5">
              <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full mb-3">
                <Megaphone size={11} /> {lang === 'hi' ? '\u0938\u0942\u091a\u0928\u093e' : 'Announcement'}
              </span>
              <h3 className="text-[#063B63] font-bold text-lg mb-2 leading-snug group-hover:text-[#0877B8] transition-colors">{title}</h3>
              {message && (
                <p className="text-[#3D5A73] text-sm leading-relaxed mb-4 whitespace-pre-line line-clamp-3">{message}</p>
              )}

              <div className="flex gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); goToAnnouncements() }}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#063B63] to-[#0877B8] text-white font-semibold text-sm px-4 py-2.5 rounded-xl hover:shadow-md transition-all"
                >
                  {lang === 'hi' ? '\u0905\u0927\u093f\u0915 \u091c\u093e\u0928\u0947\u0902' : 'View Announcement'} <ArrowRight size={14} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); close() }}
                  className="text-center bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold text-sm px-4 py-2.5 rounded-xl transition-all"
                >
                  {lang === 'hi' ? '\u092c\u0902\u0926 \u0915\u0930\u0947\u0902' : 'Close'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
