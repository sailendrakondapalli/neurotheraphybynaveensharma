import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Edit2, Trash2, X, UserCircle } from "lucide-react"
import { useNewsAdminStore } from "../../store/newsAdminStore"
import { uploadProductImage } from "../../services/storageService"
import toast from "react-hot-toast"

export default function AdminReporters() {
  const { reporters, loadReporters, addReporter, updateReporter, deleteReporter, loading } = useNewsAdminStore()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)

  useEffect(() => { loadReporters() }, [])

  const handleDelete = async (id) => {
    if (!confirm("Delete this reporter?")) return
    try {
      await deleteReporter(id)
      toast.success("Reporter deleted")
    } catch (e) {
      toast.error(e.message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reporters</h1>
          <p className="text-gray-500 text-sm mt-1">{reporters.length} total reporters</p>
        </div>
        <button onClick={() => { setEditing(null); setShowForm(true) }}
          className="flex items-center gap-2 bg-[#1B2B5E] text-white px-4 py-2 rounded-lg hover:bg-[#2A3F7E]">
          <Plus size={18} /> Add Reporter
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading && <div className="col-span-full p-8 text-center"><div className="w-6 h-6 border-2 border-[#1B2B5E] border-t-transparent rounded-full animate-spin mx-auto" /></div>}
        {!loading && reporters.map(rep => (
          <motion.div key={rep.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all">
            <div className="flex items-start gap-3">
              {rep.photo_url ? (
                <img src={rep.photo_url} alt={rep.name} className="w-16 h-16 rounded-full object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <UserCircle size={32} className="text-gray-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900">{rep.name}</h3>
                <p className="text-xs text-gray-500">{rep.designation}</p>
                {rep.location && <p className="text-xs text-gray-400 mt-1">{rep.location}</p>}
                <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs ${
                  rep.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {rep.status}
                </span>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => { setEditing(rep); setShowForm(true) }}
                className="flex-1 text-sm text-[#1B2B5E] border border-[#1B2B5E] py-2 rounded-lg hover:bg-blue-50">
                Edit
              </button>
              <button onClick={() => handleDelete(rep.id)}
                className="px-4 text-sm text-red-600 border border-red-200 py-2 rounded-lg hover:bg-red-50">
                <Trash2 size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showForm && (
          <ReporterFormModal
            reporter={editing}
            onClose={() => { setShowForm(false); setEditing(null) }}
            onSave={async (data) => {
              try {
                if (editing) {
                  await updateReporter(editing.id, data)
                  toast.success("Reporter updated")
                } else {
                  await addReporter(data)
                  toast.success("Reporter added")
                }
                setShowForm(false)
                setEditing(null)
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

function ReporterFormModal({ reporter, onClose, onSave }) {
  const [form, setForm] = useState({
    name: reporter?.name || "",
    photo_url: reporter?.photo_url || "",
    designation: reporter?.designation || "Reporter",
    bio: reporter?.bio || "",
    location: reporter?.location || "",
    email: reporter?.email || "",
    phone: reporter?.phone || "",
    facebook_url: reporter?.facebook_url || "",
    twitter_url: reporter?.twitter_url || "",
    instagram_url: reporter?.instagram_url || "",
    linkedin_url: reporter?.linkedin_url || "",
    status: reporter?.status || "active",
  })
  const [uploading, setUploading] = useState(false)

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadProductImage(file)
      setForm(f => ({ ...f, photo_url: url }))
      toast.success("Photo uploaded")
    } catch (e) {
      toast.error(e.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">{reporter ? 'Edit' : 'Add'} Reporter</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSave(form) }} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B2B5E]" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
            {form.photo_url && (
              <img src={form.photo_url} alt="Preview" className="w-24 h-24 rounded-full object-cover mb-2" />
            )}
            <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
              <input value={form.designation} onChange={e => setForm({...form, designation: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B2B5E]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input value={form.location} onChange={e => setForm({...form, location: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B2B5E]" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B2B5E]" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B2B5E]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B2B5E]" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Social Links</label>
            <div className="space-y-2">
              <input value={form.facebook_url} onChange={e => setForm({...form, facebook_url: e.target.value})}
                placeholder="Facebook URL" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1B2B5E]" />
              <input value={form.twitter_url} onChange={e => setForm({...form, twitter_url: e.target.value})}
                placeholder="Twitter URL" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1B2B5E]" />
              <input value={form.instagram_url} onChange={e => setForm({...form, instagram_url: e.target.value})}
                placeholder="Instagram URL" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1B2B5E]" />
              <input value={form.linkedin_url} onChange={e => setForm({...form, linkedin_url: e.target.value})}
                placeholder="LinkedIn URL" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1B2B5E]" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1B2B5E]">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" disabled={uploading}
              className="flex-1 bg-[#1B2B5E] text-white py-2.5 rounded-lg hover:bg-[#2A3F7E] font-medium disabled:opacity-50">
              {reporter ? 'Update' : 'Create'} Reporter
            </button>
            <button type="button" onClick={onClose}
              className="px-6 border border-gray-200 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}


