import { useApp } from '../context/AppContext'
import { useBuilder } from '../context/BuilderContext'
import { useNavigate } from 'react-router-dom'
import { Plus, Eye, Download, Rocket, Trash2, ExternalLink, Clock, Layers } from 'lucide-react'

export default function Dashboard() {
  const { user } = useApp()
  const { generatedHTML, form, role, reset } = useBuilder()
  const navigate = useNavigate()

  const firstName = user?.name?.split(' ')[0] || 'there'
  const hasPortfolio = !!generatedHTML

  return (
    <div className="min-h-screen pt-24 pb-16 px-6 md:px-10">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-10 animate-fade-up">
          <p className="text-xs text-ink-3 font-mono mb-1">// dashboard</p>
          <h1 className="font-syne text-4xl font-bold text-ink mb-2">
            Welcome back, <span className="text-grad">{firstName}</span> 👋
          </h1>
          <p className="text-ink-2">Manage your portfolios and build new ones.</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Portfolios Built', value: hasPortfolio ? '1' : '0', color: 'text-accent' },
            { label: 'Live Deployments', value: '0', color: 'text-emerald-forge' },
            { label: 'Total Views', value: '—', color: 'text-ink-2' },
            { label: 'Templates Ready', value: '20', color: 'text-violet-forge' },
          ].map(s => (
            <div key={s.label} className="card-surface p-5 rounded-2xl">
              <p className="text-xs text-ink-3 uppercase tracking-widest mb-2">{s.label}</p>
              <p className={`font-syne text-3xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Build CTA */}
        <div className="relative rounded-3xl p-8 mb-8 overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(79,140,255,0.08), rgba(167,139,250,0.08))', border: '1px solid rgba(79,140,255,0.18)' }}>
          <div className="absolute right-6 top-6 text-5xl opacity-20 font-mono select-none hidden md:block">{'</>'}</div>
          <h2 className="font-syne text-2xl font-bold text-ink mb-2">Build a new portfolio</h2>
          <p className="text-ink-2 text-sm mb-5 max-w-md">
            Choose your role, fill in your details, pick a template — and your portfolio is ready in seconds.
          </p>
          <button onClick={() => { reset(); navigate('/builder') }}
            className="btn-primary px-6 py-3 gap-2">
            <Plus size={16} /> Start Building
          </button>
        </div>

        {/* Portfolio list */}
        {hasPortfolio ? (
          <div className="flex flex-col gap-4">
            <h3 className="font-syne font-semibold text-sm text-ink-2 uppercase tracking-widest">Your Portfolios</h3>
            <PortfolioCard form={form} onPreview={() => navigate('/preview')} />
          </div>
        ) : (
          <EmptyState onBuild={() => { reset(); navigate('/builder') }} />
        )}
      </div>
    </div>
  )
}

function PortfolioCard({ form, onPreview }) {
  const { addToast } = useApp()
  const roleColors = { developer: '#4f8cff', designer: '#f472b6', doctor: '#22d3a0', student: '#a78bfa', other: '#fbbf24' }
  const color = roleColors[form.role] || '#4f8cff'

  return (
    <div className="card-surface rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center gap-4">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
        style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
        {form.role === 'developer' ? '⌨️' : form.role === 'designer' ? '🎨' : form.role === 'doctor' ? '🩺' : form.role === 'student' ? '🎓' : '✦'}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-semibold text-ink text-base">{form.name || 'My Portfolio'}</h3>
          <span className="badge text-xs px-2 py-0.5 rounded-full capitalize"
            style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}>
            {form.role}
          </span>
        </div>
        <p className="text-xs text-ink-3 mt-0.5 flex items-center gap-1.5">
          <Clock size={11} /> Generated just now
        </p>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <button onClick={onPreview} className="btn-ghost text-xs px-3 py-2 gap-1.5">
          <Eye size={13} /> Preview
        </button>
        <button className="btn-ghost text-xs px-3 py-2 gap-1.5"
          onClick={() => addToast('Download starting...', 'info')}>
          <Download size={13} /> ZIP
        </button>
        <button className="btn-green text-xs px-3 py-2 gap-1.5">
          <Rocket size={13} /> Deploy
        </button>
      </div>
    </div>
  )
}

function EmptyState({ onBuild }) {
  return (
    <div className="card rounded-3xl p-16 flex flex-col items-center text-center gap-4">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl"
        style={{ background: 'rgba(79,140,255,0.08)', border: '1px solid rgba(79,140,255,0.15)' }}>
        <Layers size={28} className="text-accent-2" />
      </div>
      <div>
        <h3 className="font-syne text-lg font-semibold text-ink mb-1">No portfolios yet</h3>
        <p className="text-sm text-ink-2">Build your first portfolio in under 60 seconds.</p>
      </div>
      <button onClick={onBuild} className="btn-primary px-6 py-3 mt-1 gap-2">
        <Plus size={15} /> Build Your First Portfolio
      </button>
    </div>
  )
}
