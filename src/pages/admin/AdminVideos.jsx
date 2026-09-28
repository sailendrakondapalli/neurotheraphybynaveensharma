import { useEffect, useState, useRef } from 'react'
import { Plus, Edit2, Trash2, Eye, EyeOff, X, Save, AlertTriangle, Play, Upload, Link as LinkIcon } from 'lucide-react'
import { getAllVideosAdmin, createVideo, updateVideo, deleteVideo } from '../../services/neurotherapyService'
import { uploadImage, getYouTubeThumbnail } from '../../services/uploadService'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

const BUCKET = 'neurotherapy-media'
const EMPTY = { title: '', description: '', thumbnail: '', video_url: '', category: '', status: 'draft', display_order: 999 }

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center overflow-y-auto py-8 px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>{children}</div>
    </div>
  )
}

// Upload a video file to Supabase storage
async function uploadVideoFile(file, onProgress) {
  const ext = file.name.split('.').pop().toLowerCase()
  const allowed = ['mp4', 'mov', 'webm', 'avi', 'mkv', 'm4v']
  if (!allowed.includes(ext)) throw new Error('Only MP4, MOV, WEBM, AVI video files allowed')
  if (file.size > 200 * 1024 * 1024) throw new Error('Video must be under 200MB')

  const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
  const filePath = `neurotherapy/videos/${fileName}`

  const { error } = await supabase.storage.from(BUCKET).upload(filePath, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type,
  })
  if (error) throw error

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath)
  return data.publicUrl
}

