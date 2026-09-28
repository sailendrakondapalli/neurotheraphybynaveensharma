import { useEffect, useState } from 'react'
import { Save, Upload } from 'lucide-react'
import { getWebsiteSettings, updateWebsiteSettings, getContactSettings, updateContactSettings } from '../../services/neurotherapyService'
import { uploadImage } from '../../services/uploadService'
import toast from 'react-hot-toast'

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
        <h2 className="font-bold text-[#063B63] text-base">{title}</h2>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  )
}

export default function AdminSettings() {
  const [site, setSite] = useState({})
  const [contact, setContact] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [activeTab, setActiveTab] = useState('website')

  useEffect(() => {
    Promise.all([getWebsiteSettings(), getContactSettings()])
      .then(([s, c]) => { setSite(s); setContact(c) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleSiteChange = (e) => setSite(s => ({ ...s, [e.target.name]: e.target.value }))
  const handleContactChange = (e) => setContact(c => ({ ...c, [e.target.name]: e.target.value }))

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true)
    try {
      const url = await uploadImage(file, 'neurotherapy/branding')
      setSite(s => ({ ...s, logo_url: url }))
      toast.success('Logo uploaded')
    } catch (err) { toast.error(err.message) } finally { setUploading(false) }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await Promise.all([
        updateWebsiteSettings({ ...site, updated_at: new Date().toISOString() }),
        updateContactSettings({ ...contact, updated_at: new Date().toISOString() }),
      ])
      toast.success('Settings saved')
    } catch (err) {
      toast.error(err.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const inputCls = "w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[#12304A] text-sm focus:outline-none focus:ring-2 focus:ring-[#0877B8]/30 focus:border-[#0877B8] bg-gray-50"
  const labelCls = "block text-xs font-semibold text-[#063B63] mb-1"

  if (loading) return (
    <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-[#0877B8] border-t-transparent rounded-full animate-spin" /></div>
  )

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#063B63]">Website Settings</h1>
          <p className="text-[#3D5A73] text-sm">Manage all site-wide settings</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 bg-gradient-to-r from-[#063B63] to-[#0877B8] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:shadow-md transition-all disabled:opacity-60">
          {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={15} />}
          Save All
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {['website', 'contact', 'social', 'seo'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all capitalize ${activeTab === tab ? 'bg-[#063B63] text-white' : 'bg-white border border-gray-200 text-[#3D5A73] hover:border-blue-200'}`}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'website' && (
        <>
          <Section title="Branding">
            <div>
              <label className={labelCls}>Site Name</label>
              <input name="site_name" value={site.site_name || ''} onChange={handleSiteChange} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Logo</label>
              {site.logo_url && <img src={site.logo_url} alt="Logo" className="h-12 mb-2 rounded-lg object-contain bg-gray-50 p-1" />}
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-[#3D5A73] text-xs font-semibold px-3 py-2.5 rounded-xl cursor-pointer transition-all">
                  <Upload size={14} /> Upload Logo
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>
                {uploading && <span className="text-xs text-[#0877B8]">Uploading...</span>}
              </div>
              <input name="logo_url" value={site.logo_url || ''} onChange={handleSiteChange} className={`${inputCls} mt-2`} placeholder="Or paste logo URL" />
            </div>
            <div>
              <label className={labelCls}>Footer Text</label>
              <textarea name="footer_text" value={site.footer_text || ''} onChange={handleSiteChange} rows={2} className={inputCls} />
            </div>
          </Section>

          <Section title="Service Hours & Area">
            <div>
              <label className={labelCls}>Appointment Hours</label>
              <input name="appointment_hours" value={site.appointment_hours || ''} onChange={handleSiteChange} className={inputCls} placeholder="Mon-Sat: 9:00 AM - 7:00 PM" />
            </div>
            <div>
              <label className={labelCls}>General Service Area</label>
              <input name="service_area" value={site.service_area || ''} onChange={handleSiteChange} className={inputCls} placeholder="Home visits available in your area" />
            </div>
          </Section>
        </>
      )}

      {activeTab === 'contact' && (
        <Section title="Contact Information">
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className={labelCls}>Phone Number</label><input name="phone" value={site.phone || ''} onChange={handleSiteChange} className={inputCls} /></div>
            <div><label className={labelCls}>WhatsApp Number</label><input name="whatsapp" value={site.whatsapp || ''} onChange={handleSiteChange} className={inputCls} /></div>
          </div>
          <div><label className={labelCls}>Email Address</label><input type="email" name="email" value={site.email || ''} onChange={handleSiteChange} className={inputCls} /></div>
          <div><label className={labelCls}>Appointment Hours (Contact Page)</label><input name="appointment_hours" value={contact.appointment_hours || ''} onChange={handleContactChange} className={inputCls} /></div>
          <div><label className={labelCls}>Response Time</label><input name="response_time" value={contact.response_time || ''} onChange={handleContactChange} className={inputCls} placeholder="We typically respond within 2-4 hours" /></div>
          <div><label className={labelCls}>Service Area Note</label><input name="service_area" value={contact.service_area || ''} onChange={handleContactChange} className={inputCls} /></div>
          <div><label className={labelCls}>Important Note (displayed on contact page)</label>
            <textarea name="note" value={contact.note || ''} onChange={handleContactChange} rows={2} className={inputCls} placeholder="This is a HOME VISIT ONLY service..." />
          </div>
        </Section>
      )}

      {activeTab === 'social' && (
        <Section title="Social Media Links">
          <div><label className={labelCls}>Facebook URL</label><input name="facebook_url" value={site.facebook_url || ''} onChange={handleSiteChange} className={inputCls} placeholder="https://facebook.com/..." /></div>
          <div><label className={labelCls}>Instagram URL</label><input name="instagram_url" value={site.instagram_url || ''} onChange={handleSiteChange} className={inputCls} placeholder="https://instagram.com/..." /></div>
          <div><label className={labelCls}>YouTube URL</label><input name="youtube_url" value={site.youtube_url || ''} onChange={handleSiteChange} className={inputCls} placeholder="https://youtube.com/..." /></div>
        </Section>
      )}

      {activeTab === 'seo' && (
        <Section title="SEO Settings">
          <div><label className={labelCls}>SEO Title</label><input name="seo_title" value={site.seo_title || ''} onChange={handleSiteChange} className={inputCls} /></div>
          <div>
            <label className={labelCls}>SEO Description (max 160 chars)</label>
            <textarea name="seo_description" value={site.seo_description || ''} onChange={handleSiteChange} rows={3} className={inputCls} maxLength={160} />
            <p className="text-xs text-[#7A9BB5] mt-1">{(site.seo_description || '').length}/160</p>
          </div>
        </Section>
      )}

      <div className="flex justify-end">
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 bg-gradient-to-r from-[#063B63] to-[#0877B8] text-white text-sm font-semibold px-6 py-3 rounded-xl hover:shadow-md transition-all disabled:opacity-60">
          {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={15} />}
          Save All Settings
        </button>
      </div>
    </div>
  )
}


