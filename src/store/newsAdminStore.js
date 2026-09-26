import { create } from "zustand"
import { supabase } from "../lib/supabase"

export const useNewsAdminStore = create((set, get) => ({
  news: [],
  reporters: [],
  categories: [],
  videos: [],
  breakingNews: [],
  advertisements: [],
  stats: null,
  loading: false,
  notifications: [],
  newsLoaded: false,
  reportersLoaded: false,
  categoriesLoaded: false,
  videosLoaded: false,

  // ===== NEWS =====
  loadNews: async (force = false) => {
    if (!force && get().newsLoaded) return
    set({ loading: true })
    const { data, error } = await supabase
      .from("news")
      .select(`
        *,
        category:categories(id, name, slug),
        reporter:reporters(id, name, designation)
      `)
      .order("created_at", { ascending: false })
    if (error) console.error("Load news error:", error.message)
    set({ news: data || [], loading: false, newsLoaded: true })
  },

  addNews: async (newsData) => {
    const { data, error } = await supabase.from("news").insert(newsData).select(`
      *,
      category:categories(id, name, slug),
      reporter:reporters(id, name, designation)
    `).single()
    if (error) throw new Error(error.message)
    set(s => ({ news: [data, ...s.news] }))
    if (data.is_breaking) {
      get().addNotification(`Breaking news published: "${data.title}"`, "info")
    }
    return data
  },

  updateNews: async (id, updates) => {
    const { data, error} = await supabase.from("news").update(updates).eq("id", id).select(`
      *,
      category:categories(id, name, slug),
      reporter:reporters(id, name, designation)
    `).single()
    if (error) throw new Error(error.message)
    set(s => ({ news: s.news.map(n => n.id === id ? data : n) }))
    return data
  },

  deleteNews: async (id) => {
    const { error } = await supabase.from("news").delete().eq("id", id)
    if (error) throw new Error(error.message)
    set(s => ({ news: s.news.filter(n => n.id !== id) }))
  },

  publishNews: async (id) => {
    const updates = { status: 'published', published_at: new Date().toISOString() }
    return await get().updateNews(id, updates)
  },

  unpublishNews: async (id) => {
    const updates = { status: 'draft' }
    return await get().updateNews(id, updates)
  },

  toggleFeatured: async (id, value) => {
    return await get().updateNews(id, { is_featured: value })
  },

  toggleBreaking: async (id, value) => {
    return await get().updateNews(id, { is_breaking: value })
  },

  toggleTrending: async (id, value) => {
    return await get().updateNews(id, { is_trending: value })
  },

  // ===== REPORTERS =====
  loadReporters: async (force = false) => {
    if (!force && get().reportersLoaded) return
    set({ loading: true })
    const { data, error } = await supabase.from("reporters").select("*").order("created_at", { ascending: false })
    if (error) console.error("Load reporters error:", error.message)
    set({ reporters: data || [], loading: false, reportersLoaded: true })
  },

  addReporter: async (reporterData) => {
    const { data, error } = await supabase.from("reporters").insert(reporterData).select().single()
    if (error) throw new Error(error.message)
    set(s => ({ reporters: [data, ...s.reporters] }))
    return data
  },

  updateReporter: async (id, updates) => {
    const { data, error } = await supabase.from("reporters").update(updates).eq("id", id).select().single()
    if (error) throw new Error(error.message)
    set(s => ({ reporters: s.reporters.map(r => r.id === id ? data : r) }))
    return data
  },

  deleteReporter: async (id) => {
    const { error } = await supabase.from("reporters").delete().eq("id", id)
    if (error) throw new Error(error.message)
    set(s => ({ reporters: s.reporters.filter(r => r.id !== id) }))
  },

  // ===== CATEGORIES =====
  loadCategories: async (force = false) => {
    if (!force && get().categoriesLoaded) return
    set({ loading: true })
    const { data, error } = await supabase.from("categories").select("*").order("display_order", { ascending: true })
    if (error) console.error("Load categories error:", error.message)
    set({ categories: data || [], loading: false, categoriesLoaded: true })
  },

  addCategory: async (categoryData) => {
    const { data, error } = await supabase.from("categories").insert(categoryData).select().single()
    if (error) throw new Error(error.message)
    set(s => ({ categories: [...s.categories, data].sort((a, b) => a.display_order - b.display_order) }))
    return data
  },

  updateCategory: async (id, updates) => {
    const { data, error } = await supabase.from("categories").update(updates).eq("id", id).select().single()
    if (error) throw new Error(error.message)
    set(s => ({ categories: s.categories.map(c => c.id === id ? data : c).sort((a, b) => a.display_order - b.display_order) }))
    return data
  },

  deleteCategory: async (id) => {
    const { error } = await supabase.from("categories").delete().eq("id", id)
    if (error) throw new Error(error.message)
    set(s => ({ categories: s.categories.filter(c => c.id !== id) }))
  },

  // ===== VIDEOS =====
  loadVideos: async (force = false) => {
    if (!force && get().videosLoaded) return
    set({ loading: true })
    const { data, error } = await supabase
      .from("videos")
      .select(`
        *,
        category:categories(id, name, slug)
      `)
      .order("created_at", { ascending: false })
    if (error) console.error("Load videos error:", error.message)
    set({ videos: data || [], loading: false, videosLoaded: true })
  },

  addVideo: async (videoData) => {
    const { data, error } = await supabase.from("videos").insert(videoData).select(`
      *,
      category:categories(id, name, slug)
    `).single()
    if (error) throw new Error(error.message)
    set(s => ({ videos: [data, ...s.videos] }))
    return data
  },

  updateVideo: async (id, updates) => {
    const { data, error } = await supabase.from("videos").update(updates).eq("id", id).select(`
      *,
      category:categories(id, name, slug)
    `).single()
    if (error) throw new Error(error.message)
    set(s => ({ videos: s.videos.map(v => v.id === id ? data : v) }))
    return data
  },

  deleteVideo: async (id) => {
    const { error } = await supabase.from("videos").delete().eq("id", id)
    if (error) throw new Error(error.message)
    set(s => ({ videos: s.videos.filter(v => v.id !== id) }))
  },

  // ===== BREAKING NEWS =====
  loadBreakingNews: async () => {
    set({ loading: true })
    const { data, error } = await supabase.from("breaking_news").select("*").order("display_order", { ascending: true })
    if (error) console.error("Load breaking news error:", error.message)
    set({ breakingNews: data || [], loading: false })
  },

  addBreakingNews: async (breakingData) => {
    const { data, error } = await supabase.from("breaking_news").insert(breakingData).select().single()
    if (error) throw new Error(error.message)
    set(s => ({ breakingNews: [...s.breakingNews, data].sort((a, b) => a.display_order - b.display_order) }))
    return data
  },

  updateBreakingNews: async (id, updates) => {
    const { data, error } = await supabase.from("breaking_news").update(updates).eq("id", id).select().single()
    if (error) throw new Error(error.message)
    set(s => ({ breakingNews: s.breakingNews.map(b => b.id === id ? data : b).sort((a, b) => a.display_order - b.display_order) }))
    return data
  },

  deleteBreakingNews: async (id) => {
    const { error } = await supabase.from("breaking_news").delete().eq("id", id)
    if (error) throw new Error(error.message)
    set(s => ({ breakingNews: s.breakingNews.filter(b => b.id !== id) }))
  },

  // ===== ADVERTISEMENTS =====
  loadAdvertisements: async () => {
    set({ loading: true })
    const { data, error } = await supabase.from("advertisements").select("*").order("display_order", { ascending: true })
    if (error) console.error("Load advertisements error:", error.message)
    set({ advertisements: data || [], loading: false })
  },

  addAdvertisement: async (adData) => {
    const { data, error } = await supabase.from("advertisements").insert(adData).select().single()
    if (error) throw new Error(error.message)
    set(s => ({ advertisements: [...s.advertisements, data].sort((a, b) => a.display_order - b.display_order) }))
    return data
  },

  updateAdvertisement: async (id, updates) => {
    const { data, error } = await supabase.from("advertisements").update(updates).eq("id", id).select().single()
    if (error) throw new Error(error.message)
    set(s => ({ advertisements: s.advertisements.map(a => a.id === id ? data : a).sort((a, b) => a.display_order - b.display_order) }))
    return data
  },

  deleteAdvertisement: async (id) => {
    const { error } = await supabase.from("advertisements").delete().eq("id", id)
    if (error) throw new Error(error.message)
    set(s => ({ advertisements: s.advertisements.filter(a => a.id !== id) }))
  },

  // ===== STATS =====
  computeStats: async () => {
    const { news, reporters, categories, videos } = get()
    
    // Call RPC function for stats
    const { data: statsData } = await supabase.rpc('get_news_stats').catch(() => ({ data: null }))

    // Last 14 days chart data
    const last14 = []
    for (let i = 13; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const ds = d.toDateString()
      const label = d.toLocaleDateString("en-IN", { month: "short", day: "numeric" })
      const dayNews = news.filter(n => new Date(n.created_at).toDateString() === ds && n.status === 'published')
      last14.push({
        date: label,
        published: dayNews.length,
        views: dayNews.reduce((sum, n) => sum + (n.views_count || 0), 0)
      })
    }

    // Category distribution
    const catMap = {}
    news.filter(n => n.status === 'published').forEach(n => {
      const catName = n.category?.name || "Uncategorized"
      catMap[catName] = (catMap[catName] || 0) + 1
    })
    const categoryDistribution = Object.entries(catMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)

    // Top reporters by article count
    const reporterMap = {}
    news.filter(n => n.status === 'published').forEach(n => {
      if (n.reporter) {
        const name = n.reporter.name
        reporterMap[name] = (reporterMap[name] || 0) + 1
      }
    })
    const topReporters = Object.entries(reporterMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8)

    // Recent published news
    const recentNews = news
      .filter(n => n.status === 'published')
      .sort((a, b) => new Date(b.published_at) - new Date(a.published_at))
      .slice(0, 10)

    set({
      stats: {
        ...(statsData || {}),
        last14Days: last14,
        categoryDistribution,
        topReporters,
        recentNews,
        totalNews: news.length,
        publishedNews: news.filter(n => n.status === 'published').length,
        draftNews: news.filter(n => n.status === 'draft').length,
        breakingNews: news.filter(n => n.is_breaking && n.status === 'published').length,
        trendingNews: news.filter(n => n.is_trending && n.status === 'published').length,
        totalReporters: reporters.filter(r => r.status === 'active').length,
        totalVideos: videos.filter(v => v.status === 'active').length,
        totalCategories: categories.filter(c => c.status === 'active').length,
      }
    })
  },

  // ===== NOTIFICATIONS =====
  addNotification: (msg, type = "info") => {
    const n = { id: Date.now(), msg, type, time: new Date() }
    set(s => ({ notifications: [n, ...s.notifications].slice(0, 20) }))
  },

  clearNotification: (id) => {
    set(s => ({ notifications: s.notifications.filter(n => n.id !== id) }))
  },
}))
