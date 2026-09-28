import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Search } from 'lucide-react'
import { fetchCategories, fetchSiteSettings } from '../services/newsService'

export default function NewsNavbar() {
  const [categories, setCategories] = useState([])
  const [settings, setSettings] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentTime, setCurrentTime] = useState(new Date())
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    fetchCategories().then(setCategories)
    fetchSiteSettings().then(setSettings)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
  }

  const isHomePage = location.pathname === '/'
  const isLatestPage = location.pathname === '/latest'
  const isVideosPage = location.pathname === '/videos'
  
  // Get current category slug from URL
  const currentCategorySlug = location.pathname.startsWith('/category/') 
    ? location.pathname.split('/category/')[1] 
    : null

  return (
    <header className="sticky top-0 z-50" style={{ 
      background: 'linear-gradient(180deg, #010824 0%, #00154A 100%)',
      boxShadow: '0 4px 12px rgba(0, 102, 255, 0.15)'
    }}>
      {/* SECTION 1 - TOP UTILITY BAR */}
      <div style={{ background: '#00154A', borderBottom: '1px solid rgba(0, 102, 255, 0.2)' }}>
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center justify-between" style={{ height: '35px' }}>
            {/* Left: Date & Time */}
            <div className="flex items-center gap-3 text-[11px] font-medium" style={{ color: '#AAB8D4' }}>
              <div className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <span className="text-white">{formatDate(currentTime)}</span>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
              <div className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span className="text-white">{formatTime(currentTime)} IST</span>
              </div>
            </div>

            {/* Right: Links & Social Icons */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3 text-[11px] font-medium" style={{ color: '#AAB8D4' }}>
                <Link to="/about" className="hover:text-[#0066FF] transition-colors">About Us</Link>
                <span style={{ color: 'rgba(255,255,255,0.15)' }}>|</span>
                <Link to="/team" className="hover:text-[#0066FF] transition-colors">Our Team</Link>
                <span style={{ color: 'rgba(255,255,255,0.15)' }}>|</span>
                <Link to="/careers" className="hover:text-[#0066FF] transition-colors">Careers</Link>
                <span style={{ color: 'rgba(255,255,255,0.15)' }}>|</span>
                <Link to="/contact" className="hover:text-[#0066FF] transition-colors">Contact</Link>
              </div>
              
              <div className="flex items-center gap-2 ml-3" style={{ borderLeft: '1px solid rgba(255,255,255,0.15)', paddingLeft: '12px' }}>
                {settings?.facebook_url && (
                  <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" 
                    className="hover:text-[#0066FF] transition-colors" style={{ color: '#AAB8D4' }}>
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                )}
                {settings?.twitter_url && (
                  <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer"
                    className="hover:text-[#0066FF] transition-colors" style={{ color: '#AAB8D4' }}>
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                )}
                {settings?.youtube_url && (
                  <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer"
                    className="hover:text-[#0066FF] transition-colors" style={{ color: '#AAB8D4' }}>
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                )}
                {settings?.instagram_url && (
                  <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer"
                    className="hover:text-[#0066FF] transition-colors" style={{ color: '#AAB8D4' }}>
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2 - MAIN BRAND HEADER */}
      <div style={{ 
        background: 'linear-gradient(180deg, #00154A 0%, #000C2E 100%)',
        borderBottom: '1px solid rgba(0, 102, 255, 0.25)'
      }}>
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center justify-between" style={{ height: '70px' }}>
            {/* Left: Logo */}
            <div className="flex items-center gap-4">
              <Link to="/" className="flex items-center" style={{ width: '200px' }}>
                <img src="/logo.png" alt="SR TV NEWS CHANNEL" className="h-11 w-auto object-contain" />
              </Link>
              
              <div style={{ 
                width: '1px', 
                height: '40px', 
                background: 'rgba(0, 102, 255, 0.3)' 
              }} />
              
              {/* Tagline */}
              <div className="hidden lg:flex items-center gap-2 text-[18px] font-medium text-white">
                <span>Inform</span>
                <span className="text-[#E60012] text-lg">â—</span>
                <span>Inspire</span>
                <span className="text-[#E60012] text-lg">â—</span>
                <span>Empower</span>
              </div>
            </div>

            {/* Right: LIVE TV & Search */}
            <div className="flex items-center gap-3">
              <Link to="/live-tv"
                className="flex items-center gap-2 text-white font-bold text-sm uppercase tracking-wide px-6 hover:shadow-lg transition-all"
                style={{ 
                  background: 'linear-gradient(135deg, #FF1A1A, #D90000)',
                  height: '40px',
                  borderRadius: '4px',
                  boxShadow: '0 4px 12px rgba(230, 0, 18, 0.4)'
                }}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" fill="none" />
                  <circle cx="12" cy="12" r="3" className="animate-pulse" />
                </svg>
                <span>LIVE TV</span>
              </Link>
              
              <button 
                onClick={() => setSearchOpen(true)}
                className="hidden md:flex items-center justify-center w-10 h-10 text-white hover:text-[#0066FF] transition-colors">
                <Search size={20} />
              </button>
              
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden text-white">
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3 - PRIMARY NAVIGATION */}
      <nav className="hidden md:block" style={{ 
        background: 'linear-gradient(180deg, #00154A 0%, #000C2E 100%)',
        borderBottom: '2px solid #0066FF'
      }}>
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center" style={{ height: '40px' }}>
            {/* HOME - Active Red Tab */}
            <Link 
              to="/"
              className="flex items-center gap-2 px-5 text-white font-semibold text-[13px] uppercase tracking-wide transition-all relative"
              style={{ 
                background: isHomePage ? 'linear-gradient(135deg, #FF1A1A, #D90000)' : 'transparent',
                height: '40px',
                clipPath: isHomePage ? 'polygon(0 0, 92% 0, 100% 100%, 0 100%)' : 'none',
                boxShadow: isHomePage ? '0 2px 8px rgba(230, 0, 18, 0.5)' : 'none'
              }}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
              </svg>
              <span>Home</span>
            </Link>

            {/* Separator */}
            <div style={{ 
              width: '1px', 
              height: '20px', 
              background: 'rgba(255,255,255,0.12)',
              margin: '0 2px'
            }} />

            {/* Other Navigation Items */}
            <Link to="/latest" 
              className="px-5 text-white font-medium text-[13px] transition-all relative"
              style={{ 
                height: '40px', 
                display: 'flex', 
                alignItems: 'center',
                background: isLatestPage ? 'linear-gradient(135deg, #FF1A1A, #D90000)' : 'transparent',
                clipPath: isLatestPage ? 'polygon(0 0, 92% 0, 100% 100%, 0 100%)' : 'none',
                boxShadow: isLatestPage ? '0 2px 8px rgba(230, 0, 18, 0.5)' : 'none',
                color: isLatestPage ? '#FFFFFF' : undefined
              }}>
              Latest News
            </Link>
            
            <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.12)', margin: '0 2px' }} />
            
            {categories.slice(0, 8).map((cat, idx) => {
              const isCategoryActive = currentCategorySlug === cat.slug
              return (
                <div key={cat.id} className="flex items-center">
                  <Link 
                    to={`/category/${cat.slug}`}
                    className="px-5 text-white font-medium text-[13px] whitespace-nowrap transition-all relative"
                    style={{ 
                      height: '40px', 
                      display: 'flex', 
                      alignItems: 'center',
                      background: isCategoryActive ? 'linear-gradient(135deg, #FF1A1A, #D90000)' : 'transparent',
                      clipPath: isCategoryActive ? 'polygon(0 0, 92% 0, 100% 100%, 0 100%)' : 'none',
                      boxShadow: isCategoryActive ? '0 2px 8px rgba(230, 0, 18, 0.5)' : 'none',
                      color: isCategoryActive ? '#FFFFFF' : undefined
                    }}>
                    {cat.name}
                  </Link>
                  {idx < Math.min(categories.length, 8) - 1 && (
                    <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.12)', margin: '0 2px' }} />
                  )}
                </div>
              )
            })}
            
            <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.12)', margin: '0 2px' }} />
            
            <Link to="/videos"
              className="px-5 text-white font-medium text-[13px] transition-all relative"
              style={{ 
                height: '40px', 
                display: 'flex', 
                alignItems: 'center',
                background: isVideosPage ? 'linear-gradient(135deg, #FF1A1A, #D90000)' : 'transparent',
                clipPath: isVideosPage ? 'polygon(0 0, 92% 0, 100% 100%, 0 100%)' : 'none',
                boxShadow: isVideosPage ? '0 2px 8px rgba(230, 0, 18, 0.5)' : 'none',
                color: isVideosPage ? '#FFFFFF' : undefined
              }}>
              Videos
            </Link>

            {/* Hamburger Menu - Right Side */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="ml-auto text-white hover:text-[#0066FF] transition-colors p-2">
              <Menu size={18} />
            </button>
          </div>
        </div>
      </nav>


      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden"
            style={{ 
              background: 'linear-gradient(180deg, #000C2E 0%, #00154A 100%)',
              borderTop: '1px solid rgba(0, 102, 255, 0.3)'
            }}>
            <div className="px-4 py-4 space-y-1">
              <Link to="/" onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 text-white hover:bg-[#0035A3] rounded transition-colors font-medium text-sm">
                Home
              </Link>
              <Link to="/latest" onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 text-white hover:bg-[#0035A3] rounded transition-colors font-medium text-sm">
                Latest News
              </Link>
              {categories.map(cat => (
                <Link key={cat.id} to={`/category/${cat.slug}`} onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 text-white hover:bg-[#0035A3] rounded transition-colors font-medium text-sm">
                  {cat.name}
                </Link>
              ))}
              <Link to="/videos" onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 text-white hover:bg-[#0035A3] rounded transition-colors font-medium text-sm">
                Videos
              </Link>
              <button onClick={() => { setSearchOpen(true); setMobileMenuOpen(false) }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 mt-2 text-white border border-[#0066FF] hover:bg-[#0035A3] rounded transition-colors font-medium text-sm">
                <Search size={18} /> Search
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4"
            style={{ background: 'rgba(0, 12, 46, 0.95)' }}
            onClick={() => setSearchOpen(false)}>
            <motion.div 
              initial={{ scale: 0.9, y: -20 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.9, y: -20 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-2xl p-6 rounded-lg"
              style={{ 
                background: 'linear-gradient(180deg, #00154A 0%, #000C2E 100%)',
                border: '1px solid rgba(0, 102, 255, 0.4)',
                boxShadow: '0 8px 32px rgba(0, 102, 255, 0.3)'
              }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Search News</h3>
                <button 
                  onClick={() => setSearchOpen(false)} 
                  className="text-[#AAB8D4] hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#AAB8D4]" />
                  <input 
                    value={searchQuery} 
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search for news articles..."
                    autoFocus
                    className="w-full pl-12 pr-4 py-3 text-lg text-white placeholder-[#AAB8D4] rounded-lg focus:outline-none"
                    style={{ 
                      background: 'rgba(0, 53, 163, 0.2)',
                      border: '1px solid rgba(0, 102, 255, 0.4)'
                    }} />
                </div>
                <button 
                  type="submit"
                  className="w-full mt-4 py-3 rounded-lg font-semibold text-white transition-all"
                  style={{ 
                    background: 'linear-gradient(135deg, #FF1A1A, #D90000)',
                    boxShadow: '0 4px 12px rgba(230, 0, 18, 0.4)'
                  }}>
                  Search
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}


