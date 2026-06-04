import { createContext, useContext, useState, useCallback } from 'react'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [toasts, setToasts] = useState([])
  const [modal, setModal] = useState(null) // 'login' | 'signup' | null

  const addToast = useCallback((msg, type = 'info') => {
    const id = Date.now()
    setToasts(t => [...t, { id, msg, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3200)
  }, [])

  const login = useCallback((userData) => {
    setUser(userData)
    setModal(null)
  }, [])

  const logout = useCallback(() => setUser(null), [])

  return (
    <AppContext.Provider value={{ user, login, logout, toasts, addToast, modal, setModal }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
