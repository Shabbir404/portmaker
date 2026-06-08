import { useState } from 'react'

import { useBuilder } from '../../context/BuilderContext'

import { getDeveloperThemes, loadDeveloperThemeHtml } from '../../templates/registry'

import { ChevronLeft, ChevronRight, Check, Palette, FolderOpen, Maximize2 } from 'lucide-react'

import FullScreenPreview, { FullScreenPreviewLoading } from '../../components/FullScreenPreview'



export default function Step4Theme() {

  const { form, updateForm, setStep } = useBuilder()

  const themes = getDeveloperThemes()

  const [preview, setPreview] = useState(null)

  const [previewHtml, setPreviewHtml] = useState('')

  const [previewLoading, setPreviewLoading] = useState(false)



  const handleNext = () => {

    if (!form.selectedTheme) return

    setStep(5)

  }



  const closePreview = () => {

    setPreview(null)

    setPreviewHtml('')

    setPreviewLoading(false)

  }



  const openFullPreview = async (e, theme) => {

    e.stopPropagation()

    setPreview(theme)

    setPreviewLoading(true)

    setPreviewHtml('')

    try {

      const html = await loadDeveloperThemeHtml(theme.id)

      setPreviewHtml(html)

    } catch (err) {

      alert(err.message || 'Could not load theme preview')

      closePreview()

    } finally {

      setPreviewLoading(false)

    }

  }



  return (

    <>

      <div className="animate-fade-up">

        <div className="mb-8">

          <p className="text-xs font-mono text-accent-2 mb-2">// step 4 of 5</p>

          <h2 className="font-syne text-3xl font-bold text-ink flex items-center gap-2">

            <Palette size={24} className="text-violet-forge" />

            Select your theme

          </h2>

          <p className="text-ink-2 text-sm mt-2">

            Themes are loaded from <code className="text-accent-2">src/templates/developer/</code> — use{' '}

            <strong className="text-ink">Full preview</strong> to experience each design at full size before you choose.

          </p>

        </div>



        {themes.length === 0 ? (

          <div className="card-surface rounded-2xl p-8 text-center mb-8">

            <FolderOpen size={40} className="mx-auto mb-4 text-ink-3" />

            <h3 className="font-syne font-semibold text-ink mb-2">No themes found</h3>

            <p className="text-sm text-ink-2 max-w-md mx-auto leading-relaxed">

              Add a folder like <code className="text-accent-2">src/templates/developer/dev-3d/your-theme.html</code> — any <code className="text-accent-2">.html</code> file in the folder works.

            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">

            {themes.map((theme) => {

              const selected = form.selectedTheme === theme.id

              const colors = theme.colors || ['#111', '#3b82f6', '#8b5cf6']

              const isLight = theme.mood === 'light'

              const mockText = isLight ? '#52525b' : undefined

              return (

                <button

                  key={theme.id}

                  type="button"

                  onClick={() => updateForm({ selectedTheme: theme.id })}

                  className={`theme-card text-left ${selected ? 'theme-card--selected' : ''}`}

                >

                  <div

                    className="theme-card__preview"

                    style={{

                      background: isLight

                        ? `linear-gradient(135deg, ${colors[0]}, ${colors[2] || colors[1]}18 55%, ${colors[1]}12)`

                        : `linear-gradient(135deg, ${colors[0]}, ${colors[1]}22 50%, ${colors[2] || colors[1]}33)`,

                    }}

                  >

                    <div className="theme-card__mock" style={mockText ? { color: mockText } : undefined}>

                      <div className="theme-card__bar" style={{ background: colors[1] }} />

                      <div className="theme-card__line" style={{ width: '70%', background: colors[2] || colors[1] }} />

                      <div className="theme-card__line theme-card__line--short" />

                      <div className="flex items-center gap-1.5 mt-2">

                        {colors.map((c) => (

                          <span

                            key={c}

                            className="inline-block w-3 h-3 rounded-full border border-black/10"

                            style={{ background: c }}

                            title={c}

                          />

                        ))}

                      </div>

                    </div>

                  </div>

                  <div className="theme-card__body">

                    <div className="flex items-start justify-between gap-2">

                      <div>

                        <div className="flex items-center gap-2 flex-wrap mb-1">

                          <h3 className="font-syne font-semibold text-ink">{theme.name}</h3>

                          <span className="text-[10px] px-2 py-0.5 rounded-md font-medium capitalize"

                            style={{

                              background: isLight ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.05)',

                              border: '1px solid rgba(255,255,255,0.08)',

                              color: isLight ? '#a1a1aa' : '#71717a',

                            }}>

                            {theme.mood}

                          </span>

                        </div>

                        <p className="text-xs text-ink-2 mt-1 leading-relaxed">{theme.description}</p>

                        {theme.fonts?.length > 0 && (

                          <p className="text-[10px] text-ink-3 mt-1.5 font-mono">{theme.fonts.join(' · ')}</p>

                        )}

                      </div>

                      {selected && (

                        <span className="theme-card__check">

                          <Check size={14} strokeWidth={3} />

                        </span>

                      )}

                    </div>

                    {(theme.tags || []).length > 0 && (

                      <div className="flex flex-wrap gap-1.5 mt-3">

                        {theme.tags.map((tag) => (

                          <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md font-medium text-ink-3"

                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>

                            {tag}

                          </span>

                        ))}

                      </div>

                    )}

                    <button

                      type="button"

                      onClick={(e) => openFullPreview(e, theme)}

                      className="mt-4 w-full btn-ghost py-2.5 text-xs gap-2 justify-center border border-white/10 hover:border-white/20"

                    >

                      <Maximize2 size={14} />

                      Full preview

                    </button>

                  </div>

                </button>

              )

            })}

          </div>

        )}



        <div className="flex justify-between">

          <button type="button" onClick={() => setStep(3)} className="btn-ghost px-6 py-3 gap-2">

            <ChevronLeft size={16} /> Back

          </button>

          <button

            type="button"

            onClick={handleNext}

            disabled={!form.selectedTheme}

            className={`btn-primary px-7 py-3 gap-2 ${!form.selectedTheme ? 'opacity-40 cursor-not-allowed' : ''}`}

          >

            Continue <ChevronRight size={16} />

          </button>

        </div>

      </div>



      {preview && previewLoading && (

        <FullScreenPreviewLoading title={`Loading ${preview.name}…`} onClose={closePreview} />

      )}

      {preview && !previewLoading && previewHtml && (

        <FullScreenPreview

          html={previewHtml}

          title={`${preview.name} — theme preview`}

          onClose={closePreview}

        />

      )}

    </>

  )

}


