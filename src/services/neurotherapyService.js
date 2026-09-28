import { supabase } from '../lib/supabase'

// â”€â”€â”€ WEBSITE SETTINGS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export async function getWebsiteSettings() {
  const { data } = await supabase
    .from('website_settings')
    .select('*')
    .single()
  return data || {}
}

export async function updateWebsiteSettings(settings) {
  const { data: existing } = await supabase.from('website_settings').select('id').single()
  if (existing?.id) {
    const { error } = await supabase.from('website_settings').update(settings).eq('id', existing.id)
    if (error) throw error
  } else {
    const { error } = await supabase.from('website_settings').insert(settings)
    if (error) throw error
  }
}

// â”€â”€â”€ HOMEPAGE SETTINGS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export async function getHomepageSettings() {
  const { data } = await supabase
    .from('homepage_settings')
    .select('*')
    .single()
  return data || {}
}

export async function updateHomepageSettings(settings) {
  const { data: existing } = await supabase.from('homepage_settings').select('id').single()
  if (existing?.id) {
    const { error } = await supabase.from('homepage_settings').update(settings).eq('id', existing.id)
    if (error) throw error
  } else {
    const { error } = await supabase.from('homepage_settings').insert(settings)
    if (error) throw error
  }
}

// â”€â”€â”€ SERVICES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export async function getPublishedServices() {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('status', 'published')
    .order('display_order', { ascending: true })
  if (error) throw error
  return data || []
}

export async function getFeaturedServices() {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('status', 'published')
    .eq('is_featured', true)
    .order('display_order', { ascending: true })
  if (error) throw error
  return data || []
}

export async function getServiceBySlug(slug) {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()
  if (error) throw error
  return data
}

export async function getAllServicesAdmin() {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('display_order', { ascending: true })
  if (error) throw error
  return data || []
}

export async function createService(service) {
  const { data, error } = await supabase.from('services').insert(service).select().single()
  if (error) throw error
  return data
}

export async function updateService(id, service) {
  const { data, error } = await supabase.from('services').update(service).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteService(id) {
  const { error } = await supabase.from('services').delete().eq('id', id)
  if (error) throw error
}

// â”€â”€â”€ SERVICE CATEGORIES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export async function getServiceCategories() {
  const { data, error } = await supabase
    .from('service_categories')
    .select('*')
    .order('name', { ascending: true })
  if (error) throw error
  return data || []
}

export async function createServiceCategory(cat) {
  const { data, error } = await supabase.from('service_categories').insert(cat).select().single()
  if (error) throw error
  return data
}

export async function deleteServiceCategory(id) {
  const { error } = await supabase.from('service_categories').delete().eq('id', id)
  if (error) throw error
}

// â”€â”€â”€ BENEFITS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export async function getPublishedBenefits() {
  const { data, error } = await supabase
    .from('benefits')
    .select('*')
    .eq('status', 'published')
    .order('display_order', { ascending: true })
  if (error) throw error
  return data || []
}

export async function getAllBenefitsAdmin() {
  const { data, error } = await supabase
    .from('benefits')
    .select('*')
    .order('display_order', { ascending: true })
  if (error) throw error
  return data || []
}

export async function createBenefit(benefit) {
  const { data, error } = await supabase.from('benefits').insert(benefit).select().single()
  if (error) throw error
  return data
}

export async function updateBenefit(id, benefit) {
  const { data, error } = await supabase.from('benefits').update(benefit).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteBenefit(id) {
  const { error } = await supabase.from('benefits').delete().eq('id', id)
  if (error) throw error
}

// â”€â”€â”€ TESTIMONIALS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export async function getPublishedTestimonials() {
  const { data, error } = await supabase
    .from('testimonials')
    .select('id, patient_name, testimonial, rating, image, display_order, created_at')
    .in('status', ['published', 'approved'])
    .order('display_order', { ascending: true })
  if (error) throw error
  return data || []
}

