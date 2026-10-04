import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'
import Header from './components/Header'
import Footer from './components/Footer'
import WhatsAppBot from './components/WhatsAppBot'
import FlashNewsPopup from './components/FlashNewsPopup'
import AdminRoute from './components/AdminRoute'
import AdminLayout from './components/admin/AdminLayout'
import ErrorBoundary from './components/ErrorBoundary'
import { HeartPulse } from 'lucide-react'
import { useAuthStore } from './store/authStore'
import { LanguageProvider } from './lib/LanguageContext'

// Public pages
const HomePage = lazy(() => import('./pages/HomePage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const NeurotherapyPage = lazy(() => import('./pages/NeurotherapyPage'))
const ServicesPage = lazy(() => import('./pages/ServicesPage'))
const ServiceDetailPage = lazy(() => import('./pages/ServiceDetailPage'))
const BenefitsPage = lazy(() => import('./pages/BenefitsPage'))
const TestimonialsPage = lazy(() => import('./pages/TestimonialsPage'))
const GalleryPage = lazy(() => import('./pages/GalleryPage'))
const VideosPage = lazy(() => import('./pages/VideosPage'))
const FaqsPage = lazy(() => import('./pages/FaqsPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const AppointmentPage = lazy(() => import('./pages/AppointmentPage'))
const FlashNewsPage = lazy(() => import('./pages/FlashNewsPage'))
const AuthCallbackPage = lazy(() => import('./pages/AuthCallbackPage'))

// Admin pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminServices = lazy(() => import('./pages/admin/AdminServices'))
const AdminBenefits = lazy(() => import('./pages/admin/AdminBenefits'))
const AdminTestimonials = lazy(() => import('./pages/admin/AdminTestimonials'))
const AdminGallery = lazy(() => import('./pages/admin/AdminGallery'))
const AdminVideos = lazy(() => import('./pages/admin/AdminVideos'))
const AdminFaqs = lazy(() => import('./pages/admin/AdminFaqs'))
const AdminAppointments = lazy(() => import('./pages/admin/AdminAppointments'))
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'))
const AdminAbout = lazy(() => import('./pages/admin/AdminAbout'))
const AdminNeurotherapy = lazy(() => import('./pages/admin/AdminNeurotherapy'))
const AdminFlashNews = lazy(() => import('./pages/admin/AdminFlashNews'))
const AdminAchievements = lazy(() => import('./pages/admin/AdminAchievements'))

const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-[#0877B8] border-t-transparent rounded-full animate-spin" />
  </div>
)

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  const { initialize } = useAuthStore()
  useEffect(() => { initialize() }, [])

  return (
    <HelmetProvider>
      <LanguageProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Admin routes */}
            <Route path="/admin/*" element={
              <AdminRoute>
                <AdminLayout>
                  <ErrorBoundary>
                    <Suspense fallback={<PageLoader />}>
                      <Routes>
                        <Route index element={<AdminDashboard />} />
                        <Route path="services" element={<AdminServices />} />
                        <Route path="services/new" element={<AdminServices />} />
                        <Route path="benefits" element={<AdminBenefits />} />
                        <Route path="testimonials" element={<AdminTestimonials />} />
                        <Route path="gallery" element={<AdminGallery />} />
                        <Route path="gallery/new" element={<AdminGallery />} />
                        <Route path="videos" element={<AdminVideos />} />
                        <Route path="videos/new" element={<AdminVideos />} />
                        <Route path="faqs" element={<AdminFaqs />} />
                        <Route path="faqs/new" element={<AdminFaqs />} />
                        <Route path="appointments" element={<AdminAppointments />} />
                        <Route path="settings" element={<AdminSettings />} />
                        <Route path="about" element={<AdminAbout />} />
                        <Route path="neurotherapy" element={<AdminNeurotherapy />} />
                        <Route path="flash-news" element={<AdminFlashNews />} />
                        <Route path="achievements" element={<AdminAchievements />} />
                      </Routes>
                    </Suspense>
                  </ErrorBoundary>
                </AdminLayout>
              </AdminRoute>
            } />

            {/* Admin login - redirect straight to admin (no auth required) */}
            <Route path="/login" element={<Navigate to="/admin" replace />} />
            <Route path="/auth/callback" element={
              <Suspense fallback={<PageLoader />}>
                <AuthCallbackPage />
              </Suspense>
            } />

            {/* Public website routes */}
            <Route path="/*" element={
              <div className="min-h-screen bg-[#F5FAFC] flex flex-col">
                <Header />
                <main className="flex-1 pb-16 md:pb-0">
                  <ErrorBoundary>
                    <Suspense fallback={<PageLoader />}>
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/neurotherapy" element={<NeurotherapyPage />} />
                        <Route path="/services" element={<ServicesPage />} />
                        <Route path="/services/:slug" element={<ServiceDetailPage />} />
                        <Route path="/benefits" element={<BenefitsPage />} />
                        <Route path="/testimonials" element={<TestimonialsPage />} />
                        <Route path="/gallery" element={<GalleryPage />} />
                        <Route path="/videos" element={<VideosPage />} />
                        <Route path="/faqs" element={<FaqsPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/appointment" element={<AppointmentPage />} />
                        <Route path="/announcements" element={<FlashNewsPage />} />
                        {/* Fallback */}
                        <Route path="*" element={
                          <div className="min-h-[60vh] flex items-center justify-center flex-col gap-4">
                            <HeartPulse size={56} className="text-[#0877B8] mx-auto" />
                            <h1 className="text-2xl font-bold text-[#063B63]">Page Not Found</h1>
                            <a href="/" className="text-[#0877B8] font-semibold hover:underline">Return Home</a>
                          </div>
                        } />
                      </Routes>
                    </Suspense>
                  </ErrorBoundary>
                </main>
                <Footer />
                <WhatsAppBot />
                <FlashNewsPopup />
              </div>
            } />
          </Routes>

          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#ffffff',
                color: '#12304A',
                border: '1px solid #D4E8F0',
                boxShadow: '0 8px 32px rgba(6,59,99,0.12)',
                borderRadius: '14px',
                fontSize: '14px',
                fontWeight: '500',
                padding: '12px 20px',
                maxWidth: '420px',
              },
              success: {
                style: { background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' },
                iconTheme: { primary: '#16a34a', secondary: '#fff' },
              },
              error: {
                style: { background: '#fff1f2', color: '#9f1239', border: '1px solid #fecdd3' },
                iconTheme: { primary: '#e11d48', secondary: '#fff' },
              },
            }}
          />
        </BrowserRouter>
      </LanguageProvider>
    </HelmetProvider>
  )
}


