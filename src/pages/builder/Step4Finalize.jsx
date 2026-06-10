import { useBuilder } from '../../context/BuilderContext'
import { useApp } from '../../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { Input, PasswordInput, Select, Alert } from '../../components/UI'
import { generatePortfolio } from '../../engine/templateEngine'
import { getThemeById } from '../../templates/registry'
import { savePortfolioFromForm } from '../../lib/portfolios'
import { replaceProjectsFromBuilder } from '../../lib/projects'
import { isSupabaseConfigured } from '../../lib/supabase'
import { ChevronLeft, Shield, Palette, Sparkles } from 'lucide-react'

const THEMES = [
  { value: 'auto', label: 'Auto — best match for your role' },
  { value: 'dark', label: 'Dark / Moody' },
  { value: 'light', label: 'Light / Clean' },
  { value: 'colorful', label: 'Bold / Colorful' },
]

export default function Step4Finalize({ totalSteps = 4 }) {
  const { form, updateForm, setIsGenerating, setGeneratedHTML, setStep } = useBuilder()
  const { user, addToast } = useApp()
  const navigate = useNavigate()

  const u = (k) => (e) => updateForm({ [k]: e.target.value })
  const usesThemePicker = form.role === 'developer' || form.role === 'designer'
  const themeMeta = usesThemePicker ? getThemeById(form.role, form.selectedTheme) : null

  const handleGenerate = async () => {
    if (!form.name.trim()) {
      addToast('Please go back and enter your name', 'error')
      return
    }
    if (usesThemePicker && !form.selectedTheme) {
      addToast('Please select a theme first', 'error')
      setStep(5)
      return
    }
    if (!form.adminPass.trim()) {
      addToast('Please set an admin panel password', 'error')
      return
    }

    setIsGenerating(true)
    navigate('/preview')

    try {
      const html = await generatePortfolio(form)
      setGeneratedHTML(html)

      if (isSupabaseConfigured && user?.id) {
        try {
          const saved = await savePortfolioFromForm(user.id, form)
          if (saved?.id) {
            const projectCount = (form.projects || []).filter((p) => p.title?.trim()).length
            if (projectCount > 0) {
              await replaceProjectsFromBuilder(saved.id, form.projects, user.id)
            }
            sessionStorage.setItem('pf_last_portfolio_id', saved.id)
          }
          addToast('Saved! Open Dashboard → Projects tab', 'success')
        } catch (saveErr) {
          addToast(saveErr.message || 'Generated but failed to save to database', 'error')
        }
      } else {
        addToast('Portfolio generated!', 'success')
      }
    } catch (err) {
      addToast(err.message || 'Generation failed', 'error')
      navigate('/builder')
    } finally {
      setIsGenerating(false)
    }
  }

  const roleLabel = { developer: 'Developer', designer: 'Designer', doctor: 'Doctor', student: 'Student', other: 'Professional' }

  return (
    <div className="animate-fade-up">
      <div className="mb-8">
        <p className="text-xs font-mono text-accent-2 mb-2">// step {totalSteps} of {totalSteps}</p>
        <h2 className="font-syne text-3xl font-bold text-ink">Finalize & Generate</h2>
        <p className="text-ink-2 text-sm mt-2">
          Set your admin panel credentials, then generate your portfolio.
        </p>
      </div>

      <div className="rounded-2xl p-4 mb-5 flex items-center gap-4"
        style={{ background: 'rgba(79,140,255,0.06)', border: '1px solid rgba(79,140,255,0.15)' }}>
        <div className="text-3xl">{
          form.role === 'developer' ? '⌨️' : form.role === 'designer' ? '🎨' :
          form.role === 'doctor' ? '🩺' : form.role === 'student' ? '🎓' : '✦'
        }</div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-ink text-sm truncate">{form.name || 'Your Portfolio'}</p>
          <p className="text-xs text-ink-2">
            {roleLabel[form.role]}
            {form.role === 'developer' ? ` · ${form.skills?.length || 0} skills` : ''}
            {form.role === 'designer' ? ` · ${form.designTools?.length || 0} tools` : ''}
            {usesThemePicker && themeMeta ? ` · ${themeMeta.name} theme` : ''}
            {usesThemePicker ? ` · ${(form.projects || []).filter((p) => p.title?.trim()).length} projects` : ''}
          </p>
        </div>
        <button type="button" onClick={() => setStep(usesThemePicker ? 5 : 1)}
          className="text-xs text-accent-2 hover:text-accent transition underline underline-offset-2 shrink-0">
          Edit
        </button>
      </div>

      <div className="flex flex-col gap-4">

        {usesThemePicker && themeMeta && (
          <div className="card-surface rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl shrink-0"
              style={{ background: `linear-gradient(135deg, ${themeMeta.colors[0]}, ${themeMeta.colors[1]})` }} />
            <div className="flex-1">
              <p className="text-sm font-semibold text-ink">{themeMeta.name}</p>
              <p className="text-xs text-ink-2">{themeMeta.description}</p>
            </div>
            <button type="button" onClick={() => setStep(5)} className="btn-ghost text-xs px-3 py-2">
              Change
            </button>
          </div>
        )}

        {!usesThemePicker && (
          <div className="card-surface rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Palette size={16} className="text-violet-forge" />
              <p className="text-sm font-semibold text-ink">Style Preference</p>
            </div>
            <Select
              label="Color & style"
              options={THEMES}
              value={form.themePreference}
              onChange={u('themePreference')}
            />
          </div>
        )}

        <div className="rounded-2xl p-5"
          style={{ background: 'rgba(167,139,250,0.05)', border: '1px solid rgba(167,139,250,0.18)' }}>
          <div className="flex items-center gap-2 mb-1">
            <Shield size={16} className="text-violet-forge" />
            <p className="text-sm font-semibold" style={{ color: '#c4b5fd' }}>Admin Panel Access</p>
          </div>
          <p className="text-xs text-ink-3 mb-4">
            These credentials unlock the admin panel in your generated portfolio to manage projects after deployment.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Admin Username" placeholder="admin" value={form.adminUser} onChange={u('adminUser')} />
            <PasswordInput label="Admin Password *" placeholder="Create a strong password"
              value={form.adminPass} onChange={u('adminPass')}
              hint="Min 6 characters. Required to access your portfolio admin." />
          </div>
          <Alert type="warning" className="mt-3">
            <span className="text-xs">Save these credentials — they are embedded in your portfolio and ZIP README.</span>
          </Alert>
        </div>
      </div>

      <div className="mt-8 rounded-3xl p-6 text-center"
        style={{ background: 'linear-gradient(135deg, rgba(79,140,255,0.08), rgba(167,139,250,0.08))', border: '1px solid rgba(79,140,255,0.2)' }}>
        <p className="text-sm text-ink-2 mb-4">
          {usesThemePicker
            ? `Ready to build with the ${themeMeta?.name || 'selected'} theme?`
            : 'Everything looks good? Let\'s build your portfolio.'}
        </p>
        <button type="button" onClick={handleGenerate}
          className="btn-primary px-8 py-4 text-base gap-2 rounded-2xl"
          style={{ boxShadow: '0 0 40px rgba(79,140,255,0.3)' }}>
          <Sparkles size={18} /> Generate My Portfolio
        </button>
      </div>

      <div className="flex justify-start mt-5">
        <button type="button" onClick={() => setStep(usesThemePicker ? 5 : 3)} className="btn-ghost px-6 py-3 gap-2">
          <ChevronLeft size={16} /> Back
        </button>
      </div>
    </div>
  )
}
