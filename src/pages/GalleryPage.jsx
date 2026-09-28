import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react'
import { getPublishedGallery } from '../services/neurotherapyService'
import { useLanguage } from '../lib/LanguageContext'

export default function GalleryPage() {
  const [gallery, setGallery] = useState([])
  const [filtered, setFiltered] = useState([])
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [lightbox, setLightbox] = useState(null)
  const [loading, setLoading] = useState(true)
  const { lang, t } = useLanguage()

  useEffect(() => {
    getPublishedGallery().then(data => {
      setGallery(data)
      setFiltered(data)
      const cats = [...new Set(data.map(i => i.category).filter(Boolean))]
      setCategories(cats)
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (activeCategory === 'all') {
      setFiltered(gallery)
    } else {
      setFiltered(gallery.filter(i => i.category === activeCategory))
    }
  }, [activeCategory, gallery])

  const openLightbox = (index) => {
    setLightbox(index)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setLightbox(null)
    document.body.style.overflow = ''
  }

  const prevImage = () => setLightbox(i => (i - 1 + filtered.length) % filtered.length)
  const nextImage = () => setLightbox(i => (i + 1) % filtered.length)

  useEffect(() => {
    const handleKey = (e) => {
      if (lightbox === null) return
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') prevImage()
      if (e.key === 'ArrowRight') nextImage()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [lightbox, filtered.length])

  return (
    <>
      <Helmet>
        <title>{lang === 'hi' ? 'à¤—à¥ˆà¤²à¤°à¥€ â€“ Neurotherapist Naveen Sharma' : 'Gallery â€“ Neurotherapist Naveen Sharma'}</title>
        <meta name="description" content="View our neurotherapy wellness gallery." />
      </Helmet>

      <div className="bg-gradient-to-br from-[#063B63] to-[#0877B8] text-white py-10 md:py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4">
            {lang === 'hi' ? 'à¤—à¥ˆà¤²à¤°à¥€' : 'Gallery'}
          </h1>
          <p className="text-blue-100 text-lg">
            {lang === 'hi' ? 'à¤¹à¤®à¤¾à¤°à¥€ à¤µà¥‡à¤²à¤¨à¥‡à¤¸ à¤¯à¤¾à¤¤à¥à¤°à¤¾ à¤•à¥€ à¤à¤• à¤à¤²à¤•' : 'A glimpse into our wellness journey'}
          </p>
        </div>
      </div>

      {/* Category filters */}
      {categories.length > 0 && (
        <div className="bg-white border-b border-gray-100 py-4 px-4">
          <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto pb-1">
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

      <section className="py-8 md:py-12 bg-[#F5FAFC] min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-3 border-[#0877B8] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">ðŸ–¼ï¸</div>
              <p className="text-[#3D5A73]">{t.common.noContent}</p>
            </div>
          ) : (
            <motion.div layout className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
              {filtered.map((item, idx) => (
                <motion.div key={item.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="break-inside-avoid mb-3">
                  <button onClick={() => openLightbox(idx)}
                    className="relative block w-full group overflow-hidden rounded-2xl bg-gray-200 hover:shadow-xl transition-all duration-300">
                    <img src={item.image} alt={item.title || 'Gallery'} className="w-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                    <div className="absolute inset-0 bg-[#063B63]/0 group-hover:bg-[#063B63]/30 transition-all flex items-center justify-center">
                      <ZoomIn size={28} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    {item.title && (
                      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <p className="text-white text-sm font-medium line-clamp-1">{item.title}</p>
                      </div>
                    )}
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && filtered[lightbox] && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={closeLightbox}>
            <button onClick={closeLightbox} className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2.5 z-10 transition-colors">
              <X size={20} />
            </button>
            {filtered.length > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); prevImage() }}
                  className="absolute left-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors z-10">
                  <ChevronLeft size={22} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); nextImage() }}
                  className="absolute right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-colors z-10">
                  <ChevronRight size={22} />
                </button>
              </>
            )}
            <motion.img
              key={lightbox}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
              src={filtered[lightbox].image}
              alt={filtered[lightbox].title || 'Gallery'}
              className="max-w-full max-h-[85vh] object-contain rounded-xl"
              onClick={e => e.stopPropagation()}
            />
            {filtered[lightbox].title && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm px-4 py-2 rounded-full">
                {filtered[lightbox].title}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}


