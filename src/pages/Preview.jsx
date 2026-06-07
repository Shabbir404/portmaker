import { useState } from 'react'
import { useBuilder } from '../context/BuilderContext'
import { useApp } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { Monitor, Tablet, Smartphone, Download, Rocket, ArrowLeft, RotateCcw, ExternalLink } from 'lucide-react'
import { Modal, Alert, Spinner } from '../components/UI'
import { getThemeById } from '../templates/registry'
import JSZip from 'jszip'

const SIZES = [
  { id: 'desktop', label: 'Desktop', icon: Monitor, width: '100%', frameW: null },
  { id: 'tablet',  label: 'Tablet',  icon: Tablet,  width: '768px', frameW: 768 },
  { id: 'mobile',  label: 'Mobile',  icon: Smartphone, width: '390px', frameW: 390 },
]

export default function Preview() {
  const { generatedHTML, isGenerating, form, reset, setStep } = useBuilder()
  const { addToast } = useApp()
  const navigate = useNavigate()
  const [size, setSize] = useState('desktop')
  const [showHostModal, setShowHostModal] = useState(false)
  const [downloading, setDownloading] = useState(false)

  /* ── Generating state ── */
  if (isGenerating) return <GeneratingScreen />

  /* ── No HTML yet ── */
  if (!generatedHTML) return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4 px-6">
      <div className="text-5xl">🫙</div>
      <h2 className="font-syne text-2xl font-bold text-ink">Nothing to preview yet</h2>
      <p className="text-ink-2 text-sm">Complete the builder to generate your portfolio.</p>
      <button onClick={() => navigate('/builder')} className="btn-primary px-6 py-3 gap-2 mt-2">
        <ArrowLeft size={15} /> Go to Builder
      </button>
    </div>
  )

  /* ── Download ZIP ── */
  const handleDownload = async () => {
    setDownloading(true)
    try {
      const zip = new JSZip()
      zip.file('index.html', generatedHTML)
      zip.file('README.md', buildReadme(form))
      zip.file('.env.example', `ADMIN_USERNAME=${form.adminUser || 'admin'}\nADMIN_PASSWORD=your_password_here\n`)
      const blob = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${(form.name || 'portfolio').replace(/\s+/g, '-').toLowerCase()}-portfolio.zip`
      document.body.appendChild(a); a.click(); a.remove()
      URL.revokeObjectURL(url)
      addToast('ZIP downloaded! Check your README for deploy steps.', 'success')
    } catch (e) {
      addToast('Download failed: ' + e.message, 'error')
    }
    setDownloading(false)
  }

  const currentSize = SIZES.find(s => s.id === size)

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 md:px-8">
      {/* Toolbar */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-5 pt-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/builder')} className="btn-ghost px-3 py-2 gap-1.5 text-sm">
              <ArrowLeft size={14} /> Edit
            </button>
            <div>
              <h2 className="font-syne font-bold text-ink text-lg leading-tight">
                {form.name || 'Portfolio'} Preview
              </h2>
              <p className="text-xs text-ink-3 capitalize">
                {form.role}
                {form.role === 'developer' && form.selectedTheme
                  ? ` · ${getThemeById('developer', form.selectedTheme)?.name || form.selectedTheme} theme`
                  : form.themePreference ? ` · ${form.themePreference} theme` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Size toggle */}
            <div className="flex p-1 rounded-xl gap-0.5"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {SIZES.map(s => (
                <button key={s.id} onClick={() => setSize(s.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    size === s.id ? 'bg-white/[0.08] text-ink' : 'text-ink-3 hover:text-ink-2'
                  }`}>
                  <s.icon size={13} />
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
              ))}
            </div>

            <button onClick={handleDownload} disabled={downloading}
              className="btn-ghost px-4 py-2.5 text-sm gap-1.5">
              {downloading ? <Spinner size={14} /> : <Download size={14} />}
              ZIP
            </button>
            <button onClick={() => setShowHostModal(true)}
              className="btn-green px-4 py-2.5 text-sm gap-1.5">
              <Rocket size={14} /> Deploy Free
            </button>
          </div>
        </div>

        {/* Frame wrapper */}
        <div className="relative transition-all duration-300"
          style={{ maxWidth: currentSize.frameW ? `${currentSize.frameW}px` : '100%', margin: '0 auto' }}>

          {/* Device chrome for mobile/tablet */}
          {size !== 'desktop' && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-1 rounded-full bg-white/10" />
          )}

          <div className="overflow-hidden transition-all duration-300"
            style={{
              borderRadius: size === 'mobile' ? '28px' : size === 'tablet' ? '20px' : '14px',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
              ...(size !== 'desktop' ? { border: '6px solid rgba(255,255,255,0.08)' } : {}),
            }}>
            <iframe
              srcDoc={generatedHTML}
              sandbox="allow-scripts allow-same-origin"
              className="w-full block transition-all duration-300"
              style={{ height: size === 'mobile' ? '780px' : '700px', background: '#060b14' }}
            />
          </div>
        </div>

        {/* Bottom actions */}
        <div className="flex items-center justify-center gap-4 mt-8 flex-wrap">
          <button onClick={() => { reset(); navigate('/builder') }}
            className="btn-ghost px-5 py-2.5 text-sm gap-2">
            <RotateCcw size={14} /> Build Another
          </button>
          <button onClick={() => navigate('/dashboard')}
            className="btn-ghost px-5 py-2.5 text-sm gap-2">
            Dashboard
          </button>
          <button onClick={handleDownload}
            className="btn-primary px-6 py-2.5 text-sm gap-2">
            <Download size={14} /> Download ZIP
          </button>
          <button onClick={() => setShowHostModal(true)}
            className="btn-green px-6 py-2.5 text-sm gap-2">
            <Rocket size={14} /> Deploy to Vercel
          </button>
        </div>
      </div>

      {/* Deploy modal */}
      {showHostModal && <HostModal form={form} onClose={() => setShowHostModal(false)} onDownload={handleDownload} />}
    </div>
  )
}

