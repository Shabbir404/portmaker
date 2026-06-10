import { useCallback, useEffect, useState } from 'react'
import {
  ArrowDown,
  ArrowUp,
  GripVertical,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  Upload,
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { Input, Modal, Textarea } from '../UI'
import {
  createProject,
  deleteProject,
  listProjects,
  reorderProjects,
  updateProject,
  uploadProjectImage,
} from '../../lib/projects'

const EMPTY_FORM = {
  title: '',
  description: '',
  category: '',
  stack: '',
  img1: '',
  img2: '',
  img3: '',
  live_url: '',
  repo_url: '',
  project_url: '',
}

export default function ProjectsAdmin({ portfolioId, portfolioRole, portfolioName }) {
  const { user, addToast } = useApp()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(null)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)

  const isDesigner = portfolioRole === 'designer'
  const u = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const load = useCallback(async () => {
    if (!portfolioId) return
    setLoading(true)
    try {
      const list = await listProjects(portfolioId)
      setProjects(list)
    } catch (err) {
      addToast(err.message || 'Could not load projects', 'error')
    } finally {
      setLoading(false)
    }
  }, [portfolioId, addToast])

  useEffect(() => {
    load()
  }, [load])

  const openCreate = () => {
    setForm(EMPTY_FORM)
    setModal('create')
  }

  const openEdit = (project) => {
    setForm({
      title: project.title || '',
      description: project.description || '',
      category: project.category || '',
      stack: project.stack || '',
      img1: project.img1 || '',
      img2: project.img2 || '',
      img3: project.img3 || '',
      live_url: project.live_url || '',
      repo_url: project.repo_url || '',
      project_url: project.project_url || '',
    })
    setModal({ type: 'edit', id: project.id })
  }

  const handleSave = async () => {
    if (!form.title.trim()) {
      addToast('Project title is required', 'error')
      return
    }
    setSaving(true)
    try {
      if (modal === 'create') {
        await createProject(portfolioId, form)
        addToast('Project added', 'success')
      } else if (modal?.type === 'edit') {
        await updateProject(modal.id, form)
        addToast('Project updated', 'success')
      }
      setModal(null)
      await load()
    } catch (err) {
      addToast(err.message || 'Save failed', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (project) => {
    if (!confirm(`Delete "${project.title}"?`)) return
    try {
      await deleteProject(project.id)
      addToast('Project deleted', 'success')
      await load()
    } catch (err) {
      addToast(err.message || 'Delete failed', 'error')
    }
  }

  const moveProject = async (index, direction) => {
    const next = index + direction
    if (next < 0 || next >= projects.length) return
    const ids = projects.map((p) => p.id)
    ;[ids[index], ids[next]] = [ids[next], ids[index]]
    setProjects((prev) => {
      const copy = [...prev]
      ;[copy[index], copy[next]] = [copy[next], copy[index]]
      return copy
    })
    try {
      await reorderProjects(portfolioId, ids)
    } catch (err) {
      addToast(err.message || 'Reorder failed', 'error')
      await load()
    }
  }

  const handleImageUpload = async (slot, file) => {
    if (!file || !user?.id) return
    setUploading(slot)
    try {
      const url = await uploadProjectImage(user.id, file)
      setForm((f) => ({ ...f, [slot]: url }))
      addToast('Image uploaded', 'success')
    } catch (err) {
      addToast(err.message || 'Upload failed', 'error')
    } finally {
      setUploading(null)
    }
  }

  if (!portfolioId) {
    return (
      <div className="admin-panel-empty">
        <p>Select a portfolio from the sidebar to manage projects.</p>
      </div>
    )
  }

  return (
    <div className="admin-projects">
      <div className="admin-projects__toolbar">
        <div>
          <h2 className="admin-projects__title">Projects</h2>
          <p className="admin-projects__sub">
            {portfolioName ? `Portfolio: ${portfolioName}` : 'Manage your work'} · {projects.length} item{projects.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button type="button" onClick={openCreate} className="btn-primary px-4 py-2.5 text-sm gap-2">
          <Plus size={16} /> Add project
        </button>
      </div>

      {loading ? (
        <div className="admin-projects__loading">
          <Loader2 size={24} className="animate-spin text-ink-3" />
        </div>
      ) : projects.length === 0 ? (
        <div className="admin-empty-card">
          <div className="admin-empty-card__icon">📁</div>
          <h3>No projects yet</h3>
          <p>Add your first project — it appears on your portfolio when you go live.</p>
          <button type="button" onClick={openCreate} className="btn-primary px-5 py-2.5 gap-2 text-sm mt-2">
            <Plus size={15} /> Add first project
          </button>
        </div>
      ) : (
        <div className="admin-project-list">
          {projects.map((project, index) => (
            <article key={project.id} className="admin-project-row">
              <div className="admin-project-row__grip" aria-hidden>
                <GripVertical size={16} />
              </div>
              <div className="admin-project-row__order">{String(index + 1).padStart(2, '0')}</div>
              {project.img1 ? (
                <img src={project.img1} alt="" className="admin-project-row__thumb" />
              ) : (
                <div className="admin-project-row__thumb admin-project-row__thumb--empty">IMG</div>
              )}
              <div className="admin-project-row__body">
                <h3>{project.title}</h3>
                <p className="admin-project-row__meta">
                  {isDesigner ? project.category || 'Design' : project.stack || 'No stack'}
                </p>
                {project.description && (
                  <p className="admin-project-row__desc">{project.description}</p>
                )}
              </div>
              <div className="admin-project-row__actions">
                <button type="button" disabled={index === 0} onClick={() => moveProject(index, -1)} className="admin-icon-btn" title="Move up">
                  <ArrowUp size={15} />
                </button>
                <button type="button" disabled={index === projects.length - 1} onClick={() => moveProject(index, 1)} className="admin-icon-btn" title="Move down">
                  <ArrowDown size={15} />
                </button>
                <button type="button" onClick={() => openEdit(project)} className="admin-icon-btn" title="Edit">
                  <Pencil size={15} />
                </button>
                <button type="button" onClick={() => handleDelete(project)} className="admin-icon-btn admin-icon-btn--danger" title="Delete">
                  <Trash2 size={15} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {modal && (
        <Modal onClose={() => !saving && setModal(null)} width="max-w-lg">
          <h2 className="font-syne text-xl font-bold text-ink mb-1">
            {modal === 'create' ? 'New project' : 'Edit project'}
          </h2>
          <p className="text-xs text-ink-3 mb-5">Changes save to your database instantly.</p>

          <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-1">
            <Input label="Title *" value={form.title} onChange={u('title')} placeholder="Project name" />
            <Textarea label="Description" value={form.description} onChange={u('description')} placeholder="What does it do?" rows={3} />

            {isDesigner ? (
              <>
                <Input label="Category" value={form.category} onChange={u('category')} placeholder="UI/UX, Branding..." />
                <Input label="Project URL" value={form.project_url} onChange={u('project_url')} placeholder="https://..." />
              </>
            ) : (
              <>
                <Input label="Tech stack" value={form.stack} onChange={u('stack')} placeholder="React, Node.js..." />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input label="Live URL" value={form.live_url} onChange={u('live_url')} placeholder="https://..." />
                  <Input label="Repo URL" value={form.repo_url} onChange={u('repo_url')} placeholder="https://github.com/..." />
                </div>
              </>
            )}

            {['img1', 'img2', 'img3'].map((slot, i) => (
              <ImageSlot
                key={slot}
                label={`Screenshot ${i + 1}${i === 0 ? ' (main)' : ''}`}
                url={form[slot]}
                uploading={uploading === slot}
                onUpload={(file) => handleImageUpload(slot, file)}
                onClear={() => setForm((f) => ({ ...f, [slot]: '' }))}
              />
            ))}
          </div>

          <div className="flex gap-3 mt-6">
            <button type="button" onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center py-3 gap-2">
              {saving && <Loader2 size={16} className="animate-spin" />}
              {modal === 'create' ? 'Save project' : 'Update project'}
            </button>
            <button type="button" onClick={() => setModal(null)} disabled={saving} className="btn-ghost px-5 py-3">
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

function ImageSlot({ label, url, uploading, onUpload, onClear }) {
  return (
    <div>
      <label className="label">{label}</label>
      {url ? (
        <div className="flex items-center gap-3 mt-1">
          <img src={url} alt="" className="w-28 h-18 rounded-lg object-cover border border-white/10" />
          <button type="button" onClick={onClear} className="btn-ghost text-xs px-3 py-2">Remove</button>
        </div>
      ) : (
        <label className="admin-upload-zone mt-1">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) onUpload(file)
              e.target.value = ''
            }}
          />
          {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
          <span>{uploading ? 'Uploading…' : 'Click or drop image'}</span>
        </label>
      )}
    </div>
  )
}
