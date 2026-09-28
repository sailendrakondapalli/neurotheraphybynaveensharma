import { useEffect, useState, useRef } from 'react'
import { Save, Upload, X } from 'lucide-react'
import { getAboutSettings, updateAboutSettings } from '../../services/neurotherapyService'
import { uploadImage } from '../../services/uploadService'
import toast from 'react-hot-toast'

export default function AdminAbout() {
  const [form, setForm] = useState({
    heading: '', description: '', mission: '', vision: '',
    image: '', founded_year: '', experience_text: '', patients_text: '', services_text: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef(null)

  useEffect(() => {
    getAboutSettings()
      .then(data => setForm(f => ({ ...f, ...data })))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true)
    try {
      const url = await uploadImage(file, 'neurotherapy/about')
      setForm(f => ({ ...f, image: url }))
      toast.success('Image uploaded')
    } catch (err) { toast.error(err.message) } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateAboutSettings({ ...form, updated_at: new Date().toISOString() })
      toast.success('About page saved')
    } catch (err) { toast.error(err.message || 'Save failed') }
    finally { setSaving(false) }
  }

  const inp = "w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[#12304A] text-sm focus:outline-none focus:ring-2 focus:ring-[#0877B8]/30 focus:border-[#0877B8] bg-gray-50 transition-all"
  const lbl = "block text-xs font-semibold text-[#063B63] mb-1"

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-[#0877B8] border-t-transparent rounded-full animate-spin" /></div>

  return (
    <form onSubmit={handleSave} className="space-y-5 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#063B63]">About Page</h1>
          <p className="text-[#3D5A73] text-sm mt-0.5">Edit the About page content</p>
        </div>
        <button type="submit" disabled={saving}
          className="flex items-center gap-2 bg-gradient-to-r from-[#063B63] to-[#0877B8] text-white text-sm font-semibold px-5 py-2.5 rounded-xl disabled:opacity-60 hover:shadow-md transition-all">
          {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={15} />}
          Save Changes
        </button>
      </div>

      {/* Main heading & description */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <h2 className="font-bold text-[#063B63] text-sm border-b border-gray-100 pb-2">Main Content</h2>
        <div>
          <label className={lbl}>Page Heading</label>
          <input name="heading" value={form.heading || ''} onChange={handleChange} className={inp} placeholder="About Our Neurotherapy Approach" />
        </div>
        <div>
          <label className={lbl}>Main Description</label>
          <textarea name="description" value={form.description || ''} onChange={handleChange} rows={4} className={inp} placeholder="About us description..." />
        </div>
        <div>
          <label className={lbl}>Mission Statement</label>
          <textarea name="mission" value={form.mission || ''} onChange={handleChange} rows={3} className={inp} placeholder="Our mission..." />
        </div>
        <div>
          <label className={lbl}>Vision Statement</label>
          <textarea name="vision" value={form.vision || ''} onChange={handleChange} rows={3} className={inp} placeholder="Our vision..." />
        </div>
      </div>

      {/* Image */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-bold text-[#063B63] text-sm border-b border-gray-100 pb-2 mb-4">About Image</h2>
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 bg-gray-50 hover:border-[#0877B8] transition-colors">
          {form.image ? (
            <div className="relative">
              <img src={form.image} alt="About" className="w-full h-48 object-cover rounded-xl" />
              <button type="button" onClick={() => setForm(f => ({ ...f, image: '' }))}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                <X size={13} />
              </button>
            </div>
          ) : (
            <div className="text-center py-6">
              <Upload size={28} className="text-gray-300 mx-auto mb-2" />
              <p className="text-[#3D5A73] text-sm font-medium">Upload about image from device</p>
              <p className="text-[#7A9BB5] text-xs mt-1">JPG, PNG, WEBP — max 5MB</p>
            </div>
          )}
          <div className="flex items-center gap-3 mt-3">
            <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
              className="flex items-center gap-1.5 bg-[#0877B8] hover:bg-[#063B63] text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors disabled:opacity-60">
              {uploading ? <><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> Uploading...</> : <><Upload size={12} /> {form.image ? 'Change Image' : 'Upload from Device'}</>}
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

      {/* Stats */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <h2 className="font-bold text-[#063B63] text-sm border-b border-gray-100 pb-2">Stats / Numbers</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className={lbl}>Years of Experience</label>
            <input name="founded_year" value={form.founded_year || ''} onChange={handleChange} className={inp} placeholder="5+" />
          </div>
          <div>
            <label className={lbl}>Experience Label</label>
            <input name="experience_text" value={form.experience_text || ''} onChange={handleChange} className={inp} placeholder="Years of Experience" />
          </div>
          <div>
            <label className={lbl}>Patients Label</label>
            <input name="patients_text" value={form.patients_text || ''} onChange={handleChange} className={inp} placeholder="Patients Supported" />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" disabled={saving}
          className="flex items-center gap-2 bg-gradient-to-r from-[#063B63] to-[#0877B8] text-white text-sm font-semibold px-6 py-3 rounded-xl disabled:opacity-60 hover:shadow-md transition-all">
          {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={15} />}
          Save Changes
        </button>
      </div>
    </form>
  )
}


