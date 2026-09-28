import { useEffect, useState, useRef } from 'react'
import { Plus, Edit2, Trash2, Eye, EyeOff, X, Save, AlertTriangle, Upload, Megaphone } from 'lucide-react'
import {
  getAllFlashNewsAdmin, createFlashNews, updateFlashNews, deleteFlashNews
} from '../../services/neurotherapyService'
import { uploadImage } from '../../services/uploadService'
import toast from 'react-hot-toast'

const EMPTY = {
  title: '', title_hi: '', message: '', message_hi: '',
  image: '', link_url: '', link_text: 'Learn More', link_text_hi: 'अधिक जानें',
  is_active: true,
}

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center overflow-y-auto py-8 px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>{children}</div>
    </div>
  )
}

export default function AdminFlashNews() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef(null)

  const load = () => getAllFlashNewsAdmin().then(setItems).catch(console.error).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const openNew = () => { setForm(EMPTY); setEditId(null); setModal(true) }
  const openEdit = (i) => { setForm({ ...i }); setEditId(i.id); setModal(true) }
  const closeModal = () => { setModal(false); setForm(EMPTY); setEditId(null) }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true)
    try {
      const url = await uploadImage(file, 'neurotherapy/flash-news')
      setForm(f => ({ ...f, image: url }))
      toast.success('Image uploaded')
    } catch (err) { toast.error(err.message) } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) { toast.error('Title is required'); return }
    setSaving(true)
    try {
      // If activating this one, deactivate all others first (only one flash news shown at a time)
      if (form.is_active) {
        await Promise.all(
          items.filter(i => i.id !== editId && i.is_active).map(i => updateFlashNews(i.id, { is_active: false }))
        )
      }
      if (editId) {
        await updateFlashNews(editId, form)
        toast.success('Updated')
      } else {
        await createFlashNews(form)
        toast.success('Flash news created')
      }
      closeModal()
      load()
    } catch (err) {
      toast.error(err.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (item) => {
    try {
      if (!item.is_active) {
        // Deactivate all others when activating this one
        await Promise.all(items.filter(i => i.id !== item.id && i.is_active).map(i => updateFlashNews(i.id, { is_active: false })))
      }
      await updateFlashNews(item.id, { is_active: !item.is_active })
      load()
    } catch { toast.error('Update failed') }
  }

  const handleDelete = async (id) => {
    try {
      await deleteFlashNews(id)
      toast.success('Deleted')
      setDeleteConfirm(null)
      load()
    } catch (err) { toast.error(err.message) }
  }

  const inp = "w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[#12304A] text-sm focus:outline-none focus:ring-2 focus:ring-[#0877B8]/30 focus:border-[#0877B8] bg-gray-50"
  const lbl = "block text-xs font-semibold text-[#063B63] mb-1"

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#063B63]">Flash News Popup</h1>
          <p className="text-[#3D5A73] text-sm mt-0.5">Shown to visitors when the site loads. Only one can be active at a time.</p>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 bg-gradient-to-r from-[#063B63] to-[#0877B8] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:shadow-md transition-all">
          <Plus size={16} /> Add Flash News
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#0877B8] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <Megaphone size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-[#7A9BB5] mb-3">No flash news yet</p>
          <button onClick={openNew} className="text-[#0877B8] text-sm font-semibold hover:underline">+ Add your first announcement</button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              {item.image && <img src={item.image} alt={item.title} className="w-full h-32 object-cover" />}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-[#063B63] text-sm">{item.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${item.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                    {item.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                {item.message && <p className="text-[#7A9BB5] text-xs line-clamp-2 mb-3">{item.message}</p>}
                <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                  <button onClick={() => toggleActive(item)}
                    className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-full transition-all ${item.is_active ? 'bg-gray-50 text-gray-600 hover:bg-gray-100' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}>
                    {item.is_active ? <><EyeOff size={11} /> Deactivate</> : <><Eye size={11} /> Activate</>}
                  </button>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(item)} className="p-1.5 text-[#0877B8] hover:bg-blue-50 rounded-lg transition-all"><Edit2 size={14} /></button>
                    <button onClick={() => setDeleteConfirm(item.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      <Modal isOpen={modal} onClose={closeModal}>
        <form onSubmit={handleSave}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-[#063B63]">{editId ? 'Edit Flash News' : 'Add Flash News'}</h2>
            <button type="button" onClick={closeModal}><X size={17} className="text-gray-400" /></button>
          </div>

          <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
            <div>
              <label className={lbl}>Title (English) *</label>
              <input name="title" value={form.title} onChange={handleChange} required className={inp} placeholder="e.g. New Service Launched!" />
            </div>
            <div>
              <label className={lbl}>Title (Hindi)</label>
              <input name="title_hi" value={form.title_hi || ''} onChange={handleChange} className={inp} placeholder="जैसे: नई सेवा शुरू!" />
            </div>
            <div>
              <label className={lbl}>Message (English)</label>
              <textarea name="message" value={form.message || ''} onChange={handleChange} rows={3} className={inp} placeholder="Announcement details..." />
            </div>
            <div>
              <label className={lbl}>Message (Hindi)</label>
              <textarea name="message_hi" value={form.message_hi || ''} onChange={handleChange} rows={3} className={inp} placeholder="घोषणा विवरण..." />
            </div>

            {/* Image */}
            <div>
              <label className={lbl}>Image (Optional)</label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 bg-gray-50 hover:border-[#0877B8] transition-colors">
                {form.image ? (
                  <div className="relative">
                    <img src={form.image} alt="Preview" className="w-full h-32 object-cover rounded-xl" />
                    <button type="button" onClick={() => setForm(f => ({ ...f, image: '' }))}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors">
                      <X size={13} />
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-3">
                    <Upload size={24} className="text-gray-300 mx-auto mb-1" />
                    <p className="text-[#3D5A73] text-xs font-medium">Click to upload image from device</p>
                  </div>
                )}
                <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                  className="mt-2 flex items-center gap-1.5 bg-[#0877B8] hover:bg-[#063B63] text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors disabled:opacity-60">
                  {uploading ? <><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> Uploading...</> : <><Upload size={12} /> {form.image ? 'Change Image' : 'Upload from Device'}</>}
                </button>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </div>
            </div>

            {/* Link */}
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className={lbl}>Link URL (Optional)</label>
                <input name="link_url" value={form.link_url || ''} onChange={handleChange} className={inp} placeholder="/services or https://..." />
              </div>
              <div>
                <label className={lbl}>Button Text</label>
                <input name="link_text" value={form.link_text || ''} onChange={handleChange} className={inp} placeholder="Learn More" />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-[#3D5A73] cursor-pointer select-none">
              <input type="checkbox" name="is_active" checked={!!form.is_active} onChange={handleChange} className="w-4 h-4 rounded accent-[#0877B8]" />
              Active (show this to visitors — deactivates any other active announcement)
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-100">
            <button type="button" onClick={closeModal} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl transition-all">Cancel</button>
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 bg-gradient-to-r from-[#063B63] to-[#0877B8] text-white text-sm font-semibold px-5 py-2.5 rounded-xl disabled:opacity-60 hover:shadow-md transition-all">
              {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={15} />}
              Save
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
        <div className="p-6 text-center">
          <AlertTriangle size={40} className="text-red-500 mx-auto mb-3" />
          <h3 className="font-bold text-[#063B63] text-lg mb-2">Delete Flash News?</h3>
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
