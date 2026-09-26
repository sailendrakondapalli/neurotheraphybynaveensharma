# SR TV NEWS CHANNEL - Quick Reference Card

## 🚀 GET STARTED IN 5 MINUTES

### 1. Setup Database (ONE TIME)
```
Open Supabase → SQL Editor → Run these files:
1. news-database-setup.sql
2. news-database-functions.sql
```

### 2. Start Server
```bash
npm run dev
```

### 3. Add Content
```
http://localhost:5173/admin
→ Login
→ /admin/reporters → Add a reporter
→ /admin/news → Create article → Publish
→ Visit / to see it live!
```

## 📁 KEY FILES

| File | Purpose |
|------|---------|
| `news-database-setup.sql` | Database schema (run once) |
| `src/services/newsService.js` | All API calls |
| `src/store/newsAdminStore.js` | Admin state management |
| `src/pages/admin/AdminNews.jsx` | News management UI |
| `src/pages/NewsHomePage.jsx` | Homepage |
| `src/pages/NewsArticlePage.jsx` | Article detail |
| `src/components/NewsNavbar.jsx` | Main navigation |

## 🎨 BRAND COLORS

```css
Primary: #1B2B5E (Deep Navy Blue)
Accent:  #DC2626 (Bright Red)
BG:      #F9FAFB (Light Gray)
Text:    #1A1A2E (Dark Gray)
```

## 🔗 ROUTES

### Frontend
- `/` - Homepage
- `/news/:slug` - Article page
- `/category/:slug` - Category page (not built yet)
- `/latest` - Latest news (not built yet)
- `/videos` - Videos (not built yet)
- `/live-tv` - Live TV (not built yet)

### Admin
- `/admin` - Dashboard
- `/admin/news` - News CRUD
- `/admin/reporters` - Reporter CRUD
- `/admin/categories` - Categories (not built yet)
- `/admin/breaking-news` - Breaking ticker (not built yet)

## 📊 DATABASE TABLES

| Table | Purpose |
|-------|---------|
| `news` | News articles |
| `reporters` | Reporter profiles |
| `categories` | News categories (8 defaults) |
| `breaking_news` | Breaking news ticker |
| `videos` | Video content |
| `live_tv_config` | Live stream config |
| `advertisements` | Ad management |
| `homepage_config` | Hero section config |
| `news_site_settings` | Global settings |

## ⚡ QUICK COMMANDS

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🎯 STATUS CHECKLIST

### ✅ Working Now
- [x] Database schema
- [x] Admin dashboard
- [x] News CRUD
- [x] Reporter CRUD
- [x] Homepage with hero
- [x] Article detail page
- [x] Breaking news ticker
- [x] Category navigation
- [x] Trending sidebar
- [x] Social sharing

### ⏳ Not Built Yet (Optional)
- [ ] Category page
- [ ] Videos system
- [ ] Live TV page
- [ ] Search results page
- [ ] Admin categories page
- [ ] Admin breaking news page
- [ ] Admin videos page

## 📞 NEED HELP?

Read these guides:
1. `DEPLOYMENT_GUIDE.md` - Full setup instructions
2. `TRANSFORMATION_SUMMARY.md` - Complete overview
3. `IMPLEMENTATION_STATUS.md` - Technical details

## 🐛 TROUBLESHOOTING

**Problem**: "Table does not exist"
**Solution**: Run SQL scripts in Supabase

**Problem**: "No news showing"
**Solution**: Make sure article status is "published"

**Problem**: "Admin routes 404"
**Solution**: Check you're logged in at `/admin`

**Problem**: "Images not uploading"
**Solution**: Check Supabase storage bucket "product-images" exists

## 🎉 THAT'S IT!

You're ready to run your news channel!

**Remember**:
1. Run SQL scripts (one time)
2. Start server
3. Add content via admin
4. View at homepage

**Next**: Tell me what you want built next!
