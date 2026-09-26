-- Database functions for SR TV NEWS CHANNEL
-- Run this in Supabase SQL Editor after running news-database-setup.sql

-- Function to increment news article views
CREATE OR REPLACE FUNCTION increment_news_views(news_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE news 
  SET views_count = views_count + 1 
  WHERE id = news_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment video views
CREATE OR REPLACE FUNCTION increment_video_views(video_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE videos 
  SET views_count = views_count + 1 
  WHERE id = video_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment advertisement clicks
CREATE OR REPLACE FUNCTION increment_ad_clicks(ad_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE advertisements 
  SET clicks_count = clicks_count + 1 
  WHERE id = ad_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get news statistics
CREATE OR REPLACE FUNCTION get_news_stats()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_news', (SELECT COUNT(*) FROM news),
    'published_news', (SELECT COUNT(*) FROM news WHERE status = 'published'),
    'draft_news', (SELECT COUNT(*) FROM news WHERE status = 'draft'),
    'breaking_news', (SELECT COUNT(*) FROM news WHERE is_breaking = true AND status = 'published'),
    'trending_news', (SELECT COUNT(*) FROM news WHERE is_trending = true AND status = 'published'),
    'total_reporters', (SELECT COUNT(*) FROM reporters WHERE status = 'active'),
    'total_videos', (SELECT COUNT(*) FROM videos WHERE status = 'active'),
    'total_categories', (SELECT COUNT(*) FROM categories WHERE status = 'active'),
    'total_views', (SELECT COALESCE(SUM(views_count), 0) FROM news WHERE status = 'published')
  ) INTO result;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION increment_news_views TO authenticated, anon;
GRANT EXECUTE ON FUNCTION increment_video_views TO authenticated, anon;
GRANT EXECUTE ON FUNCTION increment_ad_clicks TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_news_stats TO authenticated;
