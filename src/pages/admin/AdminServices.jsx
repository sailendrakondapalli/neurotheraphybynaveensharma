import { useEffect, useState, useRef } from 'react'
import { Plus, Edit2, Trash2, Eye, EyeOff, Star, X, Save, AlertTriangle, Upload, Tag } from 'lucide-react'
import {
  getAllServicesAdmin, createService, updateService, deleteService,
  getServiceCategories, createServiceCategory, deleteServiceCategory
} from '../../services/neurotherapyService'
import { uploadImage, generateSlug } from '../../services/uploadService'
import toast from 'react-hot-toast'

const EMPTY = {
  title: '', title_hi: '', slug: '', short_description: '', short_description_hi: '',
  description: '', description_hi: '', image: '', category_id: '', status: 'draft',
  is_featured: false, display_order: 999,
}

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center overflow-y-auto py-6 px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

// â”€â”€ Inline category manager shown inside service form â”€â”€
function CategoryManager({ categories, onCategoryAdded, onCategoryDeleted }) {
  const [newCat, setNewCat] = useState('')
  const [adding, setAdding] = useState(false)
  const [show, setShow] = useState(false)

  const handleAdd = async () => {
    const name = newCat.trim()
    if (!name) return
    setAdding(true)
    try {
      const slug = name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
      const cat = await createServiceCategory({ name, slug })
      toast.success(`Category "${name}" added`)
      setNewCat('')
      onCategoryAdded(cat)
    } catch (err) {
      toast.error(err.message || 'Failed to add category')
    } finally {
      setAdding(false)
    }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"?`)) return
    try {
      await deleteServiceCategory(id)
      toast.success('Category deleted')
      onCategoryDeleted(id)
    } catch (err) {
      toast.error(err.message || 'Delete failed')
    }
  }

  return (
    <div className="border border-[#D4E8F0] rounded-xl overflow-hidden">
      <button type="button" onClick={() => setShow(s => !s)}
        className="w-full flex items-center justify-between px-3 py-2.5 bg-[#F5FAFC] text-xs font-semibold text-[#063B63] hover:bg-blue-50 transition-colors">
        <span className="flex items-center gap-2"><Tag size={13} /> Manage Categories ({categories.length})</span>
        <span className="text-[#0877B8]">{show ? 'â–²' : 'â–¼'}</span>
      </button>
      {show && (
        <div className="p-3 space-y-2 bg-white">
          {/* Add new */}
          <div className="flex gap-2">
            <input
              value={newCat}
              onChange={e => setNewCat(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
              placeholder="New category name..."
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#0877B8] bg-gray-50"
            />
            <button type="button" onClick={handleAdd} disabled={adding || !newCat.trim()}
              className="px-3 py-2 bg-[#159447] text-white text-xs font-bold rounded-lg hover:bg-[#117a3a] disabled:opacity-50 transition-colors whitespace-nowrap">
              {adding ? '...' : '+ Add'}
            </button>
          </div>
          {/* Existing */}
          {categories.length === 0 ? (
            <p className="text-[#7A9BB5] text-xs text-center py-2">No categories yet</p>
          ) : (
            <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto">
              {categories.map(cat => (
                <div key={cat.id} className="flex items-center gap-1 bg-blue-50 border border-blue-100 rounded-full px-2.5 py-1 text-xs text-[#063B63] font-medium">
                  {cat.name}
                  <button type="button" onClick={() => handleDelete(cat.id, cat.name)}
                    className="text-gray-400 hover:text-red-500 transition-colors ml-0.5 leading-none">
                    Ã—
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function AdminServices() {
  const [services, setServices] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef(null)

  const load = () => {
    Promise.all([getAllServicesAdmin(), getServiceCategories()])
      .then(([s, c]) => { setServices(s); setCategories(c) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const openNew = () => { setForm(EMPTY); setEditId(null); setModal(true) }
  const openEdit = (s) => { setForm({ ...s }); setEditId(s.id); setModal(true) }
  const closeModal = () => { setModal(false); setForm(EMPTY); setEditId(null) }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (name === 'title' && !editId) {
      setForm(f => ({ ...f, title: value, slug: generateSlug(value) }))
    } else {
      setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadImage(file, 'neurotherapy/services')
      setForm(f => ({ ...f, image: url }))
      toast.success('Image uploaded successfully')
    } catch (err) {
      toast.error(err.message || 'Upload failed')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) { toast.error('Title is required'); return }
    if (!form.slug.trim()) { toast.error('Slug is required'); return }
    setSaving(true)
    try {
      const payload = {
        ...form,
        // Convert empty strings to null for UUID fields
        category_id: form.category_id || null,
        updated_at: new Date().toISOString()
      }
      if (editId) {
        await updateService(editId, payload)
        toast.success('Service updated')
      } else {
        await createService(payload)
        toast.success('Service created')
      }
      closeModal()
      load()
    } catch (err) {
      toast.error(err.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteService(id)
      toast.success('Service deleted')
      setDeleteConfirm(null)
      load()
    } catch (err) {
      toast.error(err.message || 'Delete failed')
    }
  }

  const toggleStatus = async (s) => {
    try {
      await updateService(s.id, { status: s.status === 'published' ? 'draft' : 'published' })
      load()
    } catch { toast.error('Update failed') }
  }

  const toggleFeatured = async (s) => {
    try {
      await updateService(s.id, { is_featured: !s.is_featured })
      load()
    } catch { toast.error('Update failed') }
  }

  const inp = "w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[#12304A] text-sm focus:outline-none focus:ring-2 focus:ring-[#0877B8]/30 focus:border-[#0877B8] transition-all bg-gray-50"
  const lbl = "block text-xs font-semibold text-[#063B63] mb-1"

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#063B63]">Services</h1>
          <p className="text-[#3D5A73] text-sm mt-0.5">{services.length} services</p>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 bg-gradient-to-r from-[#063B63] to-[#0877B8] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:shadow-md transition-all">
          <Plus size={16} /> Add Service
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#0877B8] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <div className="text-5xl mb-3">ðŸ©º</div>
          <p className="text-[#7A9BB5] mb-3">No services yet</p>
          <button onClick={openNew} className="text-[#0877B8] text-sm font-semibold hover:underline">+ Add your first service</button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 text-[#3D5A73] font-semibold text-xs">Service</th>
                  <th className="text-left px-4 py-3 text-[#3D5A73] font-semibold text-xs hidden md:table-cell">Category</th>
                  <th className="text-left px-4 py-3 text-[#3D5A73] font-semibold text-xs">Status</th>
                  <th className="text-left px-4 py-3 text-[#3D5A73] font-semibold text-xs hidden sm:table-cell">Order</th>
                  <th className="text-left px-4 py-3 text-[#3D5A73] font-semibold text-xs">Featured</th>
                  <th className="text-right px-4 py-3 text-[#3D5A73] font-semibold text-xs">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {services.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                          {s.image
                            ? <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-lg">ðŸ©º</div>}
                        </div>
                        <div>
                          <p className="font-semibold text-[#063B63] text-sm">{s.title}</p>
                          <p className="text-[#7A9BB5] text-xs">{s.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {categories.find(c => c.id === s.category_id)
                        ? <span className="text-xs bg-blue-50 text-[#0877B8] px-2 py-1 rounded-full font-medium">{categories.find(c => c.id === s.category_id).name}</span>
                        : <span className="text-[#7A9BB5] text-xs">â€”</span>}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleStatus(s)}
                        className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${s.status === 'published' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                        {s.status === 'published' ? <Eye size={12} /> : <EyeOff size={12} />}
                        {s.status}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-[#3D5A73] text-xs hidden sm:table-cell">{s.display_order}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleFeatured(s)}
                        className={`p-1.5 rounded-lg transition-all ${s.is_featured ? 'text-amber-400 bg-amber-50' : 'text-gray-300 hover:text-amber-400'}`}>
                        <Star size={16} className={s.is_featured ? 'fill-amber-400' : ''} />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => openEdit(s)} className="p-2 text-[#0877B8] hover:bg-blue-50 rounded-lg transition-all"><Edit2 size={15} /></button>
                        <button onClick={() => setDeleteConfirm(s.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* â”€â”€ Service Form Modal â”€â”€ */}
      <Modal isOpen={modal} onClose={closeModal}>
        <form onSubmit={handleSave}>
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-[#063B63] text-lg">{editId ? 'Edit Service' : 'Add Service'}</h2>
            <button type="button" onClick={closeModal} className="text-gray-400 hover:text-gray-600 p-1"><X size={18} /></button>
          </div>

          <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">

            {/* Titles */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Title (English) *</label>
                <input name="title" value={form.title} onChange={handleChange} required className={inp} placeholder="e.g. Cervical / Neck Pain" />
              </div>
              <div>
                <label className={lbl}>Title (Hindi)</label>
                <input name="title_hi" value={form.title_hi || ''} onChange={handleChange} className={inp} placeholder="à¤œà¥ˆà¤¸à¥‡: à¤¸à¤°à¥à¤µà¤¾à¤‡à¤•à¤² / à¤—à¤°à¥à¤¦à¤¨ à¤¦à¤°à¥à¤¦" />
              </div>
            </div>

            {/* Slug */}
            <div>
              <label className={lbl}>URL Slug (auto-filled)</label>
              <input name="slug" value={form.slug || ''} onChange={handleChange} className={inp} placeholder="cervical-neck-pain" />
            </div>

            {/* Short descriptions */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Short Description (English)</label>
                <textarea name="short_description" value={form.short_description || ''} onChange={handleChange} rows={2} className={inp} placeholder="Brief summary..." />
              </div>
              <div>
                <label className={lbl}>Short Description (Hindi)</label>
                <textarea name="short_description_hi" value={form.short_description_hi || ''} onChange={handleChange} rows={2} className={inp} placeholder="à¤¸à¤‚à¤•à¥à¤·à¤¿à¤ªà¥à¤¤ à¤µà¤¿à¤µà¤°à¤£..." />
              </div>
            </div>

            {/* Full descriptions */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Full Description (English)</label>
                <textarea name="description" value={form.description || ''} onChange={handleChange} rows={4} className={inp} placeholder="Full service description..." />
              </div>
              <div>
                <label className={lbl}>Full Description (Hindi)</label>
                <textarea name="description_hi" value={form.description_hi || ''} onChange={handleChange} rows={4} className={inp} placeholder="à¤ªà¥‚à¤°à¤¾ à¤µà¤¿à¤µà¤°à¤£..." />
              </div>
            </div>

            {/* â”€â”€ IMAGE UPLOAD â”€â”€ */}
            <div>
              <label className={lbl}>Service Image</label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 bg-gray-50 hover:border-[#0877B8] transition-colors">
                {form.image ? (
                  <div className="relative">
                    <img src={form.image} alt="Preview" className="w-full h-36 object-cover rounded-xl" />
                    <button type="button" onClick={() => setForm(f => ({ ...f, image: '' }))}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors">
                      <X size={13} />
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Upload size={28} className="text-gray-300 mx-auto mb-2" />
                    <p className="text-[#3D5A73] text-sm font-medium">Click to upload image from device</p>
                    <p className="text-[#7A9BB5] text-xs mt-1">JPG, PNG, WEBP â€” max 5MB</p>
                  </div>
                )}
                <div className="flex items-center gap-3 mt-3">
                  <button type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-2 bg-[#0877B8] hover:bg-[#063B63] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-60">
                    {uploading
                      ? <><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> Uploading...</>
                      : <><Upload size={13} /> {form.image ? 'Change Image' : 'Upload from Device'}</>}
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  {!form.image && <span className="text-[#7A9BB5] text-xs">or</span>}
                </div>
                {!form.image && (
                  <input name="image" value={form.image || ''} onChange={handleChange}
                    className="w-full mt-2 px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-[#0877B8]"
                    placeholder="Paste image URL instead..." />
                )}
              </div>
            </div>

            {/* â”€â”€ CATEGORY + Status + Order â”€â”€ */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className={lbl}>Category</label>
                <select name="category_id" value={form.category_id || ''} onChange={handleChange} className={inp}>
                  <option value="">â€” No Category â€”</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className={lbl}>Status</label>
                <select name="status" value={form.status} onChange={handleChange} className={inp}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div>
                <label className={lbl}>Display Order</label>
                <input type="number" name="display_order" value={form.display_order} onChange={handleChange} className={inp} />
              </div>
            </div>

            {/* â”€â”€ CATEGORY MANAGER (inline) â”€â”€ */}
            <CategoryManager
              categories={categories}
              onCategoryAdded={cat => setCategories(c => [...c, cat])}
              onCategoryDeleted={id => setCategories(c => c.filter(x => x.id !== id))}
            />

            {/* Featured */}
            <label className="flex items-center gap-2 text-sm text-[#3D5A73] cursor-pointer select-none">
              <input type="checkbox" name="is_featured" checked={!!form.is_featured} onChange={handleChange} className="w-4 h-4 rounded accent-[#0877B8]" />
              â­ Featured service (shown on homepage)
            </label>

          </div>

          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100">
            <button type="button" onClick={closeModal} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition-all">Cancel</button>
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 bg-gradient-to-r from-[#063B63] to-[#0877B8] text-white text-sm font-semibold px-5 py-2.5 rounded-xl disabled:opacity-60 hover:shadow-md transition-all">
              {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={15} />}
              {saving ? 'Saving...' : 'Save Service'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
        <div className="p-6 text-center">
          <AlertTriangle size={40} className="text-red-500 mx-auto mb-3" />
          <h3 className="font-bold text-[#063B63] text-lg mb-2">Delete Service?</h3>
          <p className="text-[#3D5A73] text-sm mb-5">This action cannot be undone.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => setDeleteConfirm(null)} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
            <button onClick={() => handleDelete(deleteConfirm)} className="px-5 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600">Delete</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}


