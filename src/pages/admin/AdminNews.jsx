import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Edit2, Trash2, Eye, X, Search, Filter, FileText, TrendingUp, AlertCircle, Check } from "lucide-react"
import { useNewsAdminStore } from "../../store/newsAdminStore"
import { uploadProductImage } from "../../services/storageService"
import toast from "react-hot-toast"

export default function AdminNews() {
  const { news, reporters, categories, loadNews, loadReporters, loadCategories, addNews, updateNews, deleteNews, publishNews, unpublishNews, loading } = useNewsAdminStore()
  const [showForm, setShowForm] = useState(false)
  const [editingNews, setEditingNews] = useState(null)
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")

  useEffect(() => {
    loadNews()
    loadReporters()
    loadCategories()
  }, [])

  const filteredNews = news.filter(n => {
    if (filterStatus !== "all" && n.status !== filterStatus) return false
    if (filterCategory !== "all" && n.category_id !== filterCategory) return false
    if (search && !n.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const handleEdit = (newsItem) => {
    setEditingNews(newsItem)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this news article?")) return
    try {
      await deleteNews(id)
      toast.success("News deleted")
    } catch (e) {
      toast.error(e.message)
    }
  }

  const handlePublish = async (id) => {
    try {
      await publishNews(id)
      toast.success("News published")
    } catch (e) {
      toast.error(e.message)
    }
  }

  const handleUnpublish = async (id) => {
    try {
      await unpublishNews(id)
      toast.success("News unpublished")
    } catch (e) {
      toast.error(e.message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">News Management</h1>
          <p className="text-gray-500 text-sm mt-1">{news.length} total articles</p>
        </div>
        <button onClick={() => { setEditingNews(null); setShowForm(true) }}
          className="flex items-center gap-2 bg-[#1B2B5E] text-white px-4 py-2 rounded-lg hover:bg-[#2A3F7E] transition-colors">
          <Plus size={18} /> Add News
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Search</label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by title..."
                className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1B2B5E]" />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Status</label>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1B2B5E]">
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Category</label>
            <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1B2B5E]">
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* News List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading && <div className="p-8 text-center"><div className="w-6 h-6 border-2 border-[#1B2B5E] border-t-transparent rounded-full animate-spin mx-auto" /></div>}
        {!loading && filteredNews.length === 0 && (
          <div className="p-8 text-center text-gray-400">No news articles found</div>
        )}
        {!loading && filteredNews.length > 0 && (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Title</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Category</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Reporter</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Flags</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Views</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredNews.map(item => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-start gap-3">
                      {item.featured_image_url && (
                        <img src={item.featured_image_url} alt="" className="w-12 h-12 object-cover rounded" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 line-clamp-1">{item.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{new Date(item.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.category?.name || '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.reporter?.name || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === 'published' ? 'bg-green-100 text-green-700' :
                      item.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {item.is_featured && <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Featured</span>}
                      {item.is_breaking && <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded">Breaking</span>}
                      {item.is_trending && <span className="text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">Trending</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Eye size={14} className="text-gray-400" />
                      {item.views_count || 0}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {item.status === 'draft' && (
                        <button onClick={() => handlePublish(item.id)}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors" title="Publish">
                          <Check size={16} />
                        </button>
                      )}
                      {item.status === 'published' && (
                        <button onClick={() => handleUnpublish(item.id)}
                          className="p-1.5 text-orange-600 hover:bg-orange-50 rounded transition-colors" title="Unpublish">
                          <X size={16} />
                        </button>
                      )}
                      <button onClick={() => handleEdit(item)}
                        className="p-1.5 text-[#1B2B5E] hover:bg-blue-50 rounded transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <NewsFormModal
            newsItem={editingNews}
            reporters={reporters}
            categories={categories}
            onClose={() => { setShowForm(false); setEditingNews(null) }}
            onSave={async (data) => {
              try {
                if (editingNews) {
                  await updateNews(editingNews.id, data)
                  toast.success("News updated")
                } else {
                  await addNews(data)
                  toast.success("News created")
                }
                setShowForm(false)
                setEditingNews(null)
              } catch (e) {
                toast.error(e.message)
              }
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function NewsFormModal({ newsItem, reporters, categories, onClose, onSave }) {
  const [form, setForm] = useState({
    title: newsItem?.title || "",
    slug: newsItem?.slug || "",
    short_description: newsItem?.short_description || "",
    content: newsItem?.content || "",
    featured_image_url: newsItem?.featured_image_url || "",
    category_id: newsItem?.category_id || "",
    reporter_id: newsItem?.reporter_id || "",
    tags: newsItem?.tags?.join(", ") || "",
    status: newsItem?.status || "draft",
    is_featured: newsItem?.is_featured || false,
    is_breaking: newsItem?.is_breaking || false,
    is_trending: newsItem?.is_trending || false,
    trending_order: newsItem?.trending_order || 0,
  })
  const [uploading, setUploading] = useState(false)

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadProductImage(file)
      setForm(f => ({ ...f, featured_image_url: url }))
      toast.success("Image uploaded")
    } catch (e) {
      toast.error(e.message)
    } finally {
      setUploading(false)
    }
  }

  const generateSlug = (title) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = {
      ...form,
      slug: form.slug || generateSlug(form.title),
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      published_at: form.status === 'published' ? new Date().toISOString() : null,
      // Convert empty strings to null for UUID fields
      category_id: form.category_id || null,
      reporter_id: form.reporter_id || null
    }
    onSave(data)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">{newsItem ? 'Edit' : 'Add'} News</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input value={form.title} onChange={e => setForm({...form, title: e.target.value, slug: generateSlug(e.target.value)})}
              required className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B2B5E]" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input value={form.slug} onChange={e => setForm({...form, slug: e.target.value})}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B2B5E]" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
            <textarea value={form.short_description} onChange={e => setForm({...form, short_description: e.target.value})}
              rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B2B5E]" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
            <textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})}
              required rows={6} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B2B5E]" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image</label>
            {form.featured_image_url && (
              <img src={form.featured_image_url} alt="Preview" className="w-full h-48 object-cover rounded-lg mb-2" />
            )}
            <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select value={form.category_id} onChange={e => setForm({...form, category_id: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B2B5E]">
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reporter</label>
              <select value={form.reporter_id} onChange={e => setForm({...form, reporter_id: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B2B5E]">
                <option value="">Select Reporter</option>
                {reporters.filter(r => r.status === 'active').map(rep => (
                  <option key={rep.id} value={rep.id}>{rep.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
            <input value={form.tags} onChange={e => setForm({...form, tags: e.target.value})}
              placeholder="politics, breaking, exclusive"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B2B5E]" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B2B5E]">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_featured} onChange={e => setForm({...form, is_featured: e.target.checked})}
                className="w-4 h-4 text-[#1B2B5E] rounded focus:ring-[#1B2B5E]" />
              <span className="text-sm text-gray-700">Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_breaking} onChange={e => setForm({...form, is_breaking: e.target.checked})}
                className="w-4 h-4 text-[#1B2B5E] rounded focus:ring-[#1B2B5E]" />
              <span className="text-sm text-gray-700">Breaking</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.is_trending} onChange={e => setForm({...form, is_trending: e.target.checked})}
                className="w-4 h-4 text-[#1B2B5E] rounded focus:ring-[#1B2B5E]" />
              <span className="text-sm text-gray-700">Trending</span>
            </label>
          </div>

          {form.is_trending && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trending Order (0=top)</label>
              <input type="number" value={form.trending_order} onChange={e => setForm({...form, trending_order: parseInt(e.target.value)})}
                min="0" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B2B5E]" />
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button type="submit" disabled={uploading}
              className="flex-1 bg-[#1B2B5E] text-white py-2.5 rounded-lg hover:bg-[#2A3F7E] transition-colors font-medium disabled:opacity-50">
              {newsItem ? 'Update' : 'Create'} News
            </button>
            <button type="button" onClick={onClose}
              className="px-6 border border-gray-200 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
