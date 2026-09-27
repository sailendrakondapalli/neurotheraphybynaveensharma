import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"
import toast from "react-hot-toast"

export default function AuthCallbackPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleLogin = async () => {
      // Clean the URL
      window.history.replaceState({}, document.title, "/auth/callback")

      const { data } = await supabase.auth.getSession()

      if (data.session) {
        const user = data.session.user
        toast.success(`Welcome, ${user.user_metadata?.full_name || user.email}!`)
        navigate("/", { replace: true })
      } else {
        // Wait for session via auth state change
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          if (session) {
            subscription.unsubscribe()
            const user = session.user
            toast.success(`Welcome, ${user.user_metadata?.full_name || user.email}!`)
            navigate("/", { replace: true })
          }
        })

        // Timeout fallback
        setTimeout(() => {
          subscription.unsubscribe()
          navigate("/login", { replace: true })
        }, 5000)
      }
    }

    handleLogin()
  }, [navigate])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-[#00154A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600 text-sm">Signing you in...</p>
      </div>
    </div>
  )
}
