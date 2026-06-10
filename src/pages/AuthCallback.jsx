import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { Loader2 } from 'lucide-react'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [message, setMessage] = useState('Completing sign in…')

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      navigate('/login', { replace: true })
      return undefined
    }

    const next = params.get('next') || '/dashboard'
    let cancelled = false

    async function finish() {
      const { data, error } = await supabase.auth.getSession()

      if (cancelled) return

      if (error || !data.session) {
        setMessage('Sign in failed. Try again.')
        setTimeout(() => navigate('/login', { replace: true }), 1500)
        return
      }

      navigate(next.startsWith('/') ? next : '/dashboard', { replace: true })
    }

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
        navigate(next.startsWith('/') ? next : '/dashboard', { replace: true })
      }
    })

    finish()

    return () => {
      cancelled = true
      sub.subscription.unsubscribe()
    }
  }, [navigate, params])

  return (
    <div className="auth-page flex flex-col items-center justify-center gap-4">
      <Loader2 size={32} className="animate-spin text-accent" />
      <p className="text-sm text-ink-2">{message}</p>
    </div>
  )
}
