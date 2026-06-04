import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Modal } from './UI'
import { Eye, EyeOff } from 'lucide-react'

export default function AuthModal() {
  const { modal, setModal, login, addToast } = useApp()
  const [mode, setMode] = useState(modal || 'signup')
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  if (!modal) return null

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) { addToast('Please fill in all fields', 'error'); return }
    if (mode === 'signup' && !form.firstName) { addToast('Please enter your name', 'error'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 600)) // simulate API
    const name = mode === 'signup' ? `${form.firstName} ${form.lastName}`.trim() : form.email.split('@')[0]
    login({ name, email: form.email })
    addToast(mode === 'signup' ? `Welcome, ${name}! 🎉` : 'Welcome back!', 'success')
    setLoading(false)
  }

  return (
    <Modal onClose={() => setModal(null)}>
      {/* Header */}
      <div className="mb-6">
        <h2 className="font-syne text-2xl font-bold text-ink">
          {mode === 'login' ? 'Welcome back' : 'Create account'}
        </h2>
        <p className="text-sm text-ink-2 mt-1">
          {mode === 'login' ? 'Sign in to your PortfolioForge account' : 'Start building your AI-powered portfolio'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex p-1 rounded-xl mb-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <button className={`tab-pill ${mode === 'signup' ? 'active' : ''}`} onClick={() => setMode('signup')}>Sign Up</button>
        <button className={`tab-pill ${mode === 'login' ? 'active' : ''}`} onClick={() => setMode('login')}>Sign In</button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {mode === 'signup' && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">First Name</label>
              <input className="input-field" placeholder="Alex" value={form.firstName} onChange={set('firstName')} />
            </div>
            <div>
              <label className="label">Last Name</label>
              <input className="input-field" placeholder="Johnson" value={form.lastName} onChange={set('lastName')} />
            </div>
          </div>
        )}

        <div>
          <label className="label">Email</label>
          <input className="input-field" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} />
        </div>

        <div>
          <label className="label">Password</label>
          <div className="relative">
            <input className="input-field pr-10" type={showPass ? 'text' : 'password'}
              placeholder={mode === 'signup' ? 'Create a strong password' : 'Your password'}
              value={form.password} onChange={set('password')} />
            <button type="button" onClick={() => setShowPass(s => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-3 hover:text-ink-2 transition">
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="btn-primary w-full justify-center mt-1 py-3"
          style={{ opacity: loading ? 0.7 : 1 }}>
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {mode === 'signup' ? 'Creating account...' : 'Signing in...'}
            </span>
          ) : (
            mode === 'signup' ? 'Create Account →' : 'Sign In →'
          )}
        </button>
      </form>

      <p className="text-xs text-ink-3 text-center mt-4">
        {mode === 'signup' ? (
          <>Already have an account? <button onClick={() => setMode('login')} className="text-accent hover:text-accent-2 transition">Sign in</button></>
        ) : (
          <>No account? <button onClick={() => setMode('signup')} className="text-accent hover:text-accent-2 transition">Sign up free</button></>
        )}
      </p>
    </Modal>
  )
}
