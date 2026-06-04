import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { useNavigate, useLocation } from 'react-router-dom'
import { LogOut, LayoutDashboard, Hammer, Menu, X } from 'lucide-react'

export default function Navbar() {
  const { user, logout, setModal } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const isActive = (path) => location.pathname === path
  const isLanding = location.pathname === '/'

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const go = (path) => {
    setMenuOpen(false)
    navigate(path)
  }

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-5 sm:px-6 lg:px-8 h-16"
        style={{
          background: 'rgba(9,9,11,0.8)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        <button
          onClick={() => go(user ? '/dashboard' : '/')}
          className="type-display text-[15px] font-semibold tracking-tight text-ink shrink-0"
        >
          Portfolio<span className="text-ink-3">Forge</span>
        </button>

        {user && (
          <div className="hidden md:flex items-center gap-1">
            <NavLink active={isActive('/dashboard')} onClick={() => go('/dashboard')}>
              <LayoutDashboard size={15} strokeWidth={1.75} /> Dashboard
            </NavLink>
            <NavLink active={isActive('/builder')} onClick={() => go('/builder')}>
              <Hammer size={15} strokeWidth={1.75} /> Builder
            </NavLink>
          </div>
        )}

        <div className="hidden sm:flex items-center gap-2">
          {user ? (
            <>
              <div
                className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-lg"
                style={{ border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold text-ink"
                  style={{ background: 'rgba(255,255,255,0.08)' }}>
                  {user.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="text-sm text-ink-2 font-medium max-w-[120px] truncate">{user.name}</span>
              </div>
              <button
                onClick={() => { logout(); go('/') }}
                className="btn-ghost text-xs px-3 py-2 gap-1.5"
              >
                <LogOut size={14} strokeWidth={1.75} />
                <span className="hidden md:inline">Sign out</span>
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setModal('login')} className="btn-ghost text-sm px-4 py-2">
                Sign in
              </button>
              <button onClick={() => setModal('signup')} className="btn-primary text-sm px-4 py-2">
                Get started
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => setMenuOpen(o => !o)}
          className="sm:hidden flex items-center justify-center w-9 h-9 rounded-lg text-ink-2 hover:text-ink hover:bg-white/[0.04] transition-colors"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={20} strokeWidth={1.75} /> : <Menu size={20} strokeWidth={1.75} />}
        </button>
      </nav>

      <div
        className={`fixed inset-0 z-30 sm:hidden transition-opacity duration-200 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        aria-hidden={!menuOpen}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
        <div
          className={`absolute top-16 left-0 right-0 bottom-0 overflow-y-auto transition-transform duration-200 ${menuOpen ? 'translate-y-0' : '-translate-y-2'}`}
          style={{ background: '#09090b', borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="p-5 flex flex-col gap-1">
            {user ? (
              <>
                <div className="flex items-center gap-3 px-4 py-3 mb-3 rounded-lg"
                  style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold text-ink"
                    style={{ background: 'rgba(255,255,255,0.08)' }}>
                    {user.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{user.name}</p>
                    <p className="text-xs text-ink-3 truncate">{user.email}</p>
                  </div>
                </div>
                <MobileNavLink active={isActive('/dashboard')} onClick={() => go('/dashboard')}>
                  <LayoutDashboard size={18} strokeWidth={1.75} /> Dashboard
                </MobileNavLink>
                <MobileNavLink active={isActive('/builder')} onClick={() => go('/builder')}>
                  <Hammer size={18} strokeWidth={1.75} /> Builder
                </MobileNavLink>
                <button
                  onClick={() => { logout(); go('/') }}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-ink-2 hover:text-ink hover:bg-white/[0.04] transition-colors mt-2"
                >
                  <LogOut size={18} strokeWidth={1.75} /> Sign out
                </button>
              </>
            ) : (
              <>
                {isLanding && (
                  <MobileNavLink onClick={() => { setMenuOpen(false); document.getElementById('preview')?.scrollIntoView({ behavior: 'smooth' }) }}>
                    View example
                  </MobileNavLink>
                )}
                <div className="flex flex-col gap-2 mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <button
                    onClick={() => { setMenuOpen(false); setModal('login') }}
                    className="btn-ghost w-full justify-center py-3"
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => { setMenuOpen(false); setModal('signup') }}
                    className="btn-primary w-full justify-center py-3"
                  >
                    Get started
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

function NavLink({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        active ? 'text-ink bg-white/[0.06]' : 'text-ink-2 hover:text-ink hover:bg-white/[0.03]'
      }`}
    >
      {children}
    </button>
  )
}

function MobileNavLink({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors w-full text-left ${
        active ? 'text-ink bg-white/[0.06]' : 'text-ink-2 hover:text-ink hover:bg-white/[0.04]'
      }`}
    >
      {children}
    </button>
  )
}
