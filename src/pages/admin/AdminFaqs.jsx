import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2, Eye, EyeOff, X, Save, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react'
import { getAllFaqsAdmin, createFaq, updateFaq, deleteFaq } from '../../services/neurotherapyService'
import toast from 'react-hot-toast'

const EMPTY = { question: '', question_hi: '', answer: '', answer_hi: '', category: '', status: 'draft', display_order: 999 }

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center overflow-y-auto py-8 px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl" onClick={e => e.stopPropagation()}>{children}</div>
    </div>
  )
}

export default function AdminFaqs() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [expanded, setExpanded] = useState(null)

  const load = () => getAllFaqsAdmin().then(setItems).catch(console.error).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const openNew = () => { setForm(EMPTY); setEditId(null); setModal(true) }
  const openEdit = (i) => { setForm({ ...i }); setEditId(i.id); setModal(true) }
  const closeModal = () => { setModal(false); setForm(EMPTY); setEditId(null) }
  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.question.trim() || !form.answer.trim()) { toast.error('Question and answer are required'); return }
    setSaving(true)
    try {
      if (editId) { await updateFaq(editId, form); toast.success('Updated') }
      else { await createFaq(form); toast.success('Added') }
      closeModal(); load()
    } catch (err) { toast.error(err.message) } finally { setSaving(false) }
  }

  const toggleStatus = async (item) => {
    try { await updateFaq(item.id, { status: item.status === 'published' ? 'draft' : 'published' }); load() }
    catch { toast.error('Update failed') }
  }

  const handleDelete = async (id) => {
    try { await deleteFaq(id); toast.success('Deleted'); setDeleteConfirm(null); load() }
    catch (err) { toast.error(err.message) }
  }

  const inputCls = "w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[#12304A] text-sm focus:outline-none focus:ring-2 focus:ring-[#0877B8]/30 focus:border-[#0877B8] bg-gray-50"
  const labelCls = "block text-xs font-semibold text-[#063B63] mb-1"

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#063B63]">FAQs</h1>
          <p className="text-[#3D5A73] text-sm">{items.length} questions</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-gradient-to-r from-[#063B63] to-[#0877B8] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:shadow-md transition-all">
          <Plus size={16} /> Add FAQ
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-[#0877B8] border-t-transparent rounded-full animate-spin" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <p className="text-[#7A9BB5] mb-3">No FAQs yet</p>
          <button onClick={openNew} className="text-[#0877B8] text-sm font-semibold hover:underline">+ Add FAQ</button>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-start gap-3 px-5 py-4">
                <button onClick={() => setExpanded(expanded === item.id ? null : item.id)}
                  className="flex-1 text-left min-w-0">
                  <div className="flex items-start gap-2">
                    {expanded === item.id ? <ChevronUp size={16} className="text-[#0877B8] flex-shrink-0 mt-0.5" /> : <ChevronDown size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />}
                    <p className="font-semibold text-[#063B63] text-sm">{item.question}</p>
                  </div>
                </button>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {item.category && <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{item.category}</span>}
                  <button onClick={() => toggleStatus(item)}
                    className={`p-1.5 rounded-lg transition-all ${item.status === 'published' ? 'text-green-600 bg-green-50' : 'text-gray-400 bg-gray-50'}`}>
                    {item.status === 'published' ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <button onClick={() => openEdit(item)} className="p-1.5 text-[#0877B8] hover:bg-blue-50 rounded-lg transition-all"><Edit2 size={14} /></button>
                  <button onClick={() => setDeleteConfirm(item.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={14} /></button>
                </div>
              </div>
              {expanded === item.id && (
                <div className="px-5 pb-4 border-t border-gray-50">
                  <p className="text-[#3D5A73] text-sm leading-relaxed mt-3">{item.answer}</p>
                  {item.question_hi && <p className="text-[#7A9BB5] text-xs mt-2 italic">{item.question_hi}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modal} onClose={closeModal}>
        <form onSubmit={handleSave}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-[#063B63]">{editId ? 'Edit FAQ' : 'Add FAQ'}</h2>
            <button type="button" onClick={closeModal}><X size={17} className="text-gray-400" /></button>
          </div>
          <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
            <div><label className={labelCls}>Question (English) *</label><input name="question" value={form.question} onChange={handleChange} required className={inputCls} /></div>
            <div><label className={labelCls}>Question (Hindi)</label><input name="question_hi" value={form.question_hi || ''} onChange={handleChange} className={inputCls} /></div>
            <div><label className={labelCls}>Answer (English) *</label><textarea name="answer" value={form.answer} onChange={handleChange} required rows={4} className={inputCls} /></div>
            <div><label className={labelCls}>Answer (Hindi)</label><textarea name="answer_hi" value={form.answer_hi || ''} onChange={handleChange} rows={4} className={inputCls} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className={labelCls}>Category</label><input name="category" value={form.category} onChange={handleChange} className={inputCls} placeholder="e.g. General, Appointments" /></div>
              <div><label className={labelCls}>Status</label>
                <select name="status" value={form.status} onChange={handleChange} className={inputCls}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>
            <div><label className={labelCls}>Display Order</label><input type="number" name="display_order" value={form.display_order} onChange={handleChange} className={inputCls} /></div>
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
          <h3 className="font-bold text-[#063B63] text-lg mb-2">Delete FAQ?</h3>
          <div className="flex gap-3 justify-center mt-5">
            <button onClick={() => setDeleteConfirm(null)} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm">Cancel</button>
            <button onClick={() => handleDelete(deleteConfirm)} className="px-5 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold">Delete</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}


