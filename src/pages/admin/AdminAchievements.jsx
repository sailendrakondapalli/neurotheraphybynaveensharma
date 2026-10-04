import { useEffect, useState } from 'react'
import { Award, Plus, Pen, Trash2, Upload, X, Save } from 'lucide-react'
import { getAllAchievementsAdmin, createAchievement, updateAchievement, deleteAchievement } from '../../services/neurotherapyService'
import { uploadImage } from '../../services/uploadService'
import toast from 'react-hot-toast'

export default function AdminAchievements() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({
    title: '', title_hi: '', description: '', description_hi: '',
    image: '', date: '', category: 'achievement', is_published: true, display_order: 0
  })
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [editId, setEditId] = useState(null)

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    try {
      const data = await getAllAchievementsAdmin()
      setItems(data)
    } catch (err) {
      toast.error('Failed to load achievements')
    } finally {
      setLoading(false)
    }
  }

  const openNew = () => {
    setForm({ title: '', title_hi: '', description: '', description_hi: '', image: '', date: '', category: 'achievement', is_published: true, display_order: 0 })
    setPreview(null)
    setEditId(null)
    setModal(true)
  }

  const openEdit = (item) => {
    setForm({
      title: item.title || '',
      title_hi: item.title_hi || '',
      description: item.description || '',
      description_hi: item.description_hi || '',
      image: item.image || '',
      date: item.date || '',
      category: item.category || 'achievement',
      is_published: item.is_published ?? true,
      display_order: item.display_order || 0,
    })
    setPreview(item.image || null)
    setEditId(item.id)
    setModal(true)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) return toast.error('Image must be under 5MB')
    setUploading(true)
    try {
      const url = await uploadImage(file)
      setForm(f => ({ ...f, image: url }))
      setPreview(url)
      toast.success('Image uploaded')
    } catch (err) {
      toast.error('Image upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return toast.error('Title is required')
    try {
      if (editId) {
        await updateAchievement(editId, form)
        toast.success('Achievement updated')
      } else {
        await createAchievement(form)
        toast.success('Achievement created')
      }
      setModal(false)
      load()
    } catch (err) {
      toast.error('Save failed')
    }
  }

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}"?`)) return
    try {
      await deleteAchievement(id)
      toast.success('Deleted')
      load()
    } catch {
      toast.error('Delete failed')
    }
  }

  const inp = 'w-full px-3 py-2.5 text-sm border border-gray-200 rounded-md outline-none focus:border-[#0877B8] focus:ring-1 focus:ring-[#0877B8]/20'
  const lbl = 'block text-[#063B63] text-sm font-semibold mb-1.5'

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-[#0877B8] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-br from-[#0877B8] to-[#159A8C] rounded-lg flex items-center justify-center">
            <Award size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#063B63]">Achievements & Awards</h1>
            <p className="text-[#7A9BB5] text-xs">Manage recognitions and accomplishments</p>
          </div>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-1.5 bg-[#0877B8] hover:bg-[#065a8a] text-white px-4 py-2.5 rounded-md text-sm font-semibold transition-colors">
          <Plus size={15} /> Add Achievement
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <div className="text-5xl mb-3">🏆</div>
          <p className="text-[#7A9BB5] mb-3">No achievements yet</p>
          <button onClick={openNew} className="text-[#0877B8] text-sm font-semibold hover:underline">+ Add your first achievement</button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#f8fcfe] to-[#f0f8fc] border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-bold text-[#063B63] uppercase tracking-wide">Achievement</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-[#063B63] uppercase tracking-wide">Category</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-[#063B63] uppercase tracking-wide">Date</th>
                  <th className="text-left px-4 py-3 text-xs font-bold text-[#063B63] uppercase tracking-wide">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-[#063B63] uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map(item => (
                  <tr key={item.id} className="hover:bg-[#f5fafc] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {item.image ? (
                          <img src={item.image} alt={item.title} className="w-11 h-11 rounded-lg object-cover flex-shrink-0 border border-gray-200" />
                        ) : (
                          <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[#eaf4fb] to-[#dff0f8] flex items-center justify-center flex-shrink-0 border border-gray-200">
                            <Award size={18} className="text-[#0877B8]" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-[#063B63] text-sm line-clamp-1">{item.title}</p>
                          {item.title_hi && <p className="text-[#7A9BB5] text-xs line-clamp-1">{item.title_hi}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        item.category === 'award' ? 'bg-amber-50 text-amber-700' :
                        item.category === 'certification' ? 'bg-blue-50 text-blue-700' :
                        item.category === 'recognition' ? 'bg-purple-50 text-purple-700' :
                        'bg-green-50 text-green-700'
                      }`}>
                        {item.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#4a6070]">
                      {item.date ? new Date(item.date).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${item.is_published ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {item.is_published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => openEdit(item)}
                          className="p-1.5 text-[#0877B8] hover:bg-[#eaf4fb] rounded transition-colors">
                          <Pen size={14} />
                        </button>
                        <button onClick={() => handleDelete(item.id, item.title)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-[#063B63]">{editId ? 'Edit Achievement' : 'Add Achievement'}</h2>
              <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={lbl}>Title (English) *</label>
                  <input name="title" value={form.title} onChange={handleChange} className={inp} required />
                </div>
                <div>
                  <label className={lbl}>Title (Hindi)</label>
                  <input name="title_hi" value={form.title_hi} onChange={handleChange} className={inp} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={lbl}>Description (English)</label>
                  <textarea name="description" value={form.description} onChange={handleChange} rows={3} className={inp} />
                </div>
                <div>
                  <label className={lbl}>Description (Hindi)</label>
                  <textarea name="description_hi" value={form.description_hi} onChange={handleChange} rows={3} className={inp} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={lbl}>Category</label>
                  <select name="category" value={form.category} onChange={handleChange} className={inp}>
                    <option value="achievement">Achievement</option>
                    <option value="award">Award</option>
                    <option value="certification">Certification</option>
                    <option value="recognition">Recognition</option>
                  </select>
                </div>
                <div>
                  <label className={lbl}>Date</label>
                  <input type="date" name="date" value={form.date} onChange={handleChange} className={inp} />
                </div>
                <div>
                  <label className={lbl}>Display Order</label>
                  <input type="number" name="display_order" value={form.display_order} onChange={handleChange} className={inp} />
                </div>
              </div>

              <div>
                <label className={lbl}>Image</label>
                {preview ? (
                  <div className="relative inline-block">
                    <img src={preview} alt="Preview" className="h-32 rounded-lg border-2 border-[#c5e0f5]" />
                    <button type="button" onClick={() => { setForm(f => ({ ...f, image: '' })); setPreview(null) }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow">
                      ×
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-6 cursor-pointer hover:border-[#0877B8] hover:bg-[#f5fafc] transition-all">
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" disabled={uploading} />
                    {uploading ? (
                      <div className="w-8 h-8 border-2 border-[#0877B8] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Upload size={28} className="text-gray-300 mx-auto mb-2" />
                        <p className="text-[#3D5A73] text-sm font-medium">Click to upload image from device</p>
                        <p className="text-[#7A9BB5] text-xs mt-1">JPG, PNG, WEBP — max 5MB</p>
                      </>
                    )}
                  </label>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="is_published" name="is_published" checked={form.is_published} onChange={handleChange}
                  className="w-4 h-4 text-[#0877B8] rounded focus:ring-2 focus:ring-[#0877B8]/20" />
                <label htmlFor="is_published" className="text-sm text-[#4a6070] font-medium cursor-pointer">Publish immediately</label>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <button type="submit"
                  className="flex-1 flex items-center justify-center gap-2 bg-[#0877B8] hover:bg-[#065a8a] text-white font-bold py-2.5 rounded-md transition-colors">
                  <Save size={16} /> {editId ? 'Update Achievement' : 'Create Achievement'}
                </button>
                <button type="button" onClick={() => setModal(false)}
                  className="px-5 py-2.5 text-[#4a6070] hover:bg-gray-100 rounded-md font-semibold transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
