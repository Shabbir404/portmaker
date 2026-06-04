import { useState } from 'react'
import { X, Eye, EyeOff } from 'lucide-react'

// ─── Input ───
export function Input({ label, skip, skipped, onSkip, onUnskip, hint, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <div className="flex items-center justify-between">
          <label className="label">{label}</label>
          {skip && !skipped && (
            <button type="button" onClick={onSkip}
              className="text-xs text-ink-3 hover:text-ink-2 transition underline underline-offset-2">
              Prefer not to
            </button>
          )}
          {skip && skipped && (
            <button type="button" onClick={onUnskip}
              className="text-xs text-accent-2 hover:text-accent transition">
              + Add this
            </button>
          )}
        </div>
      )}
      {skipped ? (
        <div className="input-field text-ink-3 italic cursor-not-allowed opacity-50 flex items-center gap-2">
          <span>Skipped</span>
        </div>
      ) : (
        <input className="input-field" {...props} />
      )}
      {hint && !skipped && <p className="text-xs text-ink-3 mt-0.5">{hint}</p>}
    </div>
  )
}

// ─── Password Input ───
export function PasswordInput({ label, hint, ...props }) {
  const [show, setShow] = useState(false)
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="label">{label}</label>}
      <div className="relative">
        <input className="input-field pr-10" type={show ? 'text' : 'password'} {...props} />
        <button type="button" onClick={() => setShow(s => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-3 hover:text-ink-2 transition">
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
      {hint && <p className="text-xs text-ink-3 mt-0.5">{hint}</p>}
    </div>
  )
}

// ─── Textarea ───
export function Textarea({ label, skip, skipped, onSkip, onUnskip, hint, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <div className="flex items-center justify-between">
          <label className="label">{label}</label>
          {skip && !skipped && (
            <button type="button" onClick={onSkip}
              className="text-xs text-ink-3 hover:text-ink-2 transition underline underline-offset-2">
              Prefer not to
            </button>
          )}
          {skip && skipped && (
            <button type="button" onClick={onUnskip}
              className="text-xs text-accent-2 hover:text-accent transition">
              + Add this
            </button>
          )}
        </div>
      )}
      {skipped ? (
        <div className="input-field text-ink-3 italic opacity-50 min-h-[80px] flex items-start pt-2">Skipped</div>
      ) : (
        <textarea className="input-field min-h-[90px] resize-y" {...props} />
      )}
      {hint && !skipped && <p className="text-xs text-ink-3 mt-0.5">{hint}</p>}
    </div>
  )
}

// ─── Select ───
export function Select({ label, options, hint, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="label">{label}</label>}
      <select className="input-field" style={{ background: '#0d1526' }} {...props}>
        {options.map(o => (
          <option key={o.value} value={o.value} style={{ background: '#0d1526' }}>{o.label}</option>
        ))}
      </select>
      {hint && <p className="text-xs text-ink-3 mt-0.5">{hint}</p>}
    </div>
  )
}

// ─── Skill chips ───
export function SkillsInput({ skills, onAdd, onRemove, placeholder = 'e.g. React, TypeScript — press Enter' }) {
  const [val, setVal] = useState('')
  const flush = () => {
    val.split(',').map(s => s.trim()).filter(Boolean).forEach(onAdd)
    setVal('')
  }
  const onKey = (e) => { if (e.key === 'Enter') { e.preventDefault(); flush() } }
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <input className="input-field flex-1" value={val} onChange={e => setVal(e.target.value)}
          onKeyDown={onKey} placeholder={placeholder} />
        <button type="button" onClick={flush} className="btn-ghost text-xs px-3 py-2 shrink-0">Add</button>
      </div>
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-1">
          {skills.map(s => (
            <span key={s} className="skill-chip">
              {s}
              <button type="button" onClick={() => onRemove(s)}
                className="ml-0.5 hover:text-rose-forge transition text-accent-2 leading-none">×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Divider ───
export function Divider({ label }) {
  return (
    <div className="relative flex items-center gap-3 my-2">
      <div className="flex-1 h-px bg-white/[0.07]" />
      {label && <span className="text-xs text-ink-3 shrink-0">{label}</span>}
      <div className="flex-1 h-px bg-white/[0.07]" />
    </div>
  )
}

// ─── Section header ───
export function SectionHeader({ icon, title, sub }) {
  return (
    <div className="mb-6">
      {icon && <div className="text-3xl mb-3">{icon}</div>}
      <h2 className="section-title">{title}</h2>
      {sub && <p className="section-sub mt-1">{sub}</p>}
    </div>
  )
}

// ─── Alert ───
export function Alert({ type = 'info', children }) {
  const colors = {
    info: 'bg-accent/[0.08] border-accent/20 text-accent-2',
    success: 'bg-emerald-forge/[0.08] border-emerald-forge/20 text-emerald-forge',
    error: 'bg-rose-forge/[0.08] border-rose-forge/20 text-rose-forge',
    warning: 'bg-amber-forge/[0.08] border-amber-forge/20 text-amber-forge',
  }
  return (
    <div className={`rounded-xl px-4 py-3 text-sm border ${colors[type]}`}>{children}</div>
  )
}

// ─── Spinner ───
export function Spinner({ size = 24 }) {
  return (
    <div style={{ width: size, height: size }}
      className="border-2 border-white/10 border-t-accent rounded-full animate-spin" />
  )
}

// ─── Modal wrapper ───
export function Modal({ onClose, children, width = 'max-w-md' }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`w-full ${width} rounded-3xl p-8 animate-fade-up`}
        style={{ background: '#0d1526', border: '1px solid rgba(255,255,255,0.13)', boxShadow: '0 40px 80px rgba(0,0,0,0.6)' }}>
        {children}
      </div>
    </div>
  )
}

// ─── Toast ───
export function ToastList({ toasts }) {
  const colors = { success: 'text-emerald-forge border-emerald-forge/30', error: 'text-rose-forge border-rose-forge/30', info: 'text-accent-2 border-accent/30' }
  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2">
      {toasts.map(t => (
        <div key={t.id}
          className={`rounded-xl px-4 py-3 text-sm border animate-fade-up shadow-float ${colors[t.type] || colors.info}`}
          style={{ background: '#0d1526', maxWidth: 320 }}>
          {t.msg}
        </div>
      ))}
    </div>
  )
}

// ─── Progress stepper ───
export function Stepper({ steps, current }) {
  return (
    <div className="flex items-center gap-0 relative mb-12">
      {steps.map((s, i) => {
        const n = i + 1
        const done = current > n
        const active = current === n
        return (
          <div key={s} className="flex items-center" style={{ flex: i < steps.length - 1 ? '1' : 'initial' }}>
            <div className="flex flex-col items-center relative">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all duration-300 ${
                done ? 'bg-accent border-accent text-white' :
                active ? 'border-accent text-accent bg-accent/10 shadow-glow-sm' :
                'border-white/10 text-ink-3'
              }`}>
                {done ? '✓' : n}
              </div>
              <span className={`absolute top-11 whitespace-nowrap text-xs font-medium transition-colors ${
                active ? 'text-accent-2' : done ? 'text-ink-2' : 'text-ink-3'
              }`}>{s}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-px mx-2 transition-all duration-500 ${done ? 'bg-accent' : 'bg-white/[0.07]'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
