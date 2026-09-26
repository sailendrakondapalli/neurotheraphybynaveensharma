import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft } from 'lucide-react'
import { fetchNews, fetchCategoryBySlug } from '../services/newsService'
import NewsCard from '../components/NewsCard'
import BreakingNewsTicker from '../components/BreakingNewsTicker'

export default function CategoryPage() {
  const { slug } = useParams()
  const [news, setNews] = useState([])
  const [category, setCategory] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCategoryNews = async () => {
      setLoading(true)
      try {
        console.log('Loading category with slug:', slug)
        
        // First, fetch the category itself to get the correct name
        const categoryData = await fetchCategoryBySlug(slug)
        console.log('Category data:', categoryData)
        
        if (categoryData) {
          setCategory(categoryData)
        }
        
        // Then fetch news for this category
        const data = await fetchNews({ categorySlug: slug, limit: 50 })
        console.log('Fetched news data:', data)
        setNews(data)
        
        // If we got news but no category yet, get it from first article
        if (!categoryData && data.length > 0 && data[0].category) {
          console.log('Category from first article:', data[0].category)
          setCategory(data[0].category)
        }
      } catch (error) {
        console.error('Error loading category news:', error)
      } finally {
        setLoading(false)
      }
    }
    loadCategoryNews()
  }, [slug])

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
        <title>{category?.name || 'Category'} - SR TV NEWS CHANNEL</title>
        <meta name="description" content={`Latest ${category?.name || 'category'} news from SR TV NEWS CHANNEL`} />
      </Helmet>

      <div className="bg-gray-50 min-h-screen">
        {/* Breaking News Ticker */}
        <BreakingNewsTicker />

        {/* Category Header */}
        <section className="bg-gradient-to-br from-[#1B2B5E] to-[#2A3F7E] text-white py-12">
          <div className="container mx-auto px-4">
            <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors">
              <ArrowLeft size={20} />
              Back to Home
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold">
              {category?.name || 'Category'}
            </h1>
            <p className="text-gray-200 mt-2">
              {news.length} {news.length === 1 ? 'article' : 'articles'}
            </p>
          </div>
        </section>

        {/* News Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {news.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center">
                <p className="text-gray-400 text-lg">No news articles found in this category</p>
                <Link to="/" className="inline-block mt-4 text-[#1B2B5E] hover:text-red-600 font-semibold">
                  Return to Homepage
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((article) => (
                  <NewsCard key={article.id} news={article} size="medium" />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  )
}
