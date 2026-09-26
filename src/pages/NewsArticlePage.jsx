import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Clock, Eye, User, Share2, Link as LinkIcon } from 'lucide-react'
import { fetchNewsById, fetchRelatedNews, fetchNews } from '../services/newsService'
import NewsCard from '../components/NewsCard'
import toast from 'react-hot-toast'

export default function NewsArticlePage() {
  const { slug } = useParams()
  const [article, setArticle] = useState(null)
  const [relatedNews, setRelatedNews] = useState([])
  const [trendingNews, setTrendingNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadArticle = async () => {
      setLoading(true)
      try {
        const data = await fetchNewsById(slug)
        if (data) {
          setArticle(data)
          
          // Fetch related news
          if (data.category_id) {
            const related = await fetchRelatedNews(data.category_id, data.id, 4)
            setRelatedNews(related)
          }

          // Fetch trending
          const trending = await fetchNews({ trending: true, limit: 5 })
          setTrendingNews(trending)
        }
      } catch (error) {
        console.error('Error loading article:', error)
      } finally {
        setLoading(false)
      }
    }
    loadArticle()
    window.scrollTo(0, 0)
  }, [slug])

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

  const handleShare = (platform) => {
    const encodedUrl = encodeURIComponent(shareUrl)
    const encodedTitle = encodeURIComponent(article?.title || '')
    
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      copy: shareUrl
    }

    if (platform === 'copy') {
      navigator.clipboard.writeText(shareUrl)
      toast.success('Link copied to clipboard!')
    } else {
      window.open(urls[platform], '_blank', 'width=600,height=400')
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-[#1B2B5E] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <Link to="/" className="text-[#1B2B5E] hover:text-red-600 font-semibold">
            Return to Homepage
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>{article.title} - SR TV NEWS CHANNEL</title>
        <meta name="description" content={article.short_description || article.title} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.short_description || article.title} />
        {article.featured_image_url && (
          <meta property="og:image" content={article.featured_image_url} />
        )}
      </Helmet>

      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Article Content */}
            <article className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                {/* Category Badge */}
                {article.category && (
                  <Link to={`/category/${article.category.slug}`}
                    className="inline-block m-6 mb-0 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-red-700 transition-colors">
                    {article.category.name}
                  </Link>
                )}

                {/* Title */}
                <div className="px-6 pt-4">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
                    {article.title}
                  </h1>

                  {/* Meta Information */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200">
                    {article.reporter && (
                      <div className="flex items-center gap-2">
                        {article.reporter.photo_url ? (
                          <img src={article.reporter.photo_url} alt={article.reporter.name}
                            className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <User size={20} className="text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-900">{article.reporter.name}</p>
                          <p className="text-xs text-gray-500">{article.reporter.designation}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>{formatDate(article.published_at || article.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye size={16} />
                      <span>{(article.views_count || 0).toLocaleString()} views</span>
                    </div>
                  </div>
                </div>

                {/* Featured Image */}
                {article.featured_image_url && (
                  <div className="px-6 mb-6">
                    <img src={article.featured_image_url} alt={article.title}
                      className="w-full h-auto rounded-xl" />
                  </div>
                )}

                {/* Short Description */}
                {article.short_description && (
                  <div className="px-6 mb-6">
                    <p className="text-lg text-gray-700 font-medium leading-relaxed">
                      {article.short_description}
                    </p>
                  </div>
                )}

                {/* Article Content */}
                <div className="px-6 pb-6">
                  <div className="prose prose-lg max-w-none">
                    {article.content.split('\n').map((paragraph, index) => (
                      paragraph.trim() && (
                        <p key={index} className="mb-4 text-gray-800 leading-relaxed">
                          {paragraph}
                        </p>
                      )
                    ))}
                  </div>
                </div>

                {/* Tags */}
                {article.tags && article.tags.length > 0 && (
                  <div className="px-6 pb-6">
                    <div className="flex flex-wrap gap-2">
                      {article.tags.map(tag => (
                        <span key={tag} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Share Buttons */}
                <div className="px-6 pb-6 border-t border-gray-200 pt-6">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-600 font-semibold flex items-center gap-2">
                      <Share2 size={18} /> Share:
                    </span>
                    <button onClick={() => handleShare('facebook')}
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </button>
                    <button onClick={() => handleShare('twitter')}
                      className="p-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    </button>
                    <button onClick={() => handleShare('linkedin')}
                      className="p-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </button>
                    <button onClick={() => handleShare('copy')}
                      className="p-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors">
                      <LinkIcon size={18} />
                    </button>
                  </div>
                </div>

                {/* Reporter Bio */}
                {article.reporter && article.reporter.bio && (
                  <div className="px-6 pb-6 border-t border-gray-200 pt-6">
                    <div className="flex gap-4">
                      {article.reporter.photo_url && (
                        <img src={article.reporter.photo_url} alt={article.reporter.name}
                          className="w-20 h-20 rounded-full object-cover" />
                      )}
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1">About {article.reporter.name}</h3>
                        <p className="text-sm text-gray-600">{article.reporter.bio}</p>
                        {article.reporter.location && (
                          <p className="text-xs text-gray-500 mt-1">{article.reporter.location}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Related News */}
              {relatedNews.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Related News</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {relatedNews.map(news => (
                      <NewsCard key={news.id} news={news} size="medium" />
                    ))}
                  </div>
                </div>
              )}
            </article>

            {/* Sidebar */}
            <aside className="space-y-6">
              {/* Trending News */}
              {trendingNews.length > 0 && (
                <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Trending Now</h2>
                  <div className="space-y-4">
                    {trendingNews.map((news, index) => (
                      <div key={news.id} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0">
                        <div className="flex-shrink-0 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link to={`/news/${news.slug}`}
                            className="text-sm font-semibold text-gray-900 hover:text-[#1B2B5E] line-clamp-2">
                            {news.title}
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>
    </>
  )
}
