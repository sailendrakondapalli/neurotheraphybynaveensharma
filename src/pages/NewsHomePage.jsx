import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion } from 'framer-motion'
import { ArrowRight, TrendingUp, Radio } from 'lucide-react'
import { fetchNews, fetchCategories, fetchHomepageConfig } from '../services/newsService'
import NewsCard from '../components/NewsCard'
import BreakingNewsTicker from '../components/BreakingNewsTicker'

export default function NewsHomePage() {
  const [heroNews, setHeroNews] = useState(null)
  const [latestNews, setLatestNews] = useState([])
  const [trendingNews, setTrendingNews] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        // Fetch homepage config for hero
        const config = await fetchHomepageConfig()
        if (config?.hero_news) {
          setHeroNews(config.hero_news)
        } else {
          // Fallback: use most recent featured or breaking news
          const featured = await fetchNews({ featured: true, limit: 1 })
          if (featured.length > 0) {
            setHeroNews(featured[0])
          } else {
            const recent = await fetchNews({ limit: 1 })
            if (recent.length > 0) setHeroNews(recent[0])
          }
        }

        // Fetch latest news
        const latest = await fetchNews({ limit: 12 })
        setLatestNews(latest)

        // Fetch trending news
        const trending = await fetchNews({ trending: true, limit: 5 })
        setTrendingNews(trending)

        // Fetch categories
        const cats = await fetchCategories()
        setCategories(cats)
      } catch (error) {
        console.error('Error loading homepage data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-[#1B2B5E] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>SR TV NEWS CHANNEL - Inform • Inspire • Empower</title>
        <meta name="description" content="Stay informed with SR TV NEWS CHANNEL - Your trusted source for breaking news, politics, business, sports, entertainment and more." />
      </Helmet>

      <div className="bg-gray-50 min-h-screen">
        {/* Breaking News Ticker */}
        <BreakingNewsTicker />

        {/* Hero Section */}
        <section className="w-full">
          <img src="/hero.png" alt="SR TV NEWS CHANNEL" className="w-full h-auto object-cover" />
        </section>

        {/* Category Cards */}
        {categories.length > 0 && (
          <section className="py-8 bg-white border-b border-gray-200">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                {categories.map((cat, index) => (
                  <motion.div key={cat.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}>
                    <Link to={`/category/${cat.slug}`}
                      className="block bg-gradient-to-br from-[#1B2B5E] to-[#2A3F7E] rounded-xl overflow-hidden hover:shadow-lg transition-all group relative h-24">
                      {cat.image_url && (
                        <>
                          <img src={cat.image_url} alt={cat.name} 
                            className="absolute inset-0 w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                        </>
                      )}
                      <div className="relative h-full flex items-center justify-center p-3">
                        <h3 className="text-white font-bold text-sm text-center group-hover:text-red-400 transition-colors drop-shadow-lg">
                          {cat.name}
                        </h3>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Main Content Area */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Latest News - Left & Center Column */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Latest News</h2>
                  <Link to="/latest" className="text-[#1B2B5E] hover:text-red-600 font-semibold text-sm flex items-center gap-1">
                    View All <ArrowRight size={16} />
                  </Link>
                </div>

                {latestNews.length === 0 ? (
                  <div className="bg-white rounded-xl p-12 text-center text-gray-400">
                    No news articles available
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {latestNews.map((news) => (
                      <NewsCard key={news.id} news={news} size="medium" />
                    ))}
                  </div>
                )}
              </div>

              {/* Trending Sidebar - Right Column */}
              <div>
                <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                  <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp size={20} className="text-red-600" />
                    Trending Now
                  </h2>

                  {trendingNews.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center py-8">No trending news</p>
                  ) : (
                    <div className="space-y-4">
                      {trendingNews.map((news, index) => (
                        <div key={news.id} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0">
                          <div className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <Link to={`/news/${news.slug}`}
                              className="text-sm font-semibold text-gray-900 hover:text-[#1B2B5E] line-clamp-2 transition-colors">
                              {news.title}
                            </Link>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(news.published_at || news.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Live TV Button */}
                  <Link to="/live-tv"
                    className="block mt-6 bg-red-600 text-white text-center py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold">
                    <div className="flex items-center justify-center gap-2">
                      <Radio size={18} className="animate-pulse" />
                      Watch Live TV
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
