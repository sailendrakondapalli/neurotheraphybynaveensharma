import { supabase } from '../lib/supabase'

/**
 * Fetch published news articles with optional filters
 */
export async function fetchNews(filters = {}) {
  try {
    let query = supabase
      .from('news')
      .select(`
        *,
        category:categories(id, name, slug),
        reporter:reporters(id, name, photo_url, designation)
      `)
      .eq('status', 'published')

    if (filters.category) {
      query = query.eq('category_id', filters.category)
    }

    if (filters.categorySlug) {
      // Join with categories to filter by slug
      const { data: cat } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', filters.categorySlug)
        .single()
      if (cat) query = query.eq('category_id', cat.id)
    }

    if (filters.featured) {
      query = query.eq('is_featured', true)
    }

    if (filters.breaking) {
      query = query.eq('is_breaking', true)
    }

    if (filters.trending) {
      query = query.eq('is_trending', true).order('trending_order', { ascending: true })
    }

    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,short_description.ilike.%${filters.search}%,tags.cs.{${filters.search}}`)
    }

    if (filters.limit) {
      query = query.limit(filters.limit)
    }

    // Default sort by published_at DESC
    if (!filters.trending) {
      query = query.order('published_at', { ascending: false })
    }

    const { data, error } = await query
    if (error) {
      console.error('fetchNews error:', error.message)
      return []
    }
    return data || []
  } catch (e) {
    console.error('fetchNews failed:', e.message)
    return []
  }
}

/**
 * Fetch single news article by slug or ID
 */
export async function fetchNewsById(identifier) {
  try {
    // Try by slug first (most common case)
    const { data: bySlug, error: slugError } = await supabase
      .from('news')
      .select(`
        *,
        category:categories(id, name, slug),
        reporter:reporters(id, name, photo_url, designation, bio, location, facebook_url, twitter_url, instagram_url)
      `)
      .eq('status', 'published')
      .eq('slug', identifier)
      .maybeSingle()
    
    if (bySlug) {
      // Increment view count
      try {
        await supabase.rpc('increment_news_views', { news_id: bySlug.id })
      } catch (e) {
        console.log('View count increment skipped:', e.message)
      }
      return bySlug
    }

    // If not found by slug, try as UUID
    const { data: byId, error: idError } = await supabase
      .from('news')
      .select(`
        *,
        category:categories(id, name, slug),
        reporter:reporters(id, name, photo_url, designation, bio, location, facebook_url, twitter_url, instagram_url)
      `)
      .eq('status', 'published')
      .eq('id', identifier)
      .maybeSingle()
    
    if (byId) {
      // Increment view count
      try {
        await supabase.rpc('increment_news_views', { news_id: byId.id })
      } catch (e) {
        console.log('View count increment skipped:', e.message)
      }
      return byId
    }

    return null
  } catch (e) {
    console.error('fetchNewsById failed:', e.message)
    return null
  }
}

/**
 * Fetch related news (same category, excluding current article)
 */
export async function fetchRelatedNews(categoryId, currentNewsId, limit = 4) {
  try {
    const { data, error } = await supabase
      .from('news')
      .select(`
        *,
        category:categories(id, name, slug),
        reporter:reporters(id, name, photo_url, designation)
      `)
      .eq('status', 'published')
      .eq('category_id', categoryId)
      .neq('id', currentNewsId)
      .order('published_at', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('fetchRelatedNews error:', error.message)
      return []
    }
    return data || []
  } catch (e) {
    console.error('fetchRelatedNews failed:', e.message)
    return []
  }
}

/**
 * Fetch categories
 */
export async function fetchCategories() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('status', 'active')
      .order('display_order', { ascending: true })

    if (error) {
      console.error('fetchCategories error:', error.message)
      return []
    }
    return data || []
  } catch (e) {
    console.error('fetchCategories failed:', e.message)
    return []
  }
}

/**
 * Fetch single category by slug
 */
export async function fetchCategoryBySlug(slug) {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'active')
      .single()

    if (error) {
      console.error('fetchCategoryBySlug error:', error.message)
      return null
    }
    return data
  } catch (e) {
    console.error('fetchCategoryBySlug failed:', e.message)
    return null
  }
}

/**
 * Fetch active breaking news for ticker
 */
export async function fetchBreakingNews() {
  try {
    const now = new Date().toISOString()
    const { data, error } = await supabase
      .from('breaking_news')
      .select('*')
      .eq('status', 'active')
      .or(`start_time.is.null,start_time.lte.${now}`)
      .or(`end_time.is.null,end_time.gte.${now}`)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('fetchBreakingNews error:', error.message)
      return []
    }
    return data || []
  } catch (e) {
    console.error('fetchBreakingNews failed:', e.message)
    return []
  }
}

/**
 * Fetch homepage configuration
 */
export async function fetchHomepageConfig() {
  try {
    const { data, error } = await supabase
      .from('homepage_config')
      .select(`
        *,
        hero_news:news(
          id,
          title,
          slug,
          short_description,
          featured_image_url,
          category:categories(name, slug),
          reporter:reporters(id, name, photo_url, designation)
        )
      `)
      .eq('id', '00000000-0000-0000-0000-000000000001')
      .single()

    if (error) {
      console.error('fetchHomepageConfig error:', error.message)
      return null
    }
    return data
  } catch (e) {
    console.error('fetchHomepageConfig failed:', e.message)
    return null
  }
}

/**
 * Fetch site settings
 */
export async function fetchSiteSettings() {
  try {
    const { data, error } = await supabase
      .from('news_site_settings')
      .select('*')
      .eq('id', '00000000-0000-0000-0000-000000000001')
      .single()

    if (error) {
      console.error('fetchSiteSettings error:', error.message)
      return {
        site_name: 'SR TV NEWS CHANNEL',
        site_tagline: 'Inform • Inspire • Empower'
      }
    }
    return data || { site_name: 'SR TV NEWS CHANNEL', site_tagline: 'Inform • Inspire • Empower' }
  } catch (e) {
    console.error('fetchSiteSettings failed:', e.message)
    return {
      site_name: 'SR TV NEWS CHANNEL',
      site_tagline: 'Inform • Inspire • Empower'
    }
  }
}

/**
 * Fetch videos
 */
export async function fetchVideos(filters = {}) {
  try {
    let query = supabase
      .from('videos')
      .select(`
        *,
        category:categories(id, name, slug)
      `)
      .eq('status', 'active')

    if (filters.featured) {
      query = query.eq('is_featured', true)
    }

    if (filters.category) {
      query = query.eq('category_id', filters.category)
    }

    if (filters.limit) {
      query = query.limit(filters.limit)
    }

    query = query.order('created_at', { ascending: false })

    const { data, error } = await query
    if (error) {
      console.error('fetchVideos error:', error.message)
      return []
    }
    return data || []
  } catch (e) {
    console.error('fetchVideos failed:', e.message)
    return []
  }
}

/**
 * Fetch single video by slug or ID
 */
export async function fetchVideoById(identifier) {
  try {
    // Try by slug first
    const { data: bySlug, error: slugError } = await supabase
      .from('videos')
      .select(`
        *,
        category:categories(id, name, slug)
      `)
      .eq('status', 'active')
      .eq('slug', identifier)
      .maybeSingle()
    
    if (bySlug) {
      // Increment view count
      try {
        await supabase.rpc('increment_video_views', { video_id: bySlug.id })
      } catch (e) {
        console.log('View count increment skipped:', e.message)
      }
      return bySlug
    }

    // Try as UUID
    const { data: byId, error: idError } = await supabase
      .from('videos')
      .select(`
        *,
        category:categories(id, name, slug)
      `)
      .eq('status', 'active')
      .eq('id', identifier)
      .maybeSingle()
    
    if (byId) {
      // Increment view count
      try {
        await supabase.rpc('increment_video_views', { video_id: byId.id })
      } catch (e) {
        console.log('View count increment skipped:', e.message)
      }
      return byId
    }

    return null
  } catch (e) {
    console.error('fetchVideoById failed:', e.message)
    return null
  }
}

/**
 * Fetch Live TV configuration
 */
export async function fetchLiveTVConfig() {
  try {
    const { data, error } = await supabase
      .from('live_tv_config')
      .select('*')
      .eq('id', '00000000-0000-0000-0000-000000000001')
      .single()

    if (error) {
      console.error('fetchLiveTVConfig error:', error.message)
      return { title: 'SR TV NEWS LIVE', is_live: false }
    }
    return data || { title: 'SR TV NEWS LIVE', is_live: false }
  } catch (e) {
    console.error('fetchLiveTVConfig failed:', e.message)
    return { title: 'SR TV NEWS LIVE', is_live: false }
  }
}

/**
 * Fetch active advertisements by position
 */
export async function fetchAdvertisements(position = null) {
  try {
    const now = new Date().toISOString()
    let query = supabase
      .from('advertisements')
      .select('*')
      .eq('status', 'active')
      .or(`start_date.is.null,start_date.lte.${now}`)
      .or(`end_date.is.null,end_date.gte.${now}`)

    if (position) {
      query = query.eq('position', position)
    }

    query = query.order('display_order', { ascending: true })

    const { data, error } = await query
    if (error) {
      console.error('fetchAdvertisements error:', error.message)
      return []
    }
    return data || []
  } catch (e) {
    console.error('fetchAdvertisements failed:', e.message)
    return []
  }
}

/**
 * Track advertisement click
 */
export async function trackAdClick(adId) {
  try {
    await supabase.rpc('increment_ad_clicks', { ad_id: adId })
  } catch (e) {
    console.error('trackAdClick failed:', e.message)
  }
}
