import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard, Stethoscope, Star, Image, Video, HelpCircle,
  Calendar, Settings, Menu, X, ChevronRight, Globe, Heart, Info, Brain
} from "lucide-react"

const NAV = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { path: "/admin/about", label: "About Page", icon: Info },
  { path: "/admin/neurotherapy", label: "Neurotherapy Page", icon: Brain },
  { path: "/admin/services", label: "Services", icon: Stethoscope },
  { path: "/admin/benefits", label: "Benefits", icon: Heart },
  { path: "/admin/testimonials", label: "Testimonials", icon: Star },
  { path: "/admin/gallery", label: "Gallery", icon: Image },
  { path: "/admin/videos", label: "Videos", icon: Video },
  { path: "/admin/faqs", label: "FAQs", icon: HelpCircle },
  { path: "/admin/appointments", label: "Appointments", icon: Calendar },
  { path: "/admin/settings", label: "Settings", icon: Settings },
]

function Sidebar({ pathname, onNavClick }) {
  return (
    <motion.aside
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 240, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex-shrink-0 bg-[#063B63] flex flex-col overflow-hidden">
      <div className="p-5 border-b border-white/10">
        <Link to="/admin" onClick={onNavClick} className="flex items-center gap-2 select-none">
          <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
            <Stethoscope size={16} className="text-white" />
          </div>
          <div>
            <span className="text-white font-bold text-sm block leading-tight">Neurotherapist Naveen Sharma</span>
            <span className="text-blue-300 text-xs">Admin Panel</span>
          </div>
        </Link>
      </div>
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV.map(({ path, label, icon: Icon, exact }) => {
          const active = exact ? pathname === path : (path !== "/admin" && pathname.startsWith(path))
          return (
            <Link key={path} to={path} onClick={onNavClick}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                active
                  ? "bg-white text-[#063B63] font-semibold shadow-sm"
                  : "text-blue-100 hover:text-white hover:bg-white/10"
              }`}>
              <Icon size={16} /><span>{label}</span>
              {active && <ChevronRight size={13} className="ml-auto" />}
            </Link>
          )
        })}
      </nav>
      <div className="p-3 border-t border-white/10">
        <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-blue-100 hover:text-white hover:bg-white/10 transition-all">
          <Globe size={16} /> View Website
        </Link>
      </div>
    </motion.aside>
  )
}

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(() => typeof window !== "undefined" && window.innerWidth >= 1024)
  const { pathname } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleResize = () => { if (window.innerWidth < 1024) setSidebarOpen(false) }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleSignOut = () => {
    navigate("/")
  }

  const currentLabel = NAV.find(n => n.exact ? pathname === n.path : (n.path !== "/admin" && pathname.startsWith(n.path)))?.label || "Admin Panel"

  return (
    <div className="flex h-screen bg-[#F4F6FA] overflow-hidden">
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <Sidebar
            pathname={pathname}
            onNavClick={() => { if (window.innerWidth < 1024) setSidebarOpen(false) }}
          />
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 flex-shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(o => !o)} className="text-gray-500 hover:text-[#063B63] p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <Menu size={20} />
            </button>
            <span className="text-gray-600 text-sm font-medium hidden sm:block">{currentLabel}</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" target="_blank" className="text-xs text-[#0877B8] hover:underline font-medium hidden md:block">
              View Website â†’
            </Link>
            <button onClick={handleSignOut} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-2 rounded-lg font-medium transition-all">
              â† Back to Site
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}


