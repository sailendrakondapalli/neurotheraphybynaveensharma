import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'
import { fetchBreakingNews } from '../services/newsService'

export default function BreakingNewsTicker() {
  const [breakingNews, setBreakingNews] = useState([])

  useEffect(() => {
    fetchBreakingNews().then(setBreakingNews)
    // Refresh every 60 seconds
    const interval = setInterval(() => {
      fetchBreakingNews().then(setBreakingNews)
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  if (breakingNews.length === 0) return null

  return (
    <div className="bg-red-600 text-white overflow-hidden">
      <div className="container mx-auto px-4 py-2 flex items-center gap-4">
        <div className="flex items-center gap-2 font-bold text-sm whitespace-nowrap bg-white text-red-600 px-3 py-1 rounded">
          <AlertCircle size={16} className="animate-pulse" />
          BREAKING NEWS
        </div>
        <div className="flex-1 overflow-hidden">
          <motion.div
            animate={{ x: [0, -2000] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="flex items-center gap-8 whitespace-nowrap"
          >
            {breakingNews.map((item, index) => (
              <span key={item.id} className="text-sm font-medium">
                {item.text}
                {index < breakingNews.length - 1 && (
                  <span className="mx-4 text-red-300">â€¢</span>
                )}
              </span>
            ))}
            {/* Duplicate for seamless loop */}
            {breakingNews.map((item, index) => (
              <span key={`dup-${item.id}`} className="text-sm font-medium">
                {item.text}
                {index < breakingNews.length - 1 && (
                  <span className="mx-4 text-red-300">â€¢</span>
                )}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}


