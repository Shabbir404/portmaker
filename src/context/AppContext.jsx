import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase.js'
import { signOut as authSignOut } from '../lib/auth.js'

const AppContext = createContext(null)

function mapUser(sessionUser) {
  if (!sessionUser) return null
  const meta = sessionUser.user_metadata || {}
  const name =
    meta.full_name ||
    meta.name ||
    [meta.first_name, meta.last_name].filter(Boolean).join(' ') ||
    sessionUser.email?.split('@')[0] ||
    'User'
  return {
    id: sessionUser.id,
    name,
    email: sessionUser.email,
  }
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [authReady, setAuthReady] = useState(!isSupabaseConfigured)
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((msg, type = 'info') => {
    const id = Date.now()
    setToasts((t) => [...t, { id, msg, type }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200)
  }, [])

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setAuthReady(true)
      return undefined
    }

    supabase.auth.getSession().then(({ data }) => {
      setUser(mapUser(data.session?.user))
      setAuthReady(true)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(mapUser(session?.user))
    })

    return () => sub.subscription.unsubscribe()
  }, [])

  const logout = useCallback(async () => {
    try {
      if (isSupabaseConfigured) await authSignOut()
    } catch {
      /* session may already be cleared */
    }
    setUser(null)
  }, [])

  return (
    <AppContext.Provider
      value={{
        user,
        logout,
        authReady,
        isSupabaseConfigured,
        toasts,
        addToast,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
