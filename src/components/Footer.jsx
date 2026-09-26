import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Mail, Phone, MapPin } from 'lucide-react'
import { fetchCategories, fetchSiteSettings } from '../services/newsService'

export default function Footer() {
  const [categories, setCategories] = useState([])
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    fetchCategories().then(setCategories)
    fetchSiteSettings().then(setSettings)
  }, [])

  return (
    <footer style={{ 
      background: 'linear-gradient(180deg, #000C2E 0%, #00154A 100%)',
      borderTop: '2px solid #0066FF'
    }}>
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div>
            <div className="mb-4">
              <img src="/logo.png" alt="SR TV NEWS CHANNEL" className="h-10 w-auto object-contain mb-3" />
              <p className="text-[#AAB8D4] text-sm leading-relaxed">
                Your trusted source for breaking news, in-depth analysis, and live coverage from across India and the world.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[#AAB8D4] text-sm mb-2">
              <span className="text-white font-medium">Inform</span>
              <span className="text-[#E60012]">●</span>
              <span className="text-white font-medium">Inspire</span>
              <span className="text-[#E60012]">●</span>
              <span className="text-white font-medium">Empower</span>
            </div>
          </div>

          {/* News Categories */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">News Categories</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/latest" className="text-[#AAB8D4] hover:text-[#0066FF] text-sm transition-colors">
                  Latest News
                </Link>
              </li>
              {categories.slice(0, 7).map(cat => (
                <li key={cat.id}>
                  <Link to={`/category/${cat.slug}`} className="text-[#AAB8D4] hover:text-[#0066FF] text-sm transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-[#AAB8D4] hover:text-[#0066FF] text-sm transition-colors">Home</Link></li>
              <li><Link to="/about" className="text-[#AAB8D4] hover:text-[#0066FF] text-sm transition-colors">About Us</Link></li>
              <li><Link to="/team" className="text-[#AAB8D4] hover:text-[#0066FF] text-sm transition-colors">Our Team</Link></li>
              <li><Link to="/careers" className="text-[#AAB8D4] hover:text-[#0066FF] text-sm transition-colors">Careers</Link></li>
              <li><Link to="/contact" className="text-[#AAB8D4] hover:text-[#0066FF] text-sm transition-colors">Contact Us</Link></li>
              <li><Link to="/videos" className="text-[#AAB8D4] hover:text-[#0066FF] text-sm transition-colors">Videos</Link></li>
              <li><Link to="/live-tv" className="text-[#AAB8D4] hover:text-[#0066FF] text-sm transition-colors">Watch Live TV</Link></li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">Connect With Us</h4>
            <div className="space-y-3 text-sm text-[#AAB8D4] mb-4">
              {settings?.contact_email && (
                <div className="flex items-start gap-2">
                  <Mail size={16} className="text-[#0066FF] mt-0.5 flex-shrink-0" />
                  <a href={`mailto:${settings.contact_email}`} className="hover:text-[#0066FF] transition-colors">
                    {settings.contact_email}
                  </a>
                </div>
              )}
              {settings?.contact_phone && (
                <div className="flex items-start gap-2">
                  <Phone size={16} className="text-[#0066FF] mt-0.5 flex-shrink-0" />
                  <a href={`tel:${settings.contact_phone}`} className="hover:text-[#0066FF] transition-colors">
                    {settings.contact_phone}
                  </a>
                </div>
              )}
              {settings?.address && (
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-[#0066FF] mt-0.5 flex-shrink-0" />
                  <span>{settings.address}</span>
                </div>
              )}
            </div>

            {/* Social Media Icons */}
            <div className="flex items-center gap-3">
              {settings?.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" 
                  className="text-[#AAB8D4] hover:text-[#0066FF] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              )}
              {settings?.twitter_url && (
                <a href={settings.twitter_url} target="_blank" rel="noopener noreferrer"
                  className="text-[#AAB8D4] hover:text-[#0066FF] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              )}
              {settings?.youtube_url && (
                <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer"
                  className="text-[#AAB8D4] hover:text-[#0066FF] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              )}
              {settings?.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer"
                  className="text-[#AAB8D4] hover:text-[#0066FF] transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{ borderTop: '1px solid rgba(0, 102, 255, 0.3)' }} className="mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[#AAB8D4] text-xs">
          <span>© {new Date().getFullYear()} SR TV NEWS CHANNEL. All rights reserved.</span>
          <div className="flex gap-4">
            <Link to="/privacy-policy" className="hover:text-[#0066FF] transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[#0066FF] transition-colors">Terms of Service</Link>
            <Link to="/disclaimer" className="hover:text-[#0066FF] transition-colors">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
