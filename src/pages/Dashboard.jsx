import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  ChevronRight,
  Eye,
  FolderKanban,
  Hammer,
  Layers,
  LayoutGrid,
  Loader2,
  Plus,
  Rocket,
  Save,
  Settings2,
  Trash2,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useBuilder } from '../context/BuilderContext'
import ProjectsAdmin from '../components/admin/ProjectsAdmin'
import { deletePortfolio, listPortfoliosForUser, savePortfolioFromForm } from '../lib/portfolios'
import { isSupabaseConfigured } from '../lib/supabase'

const ROLE_EMOJI = {
  developer: '⌨️',
  designer: '🎨',
  doctor: '🩺',
  student: '🎓',
}

export default function Dashboard() {
  const { user, addToast } = useApp()
  const { form, generatedHTML, reset } = useBuilder()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const [portfolios, setPortfolios] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeSection, setActiveSection] = useState('projects')

  const selectedId = searchParams.get('portfolio') || ''
  const selected = portfolios.find((p) => p.id === selectedId) || null

  const loadPortfolios = useCallback(async () => {
    if (!user?.id || !isSupabaseConfigured) {
      setLoading(false)
      return []
    }
    setLoading(true)
    try {
      const rows = await listPortfoliosForUser(user.id)
      setPortfolios(rows)
      return rows
    } catch (err) {
      addToast(err.message || 'Could not load portfolios', 'error')
      return []
    } finally {
      setLoading(false)
    }
  }, [user?.id, addToast])

  useEffect(() => {
    loadPortfolios()
  }, [loadPortfolios])

  useEffect(() => {
    if (!portfolios.length) return
    const paramId = searchParams.get('portfolio')
    const valid = portfolios.some((p) => p.id === paramId)
    if (valid) return
    const lastId = sessionStorage.getItem('pf_last_portfolio_id')
    const pick = portfolios.find((r) => r.id === lastId) || portfolios[0]
    if (pick) setSearchParams({ portfolio: pick.id }, { replace: true })
  }, [portfolios, searchParams, setSearchParams])

  const selectPortfolio = (id) => {
    setSearchParams({ portfolio: id })
    sessionStorage.setItem('pf_last_portfolio_id', id)
    setActiveSection('projects')
  }

  const handleSaveCurrent = async () => {
    if (!user?.id) {
      addToast('Please sign in again', 'error')
      return
    }
    if (!form.name?.trim()) {
      addToast('Build a portfolio first (name required)', 'error')
      navigate('/builder')
      return
    }
    setSaving(true)
    try {
      const saved = await savePortfolioFromForm(user.id, form)
      addToast('Portfolio saved to admin', 'success')
      sessionStorage.setItem('pf_last_portfolio_id', saved.id)
      await loadPortfolios()
      setSearchParams({ portfolio: saved.id })
      setActiveSection('projects')
    } catch (err) {
      addToast(err.message || 'Save failed', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}" and all its projects?`)) return
    try {
      await deletePortfolio(id, user.id)
      addToast('Portfolio deleted', 'success')
      if (selectedId === id) setSearchParams({})
      await loadPortfolios()
    } catch (err) {
      addToast(err.message || 'Delete failed', 'error')
    }
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="admin-page">
        <div className="admin-setup-banner">
          <h2>Connect Supabase</h2>
          <p>Add <code>.env</code> keys — see <code>supabase/SETUP.md</code></p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <LayoutGrid size={18} className="text-accent" />
          <div>
            <p className="admin-sidebar__label">PortfolioForge</p>
            <p className="admin-sidebar__title">Admin Panel</p>
          </div>
        </div>

        <p className="admin-sidebar__section">Portfolios</p>
        <nav className="admin-sidebar__nav">
          {loading ? (
            <div className="admin-sidebar__loading">
              <Loader2 size={18} className="animate-spin" />
            </div>
          ) : portfolios.length === 0 ? (
            <p className="admin-sidebar__empty">No portfolios saved yet</p>
          ) : (
            portfolios.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => selectPortfolio(p.id)}
                className={`admin-sidebar__item ${selectedId === p.id ? 'admin-sidebar__item--active' : ''}`}
              >
                <span className="admin-sidebar__emoji">{ROLE_EMOJI[p.role] || '✦'}</span>
                <span className="admin-sidebar__item-text">
                  <span className="admin-sidebar__item-name">{p.display_name}</span>
                  <span className="admin-sidebar__item-slug">/p/{p.slug}</span>
                </span>
                {selectedId === p.id && <ChevronRight size={14} className="ml-auto opacity-60" />}
              </button>
            ))
          )}
        </nav>

        <div className="admin-sidebar__footer">
          {(generatedHTML || form.name) && (
            <button type="button" onClick={handleSaveCurrent} disabled={saving} className="admin-sidebar__action">
              <Save size={15} />
              {saving ? 'Saving…' : 'Save current build'}
            </button>
          )}
          <button
            type="button"
            onClick={() => { reset(); navigate('/builder') }}
            className="admin-sidebar__action admin-sidebar__action--primary"
          >
            <Plus size={15} /> New portfolio
          </button>
        </div>
      </aside>

      <main className="admin-main">
        {!selected ? (
          <div className="admin-welcome">
            <div className="admin-welcome__icon">
              <Layers size={32} />
            </div>
            <h1>Welcome, {user?.name?.split(' ')[0] || 'there'}</h1>
            <p>Select a portfolio on the left, or save your latest build to get started.</p>

            {generatedHTML && form.name ? (
              <button type="button" onClick={handleSaveCurrent} disabled={saving} className="btn-primary px-6 py-3 gap-2 mt-4">
                <Save size={16} />
                {saving ? 'Saving…' : 'Save portfolio to admin'}
              </button>
            ) : (
              <button type="button" onClick={() => { reset(); navigate('/builder') }} className="btn-primary px-6 py-3 gap-2 mt-4">
                <Hammer size={16} /> Build a portfolio
              </button>
            )}
          </div>
        ) : (
          <>
            <header className="admin-header">
              <div>
                <p className="admin-header__eyebrow">Portfolio</p>
                <h1 className="admin-header__title">{selected.display_name}</h1>
                <p className="admin-header__meta">
                  {selected.role || 'portfolio'} · {selected.theme_id || 'default theme'} · /p/{selected.slug}
                  {selected.published && <span className="admin-badge-live">Live</span>}
                </p>
              </div>
              <div className="admin-header__actions">
                <button type="button" onClick={() => navigate('/preview')} className="btn-ghost text-sm px-4 py-2 gap-2">
                  <Eye size={15} /> Preview
                </button>
                <button type="button" className="btn-green text-sm px-4 py-2 gap-2" disabled title="Coming soon">
                  <Rocket size={15} /> Go Live
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(selected.id, selected.display_name)}
                  className="btn-ghost text-sm px-3 py-2 text-rose-400"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </header>

            <div className="admin-tabs">
              <button
                type="button"
                onClick={() => setActiveSection('projects')}
                className={`admin-tab ${activeSection === 'projects' ? 'admin-tab--active' : ''}`}
              >
                <FolderKanban size={15} /> Projects
              </button>
              <button
                type="button"
                onClick={() => setActiveSection('overview')}
                className={`admin-tab ${activeSection === 'overview' ? 'admin-tab--active' : ''}`}
              >
                <Settings2 size={15} /> Overview
              </button>
            </div>

            <div className="admin-content">
              {activeSection === 'projects' ? (
                <ProjectsAdmin
                  portfolioId={selected.id}
                  portfolioRole={selected.role}
                  portfolioName={selected.display_name}
                />
              ) : (
                <div className="admin-overview">
                  <div className="admin-stat-grid">
                    <div className="admin-stat">
                      <p>Role</p>
                      <strong className="capitalize">{selected.role || '—'}</strong>
                    </div>
                    <div className="admin-stat">
                      <p>Theme</p>
                      <strong>{selected.theme_id || '—'}</strong>
                    </div>
                    <div className="admin-stat">
                      <p>Status</p>
                      <strong>{selected.published ? 'Published' : 'Draft'}</strong>
                    </div>
                    <div className="admin-stat">
                      <p>Public URL</p>
                      <strong className="text-accent-2">/p/{selected.slug}</strong>
                    </div>
                  </div>
                  <p className="text-sm text-ink-3 mt-6">
                    Use the <strong className="text-ink-2">Projects</strong> tab to add, edit, delete, and reorder work on this portfolio.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
