import { supabase } from '../lib/supabase'

const BUCKET = 'neurotherapy-media'

/**
 * Upload any image for the neurotherapy CMS
 * Returns the public URL
 */
export async function uploadImage(file, folder = 'neurotherapy') {
  const ext = file.name.split('.').pop().toLowerCase()
  const allowed = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'gif']
  if (!allowed.includes(ext)) throw new Error('Only JPG, PNG, WEBP, AVIF images allowed')
  if (file.size > 5 * 1024 * 1024) throw new Error('Image must be under 5MB')

  const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
  const filePath = `${folder}/${fileName}`

  const { error } = await supabase.storage.from(BUCKET).upload(filePath, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type,
  })
  if (error) throw error

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filePath)
  return data.publicUrl
}

/**
 * Delete an image from storage by its public URL
 */
export async function deleteImage(publicUrl) {
  try {
    const marker = `/${BUCKET}/`
    const idx = publicUrl.indexOf(marker)
    if (idx === -1) return
    const filePath = publicUrl.slice(idx + marker.length)
    await supabase.storage.from(BUCKET).remove([filePath])
  } catch (e) {
    console.warn('Failed to delete image:', e)
  }
}

/**
 * Get YouTube video ID from URL
 */
export function getYouTubeId(url) {
  if (!url) return null
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

/**
 * Get YouTube thumbnail from URL
 */
export function getYouTubeThumbnail(url) {
  const id = getYouTubeId(url)
  if (!id) return null
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`
}

/**
 * Convert YouTube URL to embed URL
 */
export function getYouTubeEmbedUrl(url) {
  const id = getYouTubeId(url)
  if (!id) return url
  return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`
}

/**
 * Generate slug from title
 */
export function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}


