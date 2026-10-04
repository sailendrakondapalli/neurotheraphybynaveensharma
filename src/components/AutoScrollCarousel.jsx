import { useRef, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function AutoScrollCarousel({ children, autoScroll = true, speed = 30, className = '' }) {
  const scrollRef = useRef(null)
  const [isHovering, setIsHovering] = useState(false)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  useEffect(() => {
    const el = scrollRef.current
    if (!el || !autoScroll) return

    const checkScroll = () => {
      setCanScrollLeft(el.scrollLeft > 0)
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1)
    }

    let animationId
    const scroll = () => {
      if (!isHovering && el) {
        el.scrollLeft += 1
        // Loop back to start when reaching end
        if (el.scrollLeft >= el.scrollWidth - el.clientWidth) {
          el.scrollLeft = 0
        }
      }
      animationId = requestAnimationFrame(scroll)
    }

    const interval = setInterval(() => {
      if (!isHovering) scroll()
    }, speed)

    el.addEventListener('scroll', checkScroll)
    checkScroll()

    return () => {
      clearInterval(interval)
      if (animationId) cancelAnimationFrame(animationId)
      el.removeEventListener('scroll', checkScroll)
    }
  }, [isHovering, autoScroll, speed])

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' })
  }

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' })
  }

  return (
    <div className="relative group">
      <div
        ref={scrollRef}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className={`flex gap-3 overflow-x-auto pb-2 scroll-smooth ${className}`}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {children}
      </div>

      {/* Manual scroll buttons */}
      {canScrollLeft && (
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <ChevronLeft size={16} className="text-[#3D5A73]" />
        </button>
      )}

      {canScrollRight && (
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 hover:bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <ChevronRight size={16} className="text-[#3D5A73]" />
        </button>
      )}
    </div>
  )
}
