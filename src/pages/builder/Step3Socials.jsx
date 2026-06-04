import { useState } from 'react'
import { useBuilder, SOCIAL_PRESETS } from '../../context/BuilderContext'
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react'

function avatarColor(str) {
  const colors = ['#4f8cff','#f472b6','#22d3a0','#a78bfa','#fbbf24','#fb923c','#34d399','#60a5fa']
  let h = 0; for (let c of str) h = (h * 31 + c.charCodeAt(0)) % colors.length
  return colors[h]
}

export default function Step3Socials() {
  const {
    form, toggleSocial, setSocialUrl, addCustomSocial, removeCustomSocial, setStep,
  } = useBuilder()

  const [customName, setCustomName] = useState('')
  const [customUrl, setCustomUrl] = useState('')

  const presets = SOCIAL_PRESETS[form.role] || SOCIAL_PRESETS.other

  const handleAddCustom = () => {
    if (!customName.trim() || !customUrl.trim()) return
    addCustomSocial(customName.trim(), customUrl.trim())
    setCustomName('')
    setCustomUrl('')
  }

  return (
    <div className="animate-fade-up">
      <div className="mb-8">
        <p className="text-xs font-mono text-accent-2 mb-2">// step 3 of 4</p>
        <h2 className="font-syne text-3xl font-bold text-ink">Social & Online Presence</h2>
        <p className="text-ink-2 text-sm mt-2">
          Select the platforms you want shown on your portfolio. All optional.
        </p>
      </div>

      {/* Preset social chips */}
      <div className="card-surface rounded-2xl p-5 mb-4">
        <p className="text-xs font-semibold text-ink-2 uppercase tracking-widest mb-4">
          Suggested for {form.role}
        </p>
        <div className="flex flex-wrap gap-2 mb-5">
          {presets.map(s => {
            const selected = form.selectedSocials.includes(s.id)
            return (
              <button key={s.id} type="button" onClick={() => toggleSocial(s.id)}
                className={`social-chip ${selected ? 'active' : ''}`}>
                <span className="w-6 h-6 rounded-md flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: s.color }}>
                  {s.abbr}
                </span>
                {s.name}
                {selected && <span className="text-accent ml-0.5 text-xs">✓</span>}
              </button>
            )
          })}
        </div>

        {/* URL inputs for selected */}
        {form.selectedSocials.length > 0 && (
          <div className="flex flex-col gap-3 pt-4 border-t border-white/[0.06]">
            <p className="text-xs text-ink-3 font-medium">Enter your profile URLs:</p>
            {form.selectedSocials.map(id => {
              const s = presets.find(p => p.id === id)
              if (!s) return null
              return (
                <div key={id} className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: s.color }}>
                    {s.abbr}
                  </span>
                  <input
                    className="input-field flex-1 py-2 text-sm"
                    placeholder={`Your ${s.name} profile URL`}
                    value={form.socialUrls[id] || ''}
                    onChange={e => setSocialUrl(id, e.target.value)}
                  />
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Custom socials */}
      <div className="card-surface rounded-2xl p-5">
        <p className="text-xs font-semibold text-ink-2 uppercase tracking-widest mb-1">Add Other Platforms</p>
        <p className="text-xs text-ink-3 mb-4">Not in the list above? Add any platform here.</p>

        <div className="flex gap-2 mb-4">
          <input
            className="input-field flex-1 py-2.5 text-sm"
            placeholder="Platform name (e.g. Mastodon, Hashnode)"
            value={customName}
            onChange={e => setCustomName(e.target.value)}
          />
          <input
            className="input-field flex-[1.6] py-2.5 text-sm"
            placeholder="Profile URL"
            value={customUrl}
            onChange={e => setCustomUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddCustom()}
          />
          <button type="button" onClick={handleAddCustom}
            className="btn-ghost px-4 py-2.5 gap-1.5 shrink-0 text-sm">
            <Plus size={14} /> Add
          </button>
        </div>

        {/* Custom list */}
        {form.customSocials.length > 0 && (
          <div className="flex flex-col gap-2">
            {form.customSocials.map((cs, i) => (
              <div key={i} className="flex items-center gap-3 py-2 px-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <span className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: avatarColor(cs.name) }}>
                  {cs.name.substring(0, 2).toUpperCase()}
                </span>
                <span className="font-medium text-sm text-ink flex-shrink-0">{cs.name}</span>
                <span className="text-xs text-ink-3 flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{cs.url}</span>
                <button type="button" onClick={() => removeCustomSocial(i)}
                  className="text-ink-3 hover:text-rose-forge transition p-1 flex-shrink-0">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {form.customSocials.length === 0 && (
          <p className="text-xs text-ink-4 italic">No custom platforms added yet.</p>
        )}
      </div>

      {/* Nav */}
      <div className="flex justify-between mt-8">
        <button onClick={() => setStep(2)} className="btn-ghost px-6 py-3 gap-2">
          <ChevronLeft size={16} /> Back
        </button>
        <button onClick={() => setStep(4)} className="btn-primary px-7 py-3 gap-2">
          Continue <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
