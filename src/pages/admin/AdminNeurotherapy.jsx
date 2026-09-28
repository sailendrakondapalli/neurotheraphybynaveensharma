import { useEffect, useState, useRef } from 'react'
import { Save, Upload, X, Plus, Trash2 } from 'lucide-react'
import { getNeurotherapySettings, updateNeurotherapySettings } from '../../services/neurotherapyService'
import { uploadImage } from '../../services/uploadService'
import toast from 'react-hot-toast'

export default function AdminNeurotherapy() {
  const [form, setForm] = useState({
    intro_heading: '', intro_text: '',
    what_heading: '', what_text: '',
    approach_heading: '', approach_text: '',
    home_visit_heading: '', home_visit_text: '',
    process_heading: '', process_steps: [],
    image: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef(null)

  useEffect(() => {
    getNeurotherapySettings().then(data => {
      const steps = data.process_steps
        ? (typeof data.process_steps === 'string' ? JSON.parse(data.process_steps) : data.process_steps)
        : []
      setForm(f => ({ ...f, ...data, process_steps: steps }))
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true)
    try {
      const url = await uploadImage(file, 'neurotherapy/page')
      setForm(f => ({ ...f, image: url }))
      toast.success('Image uploaded')
    } catch (err) { toast.error(err.message) } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  // Process steps CRUD
  const addStep = () => setForm(f => ({ ...f, process_steps: [...f.process_steps, { step: '', desc: '' }] }))
  const removeStep = (i) => setForm(f => ({ ...f, process_steps: f.process_steps.filter((_, idx) => idx !== i) }))
  const updateStep = (i, field, val) => setForm(f => ({
    ...f,
    process_steps: f.process_steps.map((s, idx) => idx === i ? { ...s, [field]: val } : s)
  }))

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateNeurotherapySettings({ ...form, updated_at: new Date().toISOString() })
      toast.success('Neurotherapy page saved')
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
          <h1 className="text-2xl font-bold text-[#063B63]">Neurotherapy Page</h1>
          <p className="text-[#3D5A73] text-sm mt-0.5">Edit the Neurotherapy page content</p>
        </div>
        <button type="submit" disabled={saving}
          className="flex items-center gap-2 bg-gradient-to-r from-[#063B63] to-[#0877B8] text-white text-sm font-semibold px-5 py-2.5 rounded-xl disabled:opacity-60 hover:shadow-md transition-all">
          {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={15} />}
          Save Changes
        </button>
      </div>

      {/* Intro */}
      <Section title="Introduction">
        <div>
          <label className={lbl}>Intro Heading</label>
          <input name="intro_heading" value={form.intro_heading || ''} onChange={handleChange} className={inp} placeholder="Understanding Neurotherapy" />
        </div>
        <div>
          <label className={lbl}>Intro Text</label>
          <textarea name="intro_text" value={form.intro_text || ''} onChange={handleChange} rows={3} className={inp} />
        </div>
      </Section>

      {/* What is Neurotherapy */}
      <Section title="What is Neurotherapy?">
        <div>
          <label className={lbl}>Heading</label>
          <input name="what_heading" value={form.what_heading || ''} onChange={handleChange} className={inp} placeholder="What is Neurotherapy?" />
        </div>
        <div>
          <label className={lbl}>Text</label>
          <textarea name="what_text" value={form.what_text || ''} onChange={handleChange} rows={4} className={inp} />
        </div>
      </Section>

      {/* Approach */}
      <Section title="Our Approach">
        <div>
          <label className={lbl}>Heading</label>
          <input name="approach_heading" value={form.approach_heading || ''} onChange={handleChange} className={inp} />
        </div>
        <div>
          <label className={lbl}>Text</label>
          <textarea name="approach_text" value={form.approach_text || ''} onChange={handleChange} rows={4} className={inp} />
        </div>
      </Section>

      {/* Home Visit Model */}
      <Section title="Home Visit Model">
        <div>
          <label className={lbl}>Heading</label>
          <input name="home_visit_heading" value={form.home_visit_heading || ''} onChange={handleChange} className={inp} />
        </div>
        <div>
          <label className={lbl}>Text</label>
          <textarea name="home_visit_text" value={form.home_visit_text || ''} onChange={handleChange} rows={4} className={inp} />
        </div>
      </Section>

      {/* Appointment Process Steps */}
      <Section title="Appointment Process Steps">
        <div>
          <label className={lbl}>Section Heading</label>
          <input name="process_heading" value={form.process_heading || ''} onChange={handleChange} className={inp} placeholder="Appointment Process" />
        </div>
        <div className="space-y-3 mt-2">
          {form.process_steps.map((step, i) => (
            <div key={i} className="flex items-start gap-2 bg-gray-50 rounded-xl p-3 border border-gray-200">
              <div className="w-7 h-7 bg-[#0877B8] text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{i + 1}</div>
              <div className="flex-1 grid sm:grid-cols-2 gap-2">
                <input value={step.step} onChange={e => updateStep(i, 'step', e.target.value)}
                  className={inp} placeholder="Step name" />
                <input value={step.desc} onChange={e => updateStep(i, 'desc', e.target.value)}
                  className={inp} placeholder="Step description" />
              </div>
              <button type="button" onClick={() => removeStep(i)}
                className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all flex-shrink-0">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <button type="button" onClick={addStep}
            className="flex items-center gap-2 text-[#0877B8] text-sm font-semibold hover:underline">
            <Plus size={15} /> Add Step
          </button>
        </div>
      </Section>

      {/* Image */}
      <Section title="Page Image">
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 bg-gray-50 hover:border-[#0877B8] transition-colors">
          {form.image ? (
            <div className="relative">
              <img src={form.image} alt="Neurotherapy" className="w-full h-48 object-cover rounded-xl" />
              <button type="button" onClick={() => setForm(f => ({ ...f, image: '' }))}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                <X size={13} />
              </button>
            </div>
          ) : (
            <div className="text-center py-6">
              <Upload size={28} className="text-gray-300 mx-auto mb-2" />
              <p className="text-[#3D5A73] text-sm font-medium">Upload page image from device</p>
              <p className="text-[#7A9BB5] text-xs mt-1">JPG, PNG, WEBP â€” max 5MB</p>
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
      </Section>

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

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
        <h2 className="font-bold text-[#063B63] text-sm">{title}</h2>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  )
}