export async function getAllTestimonialsAdmin() {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function submitTestimonial(testimonial) {
  // public submission â€” status always pending
  const { error } = await supabase.from('testimonials').insert({
    ...testimonial,
    status: 'pending',
    is_featured: false,
    display_order: 999,
  })
  if (error) throw error
}

export async function createTestimonial(testimonial) {
  const { data, error } = await supabase.from('testimonials').insert(testimonial).select().single()
  if (error) throw error
  return data
}

export async function updateTestimonial(id, testimonial) {
  const { data, error } = await supabase.from('testimonials').update(testimonial).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteTestimonial(id) {
  const { error } = await supabase.from('testimonials').delete().eq('id', id)
  if (error) throw error
}

// â”€â”€â”€ GALLERY â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export async function getPublishedGallery() {
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .eq('status', 'published')
    .order('display_order', { ascending: true })
  if (error) throw error
  return data || []
}

export async function getAllGalleryAdmin() {
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .order('display_order', { ascending: true })
  if (error) throw error
  return data || []
}

export async function createGalleryItem(item) {
  const { data, error } = await supabase.from('gallery').insert(item).select().single()
  if (error) throw error
  return data
}

export async function updateGalleryItem(id, item) {
  const { data, error } = await supabase.from('gallery').update(item).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteGalleryItem(id) {
  const { error } = await supabase.from('gallery').delete().eq('id', id)
  if (error) throw error
}

// â”€â”€â”€ VIDEOS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export async function getPublishedVideos() {
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('status', 'published')
    .order('display_order', { ascending: true })
  if (error) throw error
  return data || []
}

export async function getAllVideosAdmin() {
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .order('display_order', { ascending: true })
  if (error) throw error
  return data || []
}

export async function createVideo(video) {
  const { data, error } = await supabase.from('videos').insert(video).select().single()
  if (error) throw error
  return data
}

export async function updateVideo(id, video) {
  const { data, error } = await supabase.from('videos').update(video).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteVideo(id) {
  const { error } = await supabase.from('videos').delete().eq('id', id)
  if (error) throw error
}

// â”€â”€â”€ FAQS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export async function getPublishedFaqs() {
  const { data, error } = await supabase
    .from('faqs')
    .select('*')
    .eq('status', 'published')
    .order('display_order', { ascending: true })
  if (error) throw error
  return data || []
}

export async function getAllFaqsAdmin() {
  const { data, error } = await supabase
    .from('faqs')
    .select('*')
    .order('display_order', { ascending: true })
  if (error) throw error
  return data || []
}

export async function createFaq(faq) {
  const { data, error } = await supabase.from('faqs').insert(faq).select().single()
  if (error) throw error
  return data
}

export async function updateFaq(id, faq) {
  const { data, error } = await supabase.from('faqs').update(faq).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteFaq(id) {
  const { error } = await supabase.from('faqs').delete().eq('id', id)
  if (error) throw error
}

// â”€â”€â”€ APPOINTMENTS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export async function submitAppointment(appointment) {
  const { error } = await supabase.from('appointments').insert({
    ...appointment,
    status: 'new',
  })
  if (error) throw error
}

export async function getAllAppointmentsAdmin() {
  const { data, error } = await supabase
    .from('appointments')
    .select('*, services(title)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function updateAppointmentStatus(id, status) {
  const { error } = await supabase
    .from('appointments')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}

export async function deleteAppointment(id) {
  const { error } = await supabase.from('appointments').delete().eq('id', id)
  if (error) throw error
}

// â”€â”€â”€ ABOUT SETTINGS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export async function getAboutSettings() {
  const { data } = await supabase
    .from('about_settings')
    .select('*')
    .single()
  return data || {}
}

export async function updateAboutSettings(settings) {
  const { data: existing } = await supabase.from('about_settings').select('id').single()
  if (existing?.id) {
    const { error } = await supabase.from('about_settings').update(settings).eq('id', existing.id)
    if (error) throw error
  } else {
    const { error } = await supabase.from('about_settings').insert(settings)
    if (error) throw error
  }
}

// â”€â”€â”€ NEUROTHERAPY PAGE SETTINGS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export async function getNeurotherapySettings() {
  const { data } = await supabase
    .from('neurotherapy_settings')
    .select('*')
    .single()
  return data || {}
}

export async function updateNeurotherapySettings(settings) {
  const { data: existing } = await supabase.from('neurotherapy_settings').select('id').single()
  if (existing?.id) {
    const { error } = await supabase.from('neurotherapy_settings').update(settings).eq('id', existing.id)
    if (error) throw error
  } else {
    const { error } = await supabase.from('neurotherapy_settings').insert(settings)
    if (error) throw error
  }
}

// â”€â”€â”€ CONTACT SETTINGS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export async function getContactSettings() {
  const { data } = await supabase
    .from('contact_settings')
    .select('*')
    .single()
  return data || {}
}

export async function updateContactSettings(settings) {
  const { data: existing } = await supabase.from('contact_settings').select('id').single()
  if (existing?.id) {
    const { error } = await supabase.from('contact_settings').update(settings).eq('id', existing.id)
    if (error) throw error
  } else {
    const { error } = await supabase.from('contact_settings').insert(settings)
    if (error) throw error
  }
}

// â”€â”€â”€ DASHBOARD STATS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// Flash News
export async function getActiveFlashNews() {
  const { data, error } = await supabase
    .from('flash_news')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) throw error
  return data || null
}

export async function getAllFlashNewsAdmin() {
  const { data, error } = await supabase
    .from('flash_news')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function createFlashNews(item) {
  const { data, error } = await supabase.from('flash_news').insert(item).select().single()
  if (error) throw error
  return data
}

export async function updateFlashNews(id, item) {
  const { data, error } = await supabase.from('flash_news').update(item).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteFlashNews(id) {
  const { error } = await supabase.from('flash_news').delete().eq('id', id)
  if (error) throw error
}

export async function getDashboardStats() {
  const [services, testimonials, gallery, videos, faqs, appointments] = await Promise.all([
    supabase.from('services').select('id, status', { count: 'exact' }),
    supabase.from('testimonials').select('id, status', { count: 'exact' }),
    supabase.from('gallery').select('id', { count: 'exact' }),
    supabase.from('videos').select('id', { count: 'exact' }),
    supabase.from('faqs').select('id', { count: 'exact' }),
    supabase.from('appointments').select('id, status', { count: 'exact' }),
  ])

  const allServices = services.data || []
  const allTestimonials = testimonials.data || []
  const allAppointments = appointments.data || []

  return {
    totalServices: allServices.length,
    publishedServices: allServices.filter(s => s.status === 'published').length,
    totalTestimonials: allTestimonials.length,
    pendingTestimonials: allTestimonials.filter(t => t.status === 'pending').length,
    galleryImages: (gallery.data || []).length,
    totalVideos: (videos.data || []).length,
    totalFaqs: (faqs.data || []).length,
    newEnquiries: allAppointments.filter(a => a.status === 'new').length,
    scheduledAppointments: allAppointments.filter(a => a.status === 'scheduled').length,
    totalAppointments: allAppointments.length,
  }
}

export async function getRecentAppointments(limit = 5) {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data || []
}

export async function getRecentTestimonials(limit = 5) {
  const { data, error } = await supabase
    .from('testimonials')
    .select('id, patient_name, testimonial, status, created_at')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data || []
}


