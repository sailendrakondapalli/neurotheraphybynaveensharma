import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, Stethoscope, AlertCircle } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const { signIn } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/admin'

  const validate = () => {
    const errs = {}
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = 'Invalid email address'
    if (form.password.length < 6) errs.password = 'Password is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await signIn(form.email, form.password)
      toast.success('Welcome back!')
      navigate(from, { replace: true })
    } catch (err) {
      toast.error(err.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#063B63] to-[#0877B8] flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white/15 border border-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Stethoscope size={28} className="text-white" />
          </div>
          <h1 className="text-white font-bold text-2xl">Neurotherapist Naveen Sharma</h1>
          <p className="text-blue-200 text-sm mt-1">Admin Panel</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-6">
          <h2 className="font-bold text-[#063B63] text-lg mb-5 text-center">Admin Login</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#063B63] mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email" value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="admin@example.com"
                  className={`w-full bg-gray-50 border rounded-xl pl-9 pr-4 py-3 text-sm text-[#12304A] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0877B8]/30 focus:border-[#0877B8] transition-all ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={11} />{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#063B63] mb-1.5">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPass ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Enter your password"
                  className={`w-full bg-gray-50 border rounded-xl pl-9 pr-10 py-3 text-sm text-[#12304A] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0877B8]/30 focus:border-[#0877B8] transition-all ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                />
                <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={11} />{errors.password}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#063B63] to-[#0877B8] text-white font-semibold py-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-60">
              {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-4 p-3 bg-blue-50 rounded-xl text-center">
            <p className="text-[#3D5A73] text-xs">?? This is the Admin Panel</p>
            <p className="text-[#7A9BB5] text-xs mt-0.5">Public website requires no login</p>
            <a href="/" className="text-[#0877B8] text-xs font-semibold hover:underline block mt-1">Visit public website ?</a>
          </div>
        </div>
      </motion.div>
    </div>
  )
}


