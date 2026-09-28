import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Play, X, Video as VideoIcon } from 'lucide-react'
import { getPublishedVideos } from '../services/neurotherapyService'
import { getYouTubeThumbnail, getYouTubeEmbedUrl } from '../services/uploadService'
import { useLanguage } from '../lib/LanguageContext'

export default function VideosPage() {
  const [videos, setVideos] = useState([])
  const [filtered, setFiltered] = useState([])
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeVideo, setActiveVideo] = useState(null)
  const [loading, setLoading] = useState(true)
  const { lang, t } = useLanguage()

  useEffect(() => {
    getPublishedVideos().then(data => {
      setVideos(data)
      setFiltered(data)
      const cats = [...new Set(data.map(v => v.category).filter(Boolean))]
      setCategories(cats)
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (activeCategory === 'all') setFiltered(videos)
    else setFiltered(videos.filter(v => v.category === activeCategory))
  }, [activeCategory, videos])

  const openVideo = (video) => {
    setActiveVideo(video)
    document.body.style.overflow = 'hidden'
  }

  const closeVideo = () => {
    setActiveVideo(null)
    document.body.style.overflow = ''
  }

  return (
    <>
      <Helmet>
        <title>{lang === 'hi' ? 'वीडियो' : 'Videos'} - Neurotherapist Naveen Sharma</title>
        <meta name="description" content="Informational neurotherapy wellness videos." />
      </Helmet>

      <div className="bg-gradient-to-br from-[#063B63] to-[#0877B8] text-white py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{lang === 'hi' ? 'वीडियो' : 'Videos'}</h1>
          <p className="text-blue-100 text-lg">{lang === 'hi' ? 'जानकारीपूर्ण वेलनेस वीडियो' : 'Informational wellness videos'}</p>
        </div>
      </div>

      {categories.length > 0 && (
        <div className="bg-white border-b border-gray-100 py-4 px-4">
          <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto pb-1">
            <button onClick={() => setActiveCategory('all')}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${activeCategory === 'all' ? 'bg-[#063B63] text-white' : 'bg-gray-100 text-[#3D5A73] hover:bg-gray-200'}`}>
              {lang === 'hi' ? 'सभी' : 'All'}
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

      <section className="py-12 bg-[#F5FAFC] min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-10 h-10 border-3 border-[#0877B8] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <VideoIcon size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-[#3D5A73]">{t.common.noContent}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(video => {
                const thumb = video.thumbnail || getYouTubeThumbnail(video.video_url)
                return (
                  <motion.button key={video.id} onClick={() => openVideo(video)}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="group text-left bg-white rounded-2xl overflow-hidden border border-blue-50 hover:shadow-xl hover:shadow-blue-100 transition-all duration-300">
                    <div className="relative h-48 bg-gray-200 overflow-hidden">
                      {thumb ? (
                        <img src={thumb} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#063B63] to-[#0877B8] flex items-center justify-center">
                          <Play size={40} className="text-white" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play size={24} className="text-[#063B63] ml-1.5" />
                        </div>
                      </div>
                      {video.category && (
                        <div className="absolute top-3 left-3 bg-[#063B63]/80 text-white text-xs px-2 py-1 rounded-full">
                          {video.category}
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-[#063B63] text-sm mb-1 line-clamp-2 group-hover:text-[#0877B8] transition-colors">{video.title}</h3>
                      {video.description && <p className="text-[#3D5A73] text-xs line-clamp-2 mt-1">{video.description}</p>}
                    </div>
                  </motion.button>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {activeVideo && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={closeVideo}>
            <div className="relative w-full max-w-4xl" onClick={e => e.stopPropagation()}>
              <button onClick={closeVideo} className="absolute -top-10 right-0 bg-white/10 hover:bg-white/20 text-white rounded-full p-2.5 transition-colors">
                <X size={20} />
              </button>
              <div className="aspect-video bg-black rounded-2xl overflow-hidden">
                {activeVideo.video_url.includes('youtube') || activeVideo.video_url.includes('youtu.be') ? (
                  <iframe
                    src={getYouTubeEmbedUrl(activeVideo.video_url)}
                    title={activeVideo.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={activeVideo.video_url}
                    controls
                    autoPlay
                    className="w-full h-full"
                  />
                )}
              </div>
              <div className="text-white mt-4 text-center">
                <h3 className="font-bold text-lg">{activeVideo.title}</h3>
                {activeVideo.description && <p className="text-gray-300 text-sm mt-1">{activeVideo.description}</p>}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
