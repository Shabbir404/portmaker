import { useEffect } from 'react'
import { useBuilder } from '../../context/BuilderContext'
import { BUILDER_PROJECT_LIMIT } from '../../lib/builderProjects'
import { Input, Textarea, PhotoUpload } from '../../components/UI'
import { ChevronLeft, ChevronRight, Plus, Trash2, FolderKanban } from 'lucide-react'

export default function Step3Projects({ totalSteps = 6 }) {
  const { form, updateProject, addProject, removeProject, setStep } = useBuilder()
  const isDesigner = form.role === 'designer'
  const projects = form.projects || []

  useEffect(() => {
    if (!projects.length) addProject()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const u = (index, key) => (e) => updateProject(index, { [key]: e.target.value })

  return (
    <div className="animate-fade-up">
      <div className="mb-8">
        <p className="text-xs font-mono text-accent-2 mb-2">// step 4 of {totalSteps}</p>
        <h2 className="font-syne text-3xl font-bold text-ink">
          {isDesigner ? 'Your design work' : 'Your projects'}
        </h2>
        <p className="text-ink-2 text-sm mt-2">
          Add up to <strong className="text-ink">{BUILDER_PROJECT_LIMIT} projects</strong> for your preview.
          {isDesigner
            ? ' Use image URLs or uploads — these appear in your portfolio gallery.'
            : ' Add live site and repo links so visitors can explore your work.'}
        </p>
      </div>

      <div className="flex flex-col gap-4 mb-4">
        {projects.map((project, index) => (
          <div key={index} className="card-surface rounded-2xl p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                <FolderKanban size={16} className="text-accent-2" />
                Project {index + 1}
              </div>
              {projects.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeProject(index)}
                  className="inline-flex items-center gap-1.5 text-xs text-ink-3 hover:text-rose-400 transition"
                >
                  <Trash2 size={14} />
                  Remove
                </button>
              )}
            </div>

            <Input
              label="Project title"
              placeholder={isDesigner ? 'Brand identity for Acme Co.' : 'E-commerce dashboard'}
              value={project.title}
              onChange={u(index, 'title')}
            />

            {isDesigner ? (
              <Input
                label="Category"
                placeholder="UI/UX Design, Branding, Illustration…"
                value={project.category}
                onChange={u(index, 'category')}
              />
            ) : (
              <Input
                label="Tech stack"
                placeholder="React, Node.js, PostgreSQL"
                value={project.stack}
                onChange={u(index, 'stack')}
              />
            )}

            <Textarea
              label="Short description"
              placeholder="What you built and the impact it had…"
              value={project.description}
              onChange={u(index, 'description')}
            />

            {isDesigner ? (
              <Input
                label="Project link (optional)"
                placeholder="https://behance.net/… or Figma prototype"
                value={project.project_url}
                onChange={u(index, 'project_url')}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Live site URL"
                  placeholder="https://myapp.vercel.app"
                  value={project.live_url}
                  onChange={u(index, 'live_url')}
                />
                <Input
                  label="GitHub / repo URL"
                  placeholder="https://github.com/you/project"
                  value={project.repo_url}
                  onChange={u(index, 'repo_url')}
                />
              </div>
            )}

            <PhotoUpload
              label={isDesigner ? 'Main design image' : 'Screenshot (optional)'}
              value={project.img1}
              onChange={(dataUrl) => updateProject(index, { img1: dataUrl })}
              onClear={() => updateProject(index, { img1: '' })}
              hint="Upload or paste URL below · used in preview"
            />

            <Input
              label="Image URL (optional)"
              placeholder="https://… — if you host images elsewhere"
              value={project.img1?.startsWith('data:') ? '' : project.img1}
              onChange={u(index, 'img1')}
            />

            {isDesigner && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Extra image URL 2"
                  placeholder="https://…"
                  value={project.img2}
                  onChange={u(index, 'img2')}
                />
                <Input
                  label="Extra image URL 3"
                  placeholder="https://…"
                  value={project.img3}
                  onChange={u(index, 'img3')}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {projects.length < BUILDER_PROJECT_LIMIT && (
        <button type="button" onClick={addProject} className="btn-ghost w-full py-3 gap-2 mb-6">
          <Plus size={16} />
          Add project ({projects.length}/{BUILDER_PROJECT_LIMIT})
        </button>
      )}

      <p className="text-xs text-ink-3 mb-6 text-center">
        All projects are optional. Empty slots are skipped in your preview.
      </p>

      <div className="flex justify-between mt-8">
        <button type="button" onClick={() => setStep(3)} className="btn-ghost px-6 py-3 gap-2">
          <ChevronLeft size={16} /> Back
        </button>
        <button type="button" onClick={() => setStep(5)} className="btn-primary px-7 py-3 gap-2">
          Choose theme <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
