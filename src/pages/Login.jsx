import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import AuthForm from '../components/AuthForm'
import Logo from '../components/Logo'
import { isSupabaseConfigured } from '../lib/supabase'

export default function Login() {
  const { user, authReady } = useApp()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const next = params.get('next') || '/dashboard'
  const initialMode = params.get('mode') === 'signup' ? 'signup' : 'login'

  if (!authReady) {
    return (
      <div className="auth-page flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-accent rounded-full animate-spin" />
      </div>
    )
  }

  if (user) {
    return <Navigate to={next.startsWith('/') ? next : '/dashboard'} replace />
  }

  return (
    <div className="auth-page">
      <div className="auth-page__card">
        <div className="auth-page__logo">
          <Logo />
        </div>

        {!isSupabaseConfigured ? (
          <div className="auth-error">
            Supabase not configured. Add <code>.env</code> keys — see <code>supabase/SETUP.md</code>
          </div>
        ) : (
          <AuthForm
            initialMode={initialMode}
            nextPath={next.startsWith('/') ? next : '/dashboard'}
            onSuccess={() => navigate(next.startsWith('/') ? next : '/dashboard', { replace: true })}
          />
        )}
      </div>
    </div>
  )
}
