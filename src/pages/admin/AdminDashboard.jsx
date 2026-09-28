import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Stethoscope, Star, Image, Video, HelpCircle, Calendar, CheckCircle, Clock, TrendingUp, Plus, Upload, Settings } from 'lucide-react'
import { getDashboardStats, getRecentAppointments, getRecentTestimonials } from '../../services/neurotherapyService'

function StatCard({ icon: Icon, label, value, color, to }) {
  const card = (
    <motion.div whileHover={{ scale: 1.02 }} className={`bg-white rounded-2xl p-5 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={20} className="text-white" />
        </div>
        <span className={`text-2xl font-bold text-[#063B63]`}>{value ?? '-'}</span>
      </div>
      <p className="text-[#3D5A73] text-sm font-medium">{label}</p>
    </motion.div>
  )
  return to ? <Link to={to}>{card}</Link> : card
}

const STATUS_COLORS = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  scheduled: 'bg-purple-100 text-purple-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({})
  const [appointments, setAppointments] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getDashboardStats(), getRecentAppointments(5), getRecentTestimonials(5)])
      .then(([s, a, t]) => { setStats(s); setAppointments(a); setTestimonials(t) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const statCards = [
    { icon: Stethoscope, label: 'Total Services', value: stats.totalServices, color: 'bg-gradient-to-br from-[#063B63] to-[#0877B8]', to: '/admin/services' },
    { icon: CheckCircle, label: 'Published Services', value: stats.publishedServices, color: 'bg-gradient-to-br from-[#159447] to-[#159A8C]', to: '/admin/services' },
    { icon: Star, label: 'Total Testimonials', value: stats.totalTestimonials, color: 'bg-gradient-to-br from-[#0877B8] to-[#159A8C]', to: '/admin/testimonials' },
    { icon: Clock, label: 'Pending Testimonials', value: stats.pendingTestimonials, color: 'bg-gradient-to-br from-amber-500 to-orange-500', to: '/admin/testimonials' },
    { icon: Image, label: 'Gallery Images', value: stats.galleryImages, color: 'bg-gradient-to-br from-[#159A8C] to-[#0877B8]', to: '/admin/gallery' },
    { icon: Video, label: 'Videos', value: stats.totalVideos, color: 'bg-gradient-to-br from-red-500 to-red-600', to: '/admin/videos' },
    { icon: HelpCircle, label: 'FAQs', value: stats.totalFaqs, color: 'bg-gradient-to-br from-purple-500 to-purple-600', to: '/admin/faqs' },
    { icon: Calendar, label: 'New Enquiries', value: stats.newEnquiries, color: 'bg-gradient-to-br from-[#063B63] to-[#159A8C]', to: '/admin/appointments' },
    { icon: TrendingUp, label: 'Scheduled', value: stats.scheduledAppointments, color: 'bg-gradient-to-br from-[#159447] to-[#0877B8]', to: '/admin/appointments' },
  ]

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 border-3 border-[#0877B8] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#063B63]">Dashboard</h1>
        <p className="text-[#3D5A73] text-sm mt-1">Neurotherapy CMS Overview</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {statCards.map((card, i) => (
          <StatCard key={i} {...card} />
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Appointments */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-[#063B63] text-base">Recent Enquiries</h2>
            <Link to="/admin/appointments" className="text-[#0877B8] text-xs font-semibold hover:underline">View All</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {appointments.length === 0 ? (
              <p className="text-[#7A9BB5] text-sm text-center py-8">No enquiries yet</p>
            ) : appointments.map(a => (
              <div key={a.id} className="flex items-start gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#063B63] to-[#0877B8] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {a.name?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#063B63] text-sm truncate">{a.name}</p>
                  <p className="text-[#7A9BB5] text-xs">{a.phone} {a.service_name ? `â€¢ ${a.service_name}` : ''}</p>
                </div>
                <span className={`flex-shrink-0 text-xs px-2 py-1 rounded-full font-semibold capitalize ${STATUS_COLORS[a.status] || 'bg-gray-100 text-gray-600'}`}>
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Testimonials */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-[#063B63] text-base">Recent Testimonials</h2>
            <Link to="/admin/testimonials" className="text-[#0877B8] text-xs font-semibold hover:underline">View All</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {testimonials.length === 0 ? (
              <p className="text-[#7A9BB5] text-sm text-center py-8">No testimonials yet</p>
            ) : testimonials.map(t => (
              <div key={t.id} className="flex items-start gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#159A8C] to-[#0877B8] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {t.patient_name?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#063B63] text-sm truncate">{t.patient_name}</p>
                  <p className="text-[#7A9BB5] text-xs line-clamp-1">"{t.testimonial}"</p>
                </div>
                <span className={`flex-shrink-0 text-xs px-2 py-1 rounded-full font-semibold capitalize ${
                  t.status === 'published' ? 'bg-green-100 text-green-700' :
                  t.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  t.status === 'approved' ? 'bg-blue-100 text-blue-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h2 className="font-bold text-[#063B63] text-base mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {[
            { to: '/admin/services', icon: Plus, label: 'Add Service', color: 'bg-blue-50 text-blue-600' },
            { to: '/admin/gallery', icon: Upload, label: 'Upload Image', color: 'bg-teal-50 text-teal-600' },
            { to: '/admin/videos', icon: Video, label: 'Add Video', color: 'bg-red-50 text-red-600' },
            { to: '/admin/faqs', icon: HelpCircle, label: 'Add FAQ', color: 'bg-purple-50 text-purple-600' },
            { to: '/admin/settings', icon: Settings, label: 'Settings', color: 'bg-gray-50 text-gray-600' },
          ].map(action => (
            <Link key={action.to} to={action.to}
              className="flex flex-col items-center gap-2 bg-[#F5FAFC] rounded-xl p-4 border border-blue-50 hover:border-blue-200 hover:shadow-sm transition-all text-center group">
              <div className={`w-10 h-10 ${action.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <action.icon size={18} />
              </div>
              <span className="text-[#3D5A73] text-xs font-medium">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}


