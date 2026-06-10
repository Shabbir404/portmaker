import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { LogOut, LayoutDashboard, Hammer, Menu, X } from 'lucide-react'
import Logo from './Logo'

const MARKETING_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Features', href: '/#features' },
  { label: 'How it works', href: '/#how-it-works' },
  { label: 'Preview', href: '/#preview' },
  { label: 'Pricing', href: '/pricing' },
]

const APP_ROUTES = ['/builder', '/dashboard', '/preview']

export default function Navbar() {
  const { user, logout } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const isActive = (path) => location.pathname === path
  const showMarketingLinks =
    !user ||
    ['/', '/pricing'].includes(location.pathname) ||
    APP_ROUTES.includes(location.pathname)

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (path) => {
    setMenuOpen(false)
    navigate(path)
  }

  return (
    <>
      <nav className={`site-nav ${scrolled ? 'site-nav--scrolled' : ''}`}>
        <Link to={user ? '/dashboard' : '/'} className="shrink-0 hover:opacity-90 transition-opacity">
          <Logo />
        </Link>

        {showMarketingLinks && (
          <div className="hidden lg:flex items-center gap-1">
            {MARKETING_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="nav-link">
                {l.label}
              </a>
            ))}
          </div>
        )}

        {user && (
          <div className="hidden md:flex items-center gap-1">
            <NavBtn active={isActive('/dashboard')} onClick={() => go('/dashboard')}>
              <LayoutDashboard size={15} /> Dashboard
            </NavBtn>
            <NavBtn active={isActive('/builder')} onClick={() => go('/builder')}>
              <Hammer size={15} /> Builder
            </NavBtn>
          </div>
        )}

        <div className="hidden sm:flex items-center gap-2">
          {user ? (
            <>
              <div className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-lg glass-subtle">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-[11px] font-bold text-white">
                  {user.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="text-sm text-ink-2 font-medium max-w-[120px] truncate">{user.name}</span>
              </div>
              <button onClick={() => { logout(); go('/') }} className="btn-ghost text-xs px-3 py-2 gap-1.5">
                <LogOut size={14} />
                <span className="hidden md:inline">Sign out</span>
              </button>
            </>
          ) : (
            <>
              <button onClick={() => go('/login')} className="btn-ghost text-sm px-4 py-2">
                Sign in
              </button>
              <button onClick={() => go('/login?mode=signup')} className="btn-gradient text-sm px-4 py-2">
                Get started
              </button>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className="sm:hidden flex items-center justify-center w-10 h-10 rounded-lg text-ink-2 hover:text-ink hover:bg-white/10 transition-colors"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      <div
        className={`fixed inset-0 z-30 lg:hidden transition-opacity duration-300 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="absolute inset-0 bg-black/75 backdrop-blur-md" onClick={() => setMenuOpen(false)} />
        <div className={`mobile-drawer ${menuOpen ? 'mobile-drawer--open' : ''}`}>
          {showMarketingLinks && (
            <div className="flex flex-col gap-1 mb-4">
              {MARKETING_LINKS.map((l) => (
                <a key={l.href} href={l.href} className="mobile-nav-item" onClick={() => setMenuOpen(false)}>
                  {l.label}
                </a>
              ))}
            </div>
          )}
          {user ? (
            <>
              <NavBtn active={isActive('/dashboard')} onClick={() => go('/dashboard')} className="w-full justify-start px-4 py-3">
                <LayoutDashboard size={18} /> Dashboard
              </NavBtn>
              <NavBtn active={isActive('/builder')} onClick={() => go('/builder')} className="w-full justify-start px-4 py-3">
                <Hammer size={18} /> Builder
              </NavBtn>
              <button
                onClick={() => { logout(); go('/') }}
                className="mobile-nav-item text-rose-400 mt-2"
              >
                <LogOut size={18} /> Sign out
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-white/10">
              <button onClick={() => go('/login')} className="btn-ghost w-full py-3">
                Sign in
              </button>
              <button onClick={() => go('/login?mode=signup')} className="btn-gradient w-full py-3">
                Get started free
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function NavBtn({ active, onClick, children, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`nav-link flex items-center gap-1.5 ${active ? 'nav-link--active' : ''} ${className}`}
    >
      {children}
    </button>
  )
}
