import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import BreakingNewsTicker from '../components/BreakingNewsTicker'
import toast from 'react-hot-toast'

export default function ContactPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (name.trim().length < 3) e.name = "Name must be at least 3 characters"
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Enter a valid email address"
    if (subject.trim().length < 5) e.subject = "Subject must be at least 5 characters"
    if (message.trim().length < 10) e.message = "Message must be at least 10 characters"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    
    // Simulate form submission
    toast.success('Message sent successfully! We\'ll get back to you soon.')
    
    // Reset form
    setName("")
    setEmail("")
    setSubject("")
    setMessage("")
    setErrors({})
  }

  return (
    <>
      <Helmet>
        <title>Contact Us - SR TV NEWS CHANNEL</title>
        <meta name="description" content="Get in touch with SR TV NEWS CHANNEL. We'd love to hear from you." />
      </Helmet>

      <div className="bg-gray-50 min-h-screen">
        <BreakingNewsTicker />

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#00154A] to-[#000C2E] text-white py-16">
          <div className="max-w-[1200px] mx-auto px-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl text-[#AAB8D4] max-w-3xl">
              Have a news tip? Want to report an issue? We'd love to hear from you.
            </p>
          </div>
        </section>

        {/* Contact Info & Form */}
        <section className="py-16">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Contact Information */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                  <h2 className="text-2xl font-bold text-[#00154A] mb-6">Get In Touch</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#00154A] to-[#0035A3] rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail size={20} className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Email</p>
                        <a href="mailto:contact@srtvnews.com" className="text-[#0066FF] hover:underline font-medium">
                          contact@srtvnews.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#00154A] to-[#0035A3] rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone size={20} className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Phone</p>
                        <a href="tel:+911234567890" className="text-[#0066FF] hover:underline font-medium">
                          +91 12345 67890
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#00154A] to-[#0035A3] rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin size={20} className="text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Address</p>
                        <p className="text-gray-700 font-medium">
                          SR TV NEWS CHANNEL<br/>
                          Broadcasting House<br/>
                          New Delhi, India
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-[#E60012] to-[#FF1A1A] text-white p-6 rounded-lg">
                  <h3 className="text-lg font-bold mb-2">News Tips</h3>
                  <p className="text-sm text-white/90 mb-4">
                    Have a story tip or breaking news? Contact our newsroom directly.
                  </p>
                  <a href="mailto:newsroom@srtvnews.com" className="text-white underline font-medium">
                    newsroom@srtvnews.com
                  </a>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
                  <h2 className="text-2xl font-bold text-[#00154A] mb-6">Send Us a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                        <input 
                          value={name} 
                          onChange={e => setName(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0066FF] transition-colors" 
                          placeholder="Your full name" 
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                        <input 
                          type="email" 
                          value={email} 
                          onChange={e => setEmail(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0066FF] transition-colors" 
                          placeholder="your@email.com" 
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                      <input 
                        value={subject} 
                        onChange={e => setSubject(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0066FF] transition-colors" 
                        placeholder="What is this regarding?" 
                      />
                      {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                      <textarea 
                        rows={6} 
                        value={message} 
                        onChange={e => setMessage(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0066FF] transition-colors resize-none" 
                        placeholder="Tell us how we can help..." 
                      />
                      {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                    </div>

                    <button 
                      type="submit" 
                      className="w-full md:w-auto px-8 py-3 bg-[#E60012] text-white font-semibold rounded-lg hover:bg-[#FF1A1A] transition-colors flex items-center justify-center gap-2">
                      <Send size={18} />
                      Send Message
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
