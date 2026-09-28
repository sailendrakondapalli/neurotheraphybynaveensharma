import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus, Edit2, Trash2, Check, X, Star, Save, AlertTriangle, Eye, EyeOff } from 'lucide-react'
import { getAllTestimonialsAdmin, createTestimonial, updateTestimonial, deleteTestimonial } from '../../services/neurotherapyService'
import { uploadImage } from '../../services/uploadService'
import toast from 'react-hot-toast'

const EMPTY = { patient_name: '', email: '', phone: '', testimonial: '', rating: 5, image: '', status: 'pending', is_featured: false, display_order: 999 }
const STATUSES = ['pending', 'approved', 'rejected', 'published']
const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-blue-100 text-blue-700',
  rejected: 'bg-red-100 text-red-700',
  published: 'bg-green-100 text-green-700',
}

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center overflow-y-auto py-8 px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl" onClick={e => e.stopPropagation()}>{children}</div>
    </div>
  )
}

export default function AdminTestimonials() {
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [uploading, setUploading] = useState(false)

  const load = () => getAllTestimonialsAdmin().then(setItems).catch(console.error).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const filtered = filter === 'all' ? items : items.filter(i => i.status === filter)

  const openNew = () => { setForm(EMPTY); setEditId(null); setModal(true) }
  const openEdit = (t) => { setForm({ ...t }); setEditId(t.id); setModal(true) }
  const closeModal = () => { setModal(false); setForm(EMPTY); setEditId(null) }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true)
    try {
      const url = await uploadImage(file, 'neurotherapy/testimonials')
      setForm(f => ({ ...f, image: url }))
    } catch (err) { toast.error(err.message) } finally { setUploading(false) }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.patient_name.trim() || !form.testimonial.trim()) { toast.error('Name and testimonial are required'); return }
    setSaving(true)
    try {
      if (editId) { await updateTestimonial(editId, form); toast.success('Updated') }
      else { await createTestimonial(form); toast.success('Created') }
      closeModal(); load()
    } catch (err) { toast.error(err.message) } finally { setSaving(false) }
  }

  const handleStatusChange = async (id, status) => {
    try { await updateTestimonial(id, { status }); load() }
    catch { toast.error('Update failed') }
  }

  const handleDelete = async (id) => {
    try { await deleteTestimonial(id); toast.success('Deleted'); setDeleteConfirm(null); load() }
    catch (err) { toast.error(err.message) }
  }

  const inputCls = "w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[#12304A] text-sm focus:outline-none focus:ring-2 focus:ring-[#0877B8]/30 focus:border-[#0877B8] bg-gray-50"
  const labelCls = "block text-xs font-semibold text-[#063B63] mb-1"

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#063B63]">Testimonials</h1>
          <p className="text-[#3D5A73] text-sm mt-0.5">Manage patient testimonials and reviews</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-gradient-to-r from-[#063B63] to-[#0877B8] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:shadow-md transition-all">
          <Plus size={16} /> Add Testimonial
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['all', ...STATUSES].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all capitalize ${filter === s ? 'bg-[#063B63] text-white' : 'bg-white border border-gray-200 text-[#3D5A73] hover:border-blue-200'}`}>
            {s === 'all' ? `All (${items.length})` : `${s} (${items.filter(i => i.status === s).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-[#0877B8] border-t-transparent rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <p className="text-[#7A9BB5] mb-3">No testimonials in this category</p>
          <button onClick={openNew} className="text-[#0877B8] text-sm font-semibold hover:underline">+ Add testimonial</button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(t => (
            <div key={t.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  {t.image ? <img src={t.image} alt={t.patient_name} className="w-9 h-9 rounded-full object-cover" /> : <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0877B8] to-[#159A8C] flex items-center justify-center text-white font-bold text-sm">{t.patient_name?.charAt(0)}</div>}
                  <div>
                    <p className="font-semibold text-[#063B63] text-sm">{t.patient_name}</p>
                    <div className="flex gap-0.5 mt-0.5">
                      {[1,2,3,4,5].map(i => <Star key={i} size={10} className={i <= t.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />)}
                    </div>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-semibold flex-shrink-0 ${STATUS_COLORS[t.status]}`}>{t.status}</span>
              </div>
              <p className="text-[#3D5A73] text-xs leading-relaxed line-clamp-3 mb-3 italic">"{t.testimonial}"</p>
              {(t.email || t.phone) && (
                <p className="text-[#7A9BB5] text-xs mb-3">{t.phone}{t.phone && t.email ? ' • ' : ''}{t.email}</p>
              )}
              {/* Actions */}
              <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                <div className="flex items-center gap-1">
                  {t.status === 'pending' && (
                    <button onClick={() => handleStatusChange(t.id, 'approved')} className="text-xs bg-blue-50 text-blue-700 px-2 py-1.5 rounded-lg hover:bg-blue-100 transition-all font-semibold flex items-center gap-1">
                      <Check size={11} /> Approve
                    </button>
                  )}
                  {t.status === 'approved' && (
                    <button onClick={() => handleStatusChange(t.id, 'published')} className="text-xs bg-green-50 text-green-700 px-2 py-1.5 rounded-lg hover:bg-green-100 transition-all font-semibold flex items-center gap-1">
                      <Eye size={11} /> Publish
                    </button>
                  )}
                  {(t.status === 'published') && (
                    <button onClick={() => handleStatusChange(t.id, 'approved')} className="text-xs bg-gray-50 text-gray-600 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-all font-semibold flex items-center gap-1">
                      <EyeOff size={11} /> Unpublish
                    </button>
                  )}
                  {t.status !== 'rejected' && (
                    <button onClick={() => handleStatusChange(t.id, 'rejected')} className="text-xs bg-red-50 text-red-600 px-2 py-1.5 rounded-lg hover:bg-red-100 transition-all font-semibold">
                      Reject
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(t)} className="p-1.5 text-[#0877B8] hover:bg-blue-50 rounded-lg transition-all"><Edit2 size={13} /></button>
                  <button onClick={() => setDeleteConfirm(t.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={13} /></button>
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
            <h2 className="font-bold text-[#063B63]">{editId ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
            <button type="button" onClick={closeModal} className="text-gray-400 hover:text-gray-600"><X size={17} /></button>
          </div>
          <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className={labelCls}>Patient Name *</label><input name="patient_name" value={form.patient_name} onChange={handleChange} required className={inputCls} /></div>
              <div><label className={labelCls}>Email</label><input type="email" name="email" value={form.email || ''} onChange={handleChange} className={inputCls} /></div>
            </div>
            <div><label className={labelCls}>Phone</label><input name="phone" value={form.phone || ''} onChange={handleChange} className={inputCls} /></div>
            <div><label className={labelCls}>Testimonial *</label><textarea name="testimonial" value={form.testimonial} onChange={handleChange} required rows={4} className={inputCls} /></div>
            <div>
              <label className={labelCls}>Rating</label>
              <div className="flex gap-2">
                {[1,2,3,4,5].map(i => (
                  <button key={i} type="button" onClick={() => setForm(f => ({...f, rating: i}))} className={`text-2xl transition-transform hover:scale-110 ${i <= form.rating ? 'â­' : 'â˜†'}`}>{i <= form.rating ? 'â­' : 'â˜†'}</button>
                ))}
              </div>
            </div>
            <div>
              <label className={labelCls}>Avatar Image</label>
              {form.image && <img src={form.image} className="w-16 h-16 rounded-full object-cover mb-2" alt="preview" />}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="text-xs mb-1" />
              {uploading && <p className="text-xs text-[#0877B8]">Uploading...</p>}
              <input name="image" value={form.image || ''} onChange={handleChange} className={inputCls} placeholder="Or paste URL" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className={labelCls}>Status</label>
                <select name="status" value={form.status} onChange={handleChange} className={inputCls}>
                  {STATUSES.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                </select>
              </div>
              <div><label className={labelCls}>Display Order</label><input type="number" name="display_order" value={form.display_order} onChange={handleChange} className={inputCls} /></div>
            </div>
            <label className="flex items-center gap-2 text-sm text-[#3D5A73] cursor-pointer">
              <input type="checkbox" name="is_featured" checked={form.is_featured} onChange={handleChange} className="w-4 h-4 rounded" />
              Featured on homepage
            </label>
          </div>
          <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-100">
            <button type="button" onClick={closeModal} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl">Cancel</button>
            <button type="submit" disabled={saving} className="flex items-center gap-2 bg-gradient-to-r from-[#063B63] to-[#0877B8] text-white text-sm font-semibold px-5 py-2.5 rounded-xl disabled:opacity-60">
              {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={15} />}
              Save
            </button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
        <div className="p-6 text-center">
          <AlertTriangle size={40} className="text-red-500 mx-auto mb-3" />
          <h3 className="font-bold text-[#063B63] text-lg mb-2">Delete Testimonial?</h3>
          <p className="text-[#3D5A73] text-sm mb-5">This action cannot be undone.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => setDeleteConfirm(null)} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600">Cancel</button>
            <button onClick={() => handleDelete(deleteConfirm)} className="px-5 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600">Delete</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}