export default function AdminVideos() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [uploadingThumb, setUploadingThumb] = useState(false)
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [videoProgress, setVideoProgress] = useState(0)
  // 'url' = YouTube/URL mode, 'device' = upload from device
  const [videoMode, setVideoMode] = useState('url')
  const thumbRef = useRef(null)
  const videoRef = useRef(null)

  const load = () => getAllVideosAdmin().then(setItems).catch(console.error).finally(() => setLoading(false))
  useEffect(() => { load() }, [])

  const openNew = () => { setForm(EMPTY); setEditId(null); setVideoMode('url'); setVideoProgress(0); setModal(true) }
  const openEdit = (i) => {
    setForm({ ...i })
    setEditId(i.id)
    // Detect if existing video is a device upload (not YouTube)
    const isYT = i.video_url?.includes('youtube') || i.video_url?.includes('youtu.be')
    setVideoMode(isYT || !i.video_url ? 'url' : 'device')
    setVideoProgress(0)
    setModal(true)
  }
  const closeModal = () => { setModal(false); setForm(EMPTY); setEditId(null); setVideoProgress(0) }
  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  // Thumbnail upload
  const handleThumbUpload = async (e) => {
    const file = e.target.files?.[0]; if (!file) return
    setUploadingThumb(true)
    try {
      const url = await uploadImage(file, 'neurotherapy/video-thumbnails')
      setForm(f => ({ ...f, thumbnail: url }))
      toast.success('Thumbnail uploaded')
    } catch (err) { toast.error(err.message) } finally {
      setUploadingThumb(false)
      if (thumbRef.current) thumbRef.current.value = ''
    }
  }

  // Video file upload from device
  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0]; if (!file) return
    setUploadingVideo(true)
    setVideoProgress(0)
    try {
      toast.loading('Uploading video... please wait', { id: 'video-upload' })
      const url = await uploadVideoFile(file)
      setForm(f => ({ ...f, video_url: url }))
      setVideoProgress(100)
      toast.success('Video uploaded successfully', { id: 'video-upload' })
    } catch (err) {
      toast.error(err.message, { id: 'video-upload' })
    } finally {
      setUploadingVideo(false)
      if (videoRef.current) videoRef.current.value = ''
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) { toast.error('Title is required'); return }
    if (!form.video_url.trim()) { toast.error('Video URL or file is required'); return }
    const thumbnail = form.thumbnail || getYouTubeThumbnail(form.video_url) || ''
    setSaving(true)
    try {
      const payload = { ...form, thumbnail }
      if (editId) { await updateVideo(editId, payload); toast.success('Updated') }
      else { await createVideo(payload); toast.success('Added') }
      closeModal(); load()
    } catch (err) { toast.error(err.message) } finally { setSaving(false) }
  }

  const toggleStatus = async (item) => {
    try { await updateVideo(item.id, { status: item.status === 'published' ? 'draft' : 'published' }); load() }
    catch { toast.error('Update failed') }
  }

  const handleDelete = async (id) => {
    try { await deleteVideo(id); toast.success('Deleted'); setDeleteConfirm(null); load() }
    catch (err) { toast.error(err.message) }
  }

  const inp = "w-full px-3 py-2.5 rounded-xl border border-gray-200 text-[#12304A] text-sm focus:outline-none focus:ring-2 focus:ring-[#0877B8]/30 focus:border-[#0877B8] bg-gray-50"
  const lbl = "block text-xs font-semibold text-[#063B63] mb-1"

  const currentThumb = form.thumbnail || (videoMode === 'url' ? getYouTubeThumbnail(form.video_url) : null)
  const isDeviceVideo = form.video_url && !form.video_url.includes('youtube') && !form.video_url.includes('youtu.be') && form.video_url.startsWith('http')

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#063B63]">Videos</h1>
          <p className="text-[#3D5A73] text-sm">{items.length} videos</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-gradient-to-r from-[#063B63] to-[#0877B8] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:shadow-md transition-all">
          <Plus size={16} /> Add Video
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-[#0877B8] border-t-transparent rounded-full animate-spin" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <div className="text-5xl mb-3">ðŸŽ¥</div>
          <p className="text-[#7A9BB5] mb-3">No videos yet</p>
          <button onClick={openNew} className="text-[#0877B8] text-sm font-semibold hover:underline">+ Add video</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item => {
            const thumb = item.thumbnail || getYouTubeThumbnail(item.video_url)
            const isDevice = item.video_url && !item.video_url.includes('youtube') && !item.video_url.includes('youtu.be')
            return (
              <div key={item.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all">
                <div className="relative h-40 bg-gray-200">
                  {thumb ? <img src={thumb} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
                    : <div className="w-full h-full bg-gradient-to-br from-[#063B63] to-[#0877B8] flex items-center justify-center"><Play size={32} className="text-white" /></div>}
                  <div className="absolute top-2 left-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${isDevice ? 'bg-purple-100 text-purple-700' : 'bg-red-100 text-red-600'}`}>
                      {isDevice ? 'ðŸ“ Device' : 'â–¶ YouTube'}
                    </span>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${item.status === 'published' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <p className="font-semibold text-[#063B63] text-sm line-clamp-1">{item.title}</p>
                  {item.category && <p className="text-[#7A9BB5] text-xs mt-0.5">{item.category}</p>}
                  <div className="flex items-center justify-between mt-3">
                    <button onClick={() => toggleStatus(item)} className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-full transition-all ${item.status === 'published' ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                      {item.status === 'published' ? <><EyeOff size={11} /> Unpublish</> : <><Eye size={11} /> Publish</>}
                    </button>
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(item)} className="p-1.5 text-[#0877B8] hover:bg-blue-50 rounded-lg transition-all"><Edit2 size={14} /></button>
                      <button onClick={() => setDeleteConfirm(item.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={14} /></button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* â”€â”€ Add/Edit Modal â”€â”€ */}
      <Modal isOpen={modal} onClose={closeModal}>
        <form onSubmit={handleSave}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-[#063B63]">{editId ? 'Edit Video' : 'Add Video'}</h2>
            <button type="button" onClick={closeModal}><X size={17} className="text-gray-400" /></button>
          </div>

          <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
            {/* Title */}
            <div>
              <label className={lbl}>Title *</label>
              <input name="title" value={form.title} onChange={handleChange} required className={inp} placeholder="Video title" />
            </div>

            {/* Description */}
            <div>
              <label className={lbl}>Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={2} className={inp} placeholder="Brief description..." />
            </div>

            {/* â”€â”€ VIDEO SOURCE â”€â”€ */}
            <div>
              <label className={lbl}>Video Source *</label>
              {/* Mode switcher */}
              <div className="flex gap-2 mb-3">
                <button type="button" onClick={() => { setVideoMode('url'); setForm(f => ({ ...f, video_url: '' })) }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${videoMode === 'url' ? 'border-[#0877B8] bg-blue-50 text-[#0877B8]' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                  <LinkIcon size={15} /> YouTube / URL
                </button>
                <button type="button" onClick={() => { setVideoMode('device'); setForm(f => ({ ...f, video_url: '' })) }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${videoMode === 'device' ? 'border-[#159447] bg-green-50 text-[#159447]' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                  <Upload size={15} /> Upload from Device
                </button>
              </div>

              {videoMode === 'url' ? (
                /* YouTube / URL input */
                <div>
                  <input name="video_url" value={form.video_url} onChange={handleChange}
                    className={inp} placeholder="https://www.youtube.com/watch?v=..." />
                  <p className="text-[#7A9BB5] text-xs mt-1">Paste YouTube URL â€” thumbnail auto-detected</p>
                </div>
              ) : (
                /* Upload from device */
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 bg-gray-50 hover:border-[#159447] transition-colors">
                  {form.video_url && isDeviceVideo ? (
                    <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-3">
                      <div className="w-10 h-10 bg-[#159447] rounded-full flex items-center justify-center flex-shrink-0">
                        <Play size={16} className="text-white ml-0.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[#159447] font-semibold text-sm">Video uploaded âœ“</p>
                        <p className="text-[#7A9BB5] text-xs truncate">{form.video_url}</p>
                      </div>
                      <button type="button" onClick={() => setForm(f => ({ ...f, video_url: '' }))}
                        className="text-red-400 hover:text-red-600 flex-shrink-0"><X size={15} /></button>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <Upload size={32} className="text-gray-300 mx-auto mb-2" />
                      <p className="text-[#3D5A73] text-sm font-medium">Upload video from your device</p>
                      <p className="text-[#7A9BB5] text-xs mt-1">MP4, MOV, WEBM â€” max 200MB</p>
                    </div>
                  )}

                  {uploadingVideo && (
                    <div className="mt-3">
                      <div className="flex items-center gap-2 text-[#0877B8] text-sm mb-2">
                        <div className="w-4 h-4 border-2 border-[#0877B8] border-t-transparent rounded-full animate-spin" />
                        <span>Uploading video... this may take a moment</span>
                      </div>
                    </div>
                  )}

                  <button type="button"
                    onClick={() => videoRef.current?.click()}
                    disabled={uploadingVideo}
                    className="mt-3 flex items-center gap-2 bg-[#159447] hover:bg-[#117a3a] text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors disabled:opacity-60 w-full justify-center">
                    {uploadingVideo
                      ? 'Uploading...'
                      : <><Upload size={14} /> {form.video_url && isDeviceVideo ? 'Replace Video' : 'Choose Video File'}</>}
                  </button>
                  <input ref={videoRef} type="file" accept="video/mp4,video/mov,video/webm,video/avi,video/x-msvideo,video/quicktime,video/*"
                    onChange={handleVideoUpload} className="hidden" />
                </div>
              )}
            </div>

            {/* â”€â”€ THUMBNAIL â”€â”€ */}
            <div>
              <label className={lbl}>Thumbnail Image {videoMode === 'url' ? '(auto from YouTube if blank)' : '(optional)'}</label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-3 bg-gray-50 hover:border-[#0877B8] transition-colors">
                {currentThumb ? (
                  <div className="relative">
                    <img src={currentThumb} alt="thumb" className="w-full h-28 object-cover rounded-xl" />
                    {form.thumbnail && (
                      <button type="button" onClick={() => setForm(f => ({ ...f, thumbnail: '' }))}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"><X size={12} /></button>
                    )}
                    {!form.thumbnail && videoMode === 'url' && (
                      <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded-full">Auto from YouTube</span>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-2">
                    <p className="text-[#7A9BB5] text-xs">No thumbnail â€” upload one from device</p>
                  </div>
                )}
                <button type="button" onClick={() => thumbRef.current?.click()} disabled={uploadingThumb}
                  className="mt-2 flex items-center gap-1.5 bg-[#0877B8] hover:bg-[#063B63] text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors disabled:opacity-60">
                  {uploadingThumb
                    ? <><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> Uploading...</>
                    : <><Upload size={12} /> {form.thumbnail ? 'Change Thumbnail' : 'Upload Thumbnail'}</>}
                </button>
                <input ref={thumbRef} type="file" accept="image/*" onChange={handleThumbUpload} className="hidden" />
              </div>
            </div>

            {/* Category + Status + Order */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className={lbl}>Category</label>
                <input name="category" value={form.category} onChange={handleChange} className={inp} placeholder="e.g. Therapy" />
              </div>
              <div>
                <label className={lbl}>Status</label>
                <select name="status" value={form.status} onChange={handleChange} className={inp}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div>
                <label className={lbl}>Order</label>
                <input type="number" name="display_order" value={form.display_order} onChange={handleChange} className={inp} />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 px-5 py-4 border-t border-gray-100">
            <button type="button" onClick={closeModal} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl">Cancel</button>
            <button type="submit" disabled={saving || uploadingVideo}
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
          <h3 className="font-bold text-[#063B63] text-lg mb-2">Delete Video?</h3>
          <div className="flex gap-3 justify-center mt-5">
            <button onClick={() => setDeleteConfirm(null)} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm">Cancel</button>
            <button onClick={() => handleDelete(deleteConfirm)} className="px-5 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold">Delete</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}


