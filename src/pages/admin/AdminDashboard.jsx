import { useEffect } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { FileText, TrendingUp, Eye, Users, Video, AlertCircle, ArrowRight, Clock } from "lucide-react"
import { useNewsAdminStore } from "../../store/newsAdminStore"
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const COLORS = ["#1B2B5E", "#DC2626", "#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#6366F1"]

function StatCard({ icon: Icon, label, value, subtext, link, trend, color = "blue" }) {
  const bgColors = {
    blue: "bg-blue-50",
    red: "bg-red-50",
    green: "bg-green-50",
    purple: "bg-purple-50",
    orange: "bg-orange-50"
  }
  const textColors = {
    blue: "text-[#1B2B5E]",
    red: "text-red-600",
    green: "text-green-600",
    purple: "text-purple-600",
    orange: "text-orange-600"
  }
  
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}
      className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${bgColors[color]}`}>
          <Icon size={20} className={textColors[color]} />
        </div>
        {trend && (
          <div className={"flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full " + (trend > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700")}>
            <TrendingUp size={12} className={trend < 0 ? "rotate-180" : ""} />
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        <p className="text-sm text-gray-500">{label}</p>
        {subtext && <p className="text-xs text-gray-400">{subtext}</p>}
      </div>
      {link && (
        <Link to={link} className="mt-3 flex items-center text-xs text-[#1B2B5E] hover:underline font-medium">
          View details <ArrowRight size={12} className="ml-1" />
        </Link>
      )}
    </motion.div>
  )
}

export default function AdminDashboard() {
  const { stats, loadNews, loadReporters, loadCategories, loadVideos, computeStats, loading } = useNewsAdminStore()

  useEffect(() => {
    const load = async () => {
      await Promise.all([loadNews(), loadReporters(), loadCategories(), loadVideos()])
      await computeStats()
    }
    load()
  }, [])

  if (loading && !stats) return <div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-[#1B2B5E] border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">SR TV NEWS Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's your news channel overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FileText} label="Total News" value={stats?.totalNews || 0} subtext={`${stats?.publishedNews || 0} published`} link="/admin/news" color="blue" />
        <StatCard icon={AlertCircle} label="Breaking News" value={stats?.breakingNews || 0} subtext="Active breaking stories" link="/admin/breaking-news" color="red" />
        <StatCard icon={TrendingUp} label="Trending News" value={stats?.trendingNews || 0} subtext="Currently trending" link="/admin/trending-news" color="orange" />
        <StatCard icon={Eye} label="Total Views" value={(stats?.total_views || 0).toLocaleString()} subtext="All-time views" color="green" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Reporters" value={stats?.totalReporters || 0} subtext="Active reporters" link="/admin/reporters" color="purple" />
        <StatCard icon={Video} label="Videos" value={stats?.totalVideos || 0} subtext="Published videos" link="/admin/videos" color="blue" />
        <StatCard icon={FileText} label="Categories" value={stats?.totalCategories || 0} link="/admin/categories" color="green" />
        <StatCard icon={Clock} label="Draft News" value={stats?.draftNews || 0} subtext="Unpublished drafts" link="/admin/news" color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-[#1B2B5E]" /> Publishing Activity (Last 14 Days)
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={stats?.last14Days || []}>
              <defs>
                <linearGradient id="colorPublished" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1B2B5E" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#1B2B5E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#888" }} />
              <YAxis tick={{ fontSize: 11, fill: "#888" }} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }} />
              <Area type="monotone" dataKey="published" stroke="#1B2B5E" fillOpacity={1} fill="url(#colorPublished)" name="Published" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText size={18} className="text-red-600" /> News by Category
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={stats?.categoryDistribution || []} cx="50%" cy="50%" labelLine={false}
                label={({ name, percent }) => percent > 0.05 ? `${name} (${(percent * 100).toFixed(0)}%)` : ""}
                outerRadius={80} fill="#8884d8" dataKey="value">
                {(stats?.categoryDistribution || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Reporters</h3>
          <div className="space-y-2">
            {(stats?.topReporters || []).map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-gray-700 truncate flex-1 mr-2">{item.name}</span>
                <span className="text-gray-900 font-semibold">{item.count} articles</span>
              </div>
            ))}
            {(!stats?.topReporters || stats.topReporters.length === 0) && (
              <p className="text-gray-400 text-xs">No reporters yet</p>
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Published News</h3>
          <div className="space-y-3">
            {(stats?.recentNews || []).slice(0, 5).map((item, i) => (
              <div key={i} className="text-sm border-b border-gray-100 pb-2 last:border-0">
                <Link to={`/admin/news`} className="text-gray-900 font-medium hover:text-[#1B2B5E] line-clamp-1">
                  {item.title}
                </Link>
                <p className="text-gray-400 text-xs mt-0.5">
                  {new Date(item.published_at).toLocaleDateString()} • {item.category?.name || 'Uncategorized'}
                </p>
              </div>
            ))}
            {(!stats?.recentNews || stats.recentNews.length === 0) && (
              <p className="text-gray-400 text-xs">No published news yet</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
