import { useEffect, useState, useRef } from 'react'
import { Plus, Edit2, Trash2, Eye, EyeOff, X, Save, AlertTriangle, Upload } from 'lucide-react'
import { getAllBenefitsAdmin, createBenefit, updateBenefit, deleteBenefit } from '../../services/neurotherapyService'
import { uploadImage } from '../../services/uploadService'
import toast from 'react-hot-toast'

const EMPTY = { title: '', title_hi: '', description: '', description_hi: '', icon: '', image: '', status: 'published', display_order: 999 }

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center overflow-y-auto py-8 px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl" onClick={e => e.stopPropagation()}>{children}</div>
    </div>
  )
}

const EMOJI_OPTIONS = ['ðŸ ', 'ðŸ“…', 'ðŸ¤', 'ðŸ’š', 'âœ¨', 'ðŸ“ž', 'ðŸ’†', 'ðŸ©º', 'â¤ï¸', 'ðŸŒ¿', 'â­', 'ðŸ”’', 'ðŸ‘´', 'ðŸ‘©', 'ðŸ§ ', 'ðŸ¦´']

export default function AdminBenefits() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef(null)

  const load = () => getAllBenefitsAdmin().then(setItems).catch(console.error).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const openNew = () => { setForm(EMPTY); setEditId(null); setModal(true) }
  const openEdit = (i) => { setForm({ ...i }); setEditId(i.id); setModal(true) }
  const closeModal = () => { setModal(false); setForm(EMPTY); setEditId(null) }
  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true)
    try {
      const url = await uploadImage(file, 'neurotherapy/benefits')
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
      if (editId) { await updateBenefit(editId, form); toast.success('Updated') }
      else { await createBenefit(form); toast.success('Created') }
      closeModal(); load()
    } catch (err) { toast.error(err.message) } finally { setSaving(false) }
  }

  const toggleStatus = async (item) => {
    try { await updateBenefit(item.id, { status: item.status === 'published' ? 'draft' : 'published' }); load() }
    catch { toast.error('Update failed') }
  }

  const handleDelete = async (id) => {
    try { await deleteBenefit(id); toast.success('Deleted'); setDeleteConfirm(null); load() }
    catch (err) { toast.error(err.message) }
  }

  const inputCls = "w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[#12304A] text-sm focus:outline-none focus:ring-2 focus:ring-[#0877B8]/30 focus:border-[#0877B8] bg-gray-50"
  const labelCls = "block text-xs font-semibold text-[#063B63] mb-1"

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#063B63]">Benefits</h1>
          <p className="text-[#3D5A73] text-sm">{items.length} benefits</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-gradient-to-r from-[#063B63] to-[#0877B8] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:shadow-md transition-all">
          <Plus size={16} /> Add Benefit
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-[#0877B8] border-t-transparent rounded-full animate-spin" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <p className="text-[#7A9BB5] mb-3">No benefits yet</p>
          <button onClick={openNew} className="text-[#0877B8] text-sm font-semibold hover:underline">+ Add benefit</button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{item.icon || 'âœ¨'}</span>
                  <div>
                    <p className="font-semibold text-[#063B63] text-sm">{item.title}</p>
                    {item.title_hi && <p className="text-[#7A9BB5] text-xs">{item.title_hi}</p>}
                  </div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${item.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{item.status}</span>
              </div>
              {item.image && <img src={item.image} alt={item.title} className="w-full h-24 object-cover rounded-xl mb-3" />}
              {item.description && <p className="text-[#3D5A73] text-xs line-clamp-2 mb-3">{item.description}</p>}
              <div className="flex items-center justify-between border-t border-gray-50 pt-3">
                <button onClick={() => toggleStatus(item)} className={`flex items-center gap-1 text-xs font-semibold px-2 py-1.5 rounded-lg transition-all ${item.status === 'published' ? 'text-green-600 hover:bg-green-50' : 'text-gray-500 hover:bg-gray-50'}`}>
                  {item.status === 'published' ? <><EyeOff size={12} /> Unpublish</> : <><Eye size={12} /> Publish</>}
                </button>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(item)} className="p-1.5 text-[#0877B8] hover:bg-blue-50 rounded-lg"><Edit2 size={14} /></button>
                  <button onClick={() => setDeleteConfirm(item.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modal} onClose={closeModal}>
        <form onSubmit={handleSave}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-[#063B63]">{editId ? 'Edit Benefit' : 'Add Benefit'}</h2>
            <button type="button" onClick={closeModal}><X size={17} className="text-gray-400" /></button>
          </div>
          <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className={labelCls}>Title (English) *</label><input name="title" value={form.title} onChange={handleChange} required className={inputCls} /></div>
              <div><label className={labelCls}>Title (Hindi)</label><input name="title_hi" value={form.title_hi || ''} onChange={handleChange} className={inputCls} /></div>
            </div>
            <div>
              <label className={labelCls}>Icon (Emoji)</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {EMOJI_OPTIONS.map(e => (
                  <button key={e} type="button" onClick={() => setForm(f => ({...f, icon: e}))}
                    className={`text-xl p-1.5 rounded-lg transition-all border ${form.icon === e ? 'border-[#0877B8] bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    {e}
                  </button>
                ))}
              </div>
              <input name="icon" value={form.icon || ''} onChange={handleChange} className={inputCls} placeholder="Or type any emoji" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><label className={labelCls}>Description (English)</label><textarea name="description" value={form.description || ''} onChange={handleChange} rows={3} className={inputCls} /></div>
              <div><label className={labelCls}>Description (Hindi)</label><textarea name="description_hi" value={form.description_hi || ''} onChange={handleChange} rows={3} className={inputCls} /></div>
            </div>
            <div>
              <label className={labelCls}>Image (Optional)</label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 bg-gray-50 hover:border-[#0877B8] transition-colors">
                {form.image ? (
                  <div className="relative">
                    <img src={form.image} alt="preview" className="w-full h-28 object-cover rounded-xl" />
                    <button type="button" onClick={() => setForm(f => ({ ...f, image: '' }))}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors">
                      <X size={13} />
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-3">
                    <Upload size={24} className="text-gray-300 mx-auto mb-1" />
                    <p className="text-[#3D5A73] text-xs font-medium">Click to upload image from device</p>
                    <p className="text-[#7A9BB5] text-[11px] mt-0.5">JPG, PNG, WEBP â€” max 5MB</p>
                  </div>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <button type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-1.5 bg-[#0877B8] hover:bg-[#063B63] text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors disabled:opacity-60">
                    {uploading
                      ? <><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> Uploading...</>
                      : <><Upload size={12} /> {form.image ? 'Change Image' : 'Upload from Device'}</>}
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </div>
                {!form.image && (
                  <input name="image" value={form.image || ''} onChange={handleChange}
                    className="w-full mt-2 px-3 py-2 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-[#0877B8]"
                    placeholder="Or paste image URL..." />
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelCls}>Status</label>
                <select name="status" value={form.status} onChange={handleChange} className={inputCls}>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <div><label className={labelCls}>Display Order</label><input type="number" name="display_order" value={form.display_order} onChange={handleChange} className={inputCls} /></div>
            </div>
          </div>
          <div className="flex justify-end gap-3 px-5 py-4 border-t border-gray-100">
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
          <h3 className="font-bold text-[#063B63] text-lg mb-2">Delete Benefit?</h3>
          <div className="flex gap-3 justify-center mt-5">
            <button onClick={() => setDeleteConfirm(null)} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm">Cancel</button>
            <button onClick={() => handleDelete(deleteConfirm)} className="px-5 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold">Delete</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}


