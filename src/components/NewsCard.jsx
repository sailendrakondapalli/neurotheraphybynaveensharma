import { Link } from 'react-router-dom'
import { Clock, Eye, User } from 'lucide-react'
import { motion } from 'framer-motion'

export default function NewsCard({ news, size = 'medium' }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins} minutes ago`
    if (diffHours < 24) return `${diffHours} hours ago`
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  if (size === 'large') {
    return (
      <Link to={`/news/${news.slug}`}>
        <motion.article whileHover={{ y: -4 }} transition={{ duration: 0.2 }}
          className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group">
          {news.featured_image_url && (
            <div className="relative h-64 overflow-hidden">
              <img src={news.featured_image_url} alt={news.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              {news.category && (
                <span className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded text-xs font-semibold">
                  {news.category.name}
                </span>
              )}
            </div>
          )}
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#1B2B5E] transition-colors">
              {news.title}
            </h2>
            {news.short_description && (
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {news.short_description}
              </p>
            )}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              {news.reporter && (
                <div className="flex items-center gap-1">
                  <User size={14} />
                  <span>{news.reporter.name}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{formatDate(news.published_at || news.created_at)}</span>
              </div>
              {news.views_count > 0 && (
                <div className="flex items-center gap-1">
                  <Eye size={14} />
                  <span>{news.views_count.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        </motion.article>
      </Link>
    )
  }

  if (size === 'small') {
    return (
      <Link to={`/news/${news.slug}`}>
        <motion.article whileHover={{ x: 4 }} transition={{ duration: 0.2 }}
          className="flex gap-3 group">
          {news.featured_image_url && (
            <div className="flex-shrink-0 w-24 h-20 rounded-lg overflow-hidden">
              <img src={news.featured_image_url} alt={news.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-[#1B2B5E] transition-colors mb-1">
              {news.title}
            </h3>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock size={12} />
              <span>{formatDate(news.published_at || news.created_at)}</span>
            </div>
          </div>
        </motion.article>
      </Link>
    )
  }

  // Medium size (default)
  return (
    <Link to={`/news/${news.slug}`}>
      <motion.article whileHover={{ y: -4 }} transition={{ duration: 0.2 }}
        className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group">
        {news.featured_image_url && (
          <div className="relative h-48 overflow-hidden">
            <img src={news.featured_image_url} alt={news.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            {news.category && (
              <span className="absolute top-3 left-3 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
                {news.category.name}
              </span>
            )}
          </div>
        )}
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#1B2B5E] transition-colors">
            {news.title}
          </h3>
          {news.short_description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {news.short_description}
            </p>
          )}
          <div className="flex items-center gap-3 text-xs text-gray-500">
            {news.reporter && (
              <div className="flex items-center gap-1">
                <User size={12} />
                <span>{news.reporter.name}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>{formatDate(news.published_at || news.created_at)}</span>
            </div>
          </div>
        </div>
      </motion.article>
    </Link>
  )
}