/* ── Generating screen ── */
function GeneratingScreen() {
  const genSteps = [
    'Analysing your profile data...',
    'Selecting the best matching template...',
    'Injecting your details into the template...',
    'Building responsive layout...',
    'Setting up admin panel...',
    'Final polish & optimisation...',
  ]
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-sm w-full">
        {/* Animated rings */}
        <div className="relative w-20 h-20 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full border-2 border-accent/20 animate-ping" />
          <div className="absolute inset-2 rounded-full border-2 border-t-accent border-white/10 animate-spin" />
          <div className="absolute inset-5 rounded-full bg-accent/10 flex items-center justify-center">
            <span className="text-accent text-lg">⚡</span>
          </div>
        </div>

        <h2 className="font-syne text-2xl font-bold text-ink mb-2">Generating your portfolio</h2>
        <p className="text-ink-2 text-sm mb-8">Crafting something beautiful just for you...</p>

        <div className="flex flex-col gap-2.5 text-left">
          {genSteps.map((s, i) => (
            <div key={i} className="flex items-center gap-3 text-sm text-ink-2 animate-fade-up"
              style={{ animationDelay: `${i * 0.25}s`, opacity: 0, animationFillMode: 'forwards' }}>
              <div className="w-5 h-5 rounded-full border border-white/10 flex items-center justify-center text-xs flex-shrink-0 text-ink-3">
                {i + 1}
              </div>
              {s}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Host Modal ── */
function HostModal({ form, onClose, onDownload }) {
  const slug = `${(form.name || 'portfolio').replace(/\s+/g, '-').toLowerCase()}-${Math.random().toString(36).slice(2, 6)}`

  return (
    <Modal onClose={onClose} width="max-w-lg">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-syne text-xl font-bold text-ink flex items-center gap-2">
          <Rocket size={18} className="text-emerald-forge" /> Deploy to Vercel
        </h2>
        <button onClick={onClose} className="text-ink-3 hover:text-ink transition text-xl leading-none">×</button>
      </div>
      <p className="text-sm text-ink-2 mb-5">
        Host your portfolio on a free Vercel subdomain. Live in under 2 minutes.
      </p>

      <Alert type="info">
        <span className="text-xs">
          🚀 <strong>Full auto-deploy</strong> is coming in Phase 6. For now, follow these steps — it's just 3 clicks.
        </span>
      </Alert>

      <div className="flex flex-col gap-3 my-5">
        {[
          { n: 1, text: 'Click "Download ZIP" below to get your portfolio source code.' },
          { n: 2, text: <span>Go to <a href="https://vercel.com/new" target="_blank" rel="noreferrer" className="text-accent underline">vercel.com/new</a> and sign in with GitHub (free).</span> },
          { n: 3, text: 'Drag & drop your unzipped folder onto the Vercel dashboard. No config needed.' },
          { n: 4, text: 'Your portfolio goes live instantly at your unique Vercel URL!' },
        ].map(step => (
          <div key={step.n} className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5"
              style={{ background: '#22d3a0' }}>
              {step.n}
            </div>
            <p className="text-sm text-ink-2 leading-relaxed">{step.text}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl px-4 py-3 mb-5 font-mono text-sm"
        style={{ background: 'rgba(34,211,160,0.06)', border: '1px solid rgba(34,211,160,0.15)', color: '#22d3a0' }}>
        https://{slug}.vercel.app
      </div>

      <div className="flex gap-3">
        <button onClick={() => { onDownload(); onClose() }}
          className="btn-primary flex-1 justify-center gap-2 py-3">
          <Download size={15} /> Download ZIP
        </button>
        <a href="https://vercel.com/new" target="_blank" rel="noreferrer"
          className="btn-ghost flex items-center gap-2 px-4 py-3 text-sm">
          Open Vercel <ExternalLink size={13} />
        </a>
      </div>
    </Modal>
  )
}

/* ── README content ── */
function buildReadme(form) {
  return `# ${form.name || 'My Portfolio'} — PortfolioForge

## Quick Start

No build step required. Open \`index.html\` directly in your browser.

\`\`\`bash
# Option 1: Use a local server
npx serve .
# Then visit http://localhost:3000

# Option 2: Just open the file
open index.html
\`\`\`

---

## Deploy to Netlify (Free)

### Drag & Drop (Easiest)
1. Go to https://netlify.com and sign in
2. Drag this entire folder onto the Netlify drop zone
3. Done! Your site is live 🎉

### Netlify CLI
\`\`\`bash
npm install -g netlify-cli
netlify login
netlify deploy --dir . --prod
\`\`\`

---

## Deploy to Vercel (Free)

### Drag & Drop
1. Go to https://vercel.com/new
2. Drag your folder onto the page
3. Click Deploy — no config needed

### Vercel CLI
\`\`\`bash
npm install -g vercel
vercel --prod
\`\`\`

---

## Admin Panel

Access your portfolio's admin panel to add/manage projects:

**URL:** \`your-site-url/?admin=1\`

**Credentials:**
- Username: \`${form.adminUser || 'admin'}\`
- Password: *(the password you set during generation)*

> Store these safely. To change them, edit the \`ADMIN_USER\` and \`ADMIN_PASS\` constants in \`index.html\`.

---

## Customization

Edit \`index.html\` to:
- Change colors (search for CSS custom properties or Tailwind classes)
- Update placeholder text
- Replace placeholder images with real ones
- Add/remove sections

---

*Generated by [PortfolioForge](https://portfolioforge.app)*
`
}
