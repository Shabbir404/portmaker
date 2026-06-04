import { useApp } from '../context/AppContext'
import {
  ArrowRight, Zap, Shield, Download, Globe, Check,
  Code2, Palette, Stethoscope, GraduationCap, Sparkles,
} from 'lucide-react'

const FEATURES = [
  {
    icon: Zap,
    title: 'Instant generation',
    desc: 'Choose a template, add your details, and publish a complete portfolio in under a minute.',
  },
  {
    icon: Shield,
    title: 'Admin panel included',
    desc: 'Manage projects and content from a private dashboard — no code required.',
  },
  {
    icon: Download,
    title: 'Full source ownership',
    desc: 'Export everything as a ZIP. Host anywhere, modify freely, no vendor lock-in.',
  },
  {
    icon: Globe,
    title: 'One-click deploy',
    desc: 'Go live on Vercel instantly with your own subdomain. Free tier supported.',
  },
]

const ROLES = [
  { icon: Code2, label: 'Developer', count: '7 templates' },
  { icon: Palette, label: 'Designer', count: '6 templates' },
  { icon: Stethoscope, label: 'Doctor', count: '2 templates' },
  { icon: GraduationCap, label: 'Student', count: '3 templates' },
  { icon: Sparkles, label: 'Other', count: '2 templates' },
]

const STEPS = [
  { num: '1', title: 'Select your role', desc: 'Pick from profession-specific templates built for your field.' },
  { num: '2', title: 'Add your content', desc: 'Fill in projects, skills, and links through a guided builder.' },
  { num: '3', title: 'Publish instantly', desc: 'Preview, download source code, or deploy live in one click.' },
]

const TRUST = ['No credit card required', 'Responsive on all devices', 'Export full source code']

export default function Landing() {
  const { setModal } = useApp()

  const scrollToDemo = () => {
    document.getElementById('preview')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="min-h-screen pt-16 overflow-x-hidden bg-bg">
      {/* Subtle top glow */}
      <div className="fixed inset-x-0 top-0 h-[480px] pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 70% 60% at 50% -10%, rgba(255,255,255,0.04), transparent)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      {/* Hero */}
      <section className="relative landing-section !pt-12 sm:!pt-16 lg:!pt-20 !pb-16 sm:!pb-20">
        <div className="landing-container">
          <div className="max-w-3xl mx-auto text-center">
            <div className="landing-badge mb-8 animate-fade-up">
              <span className="w-1.5 h-1.5 rounded-full status-dot shrink-0" />
              20 templates · Free to start
            </div>

            <h1 className="type-display font-bold tracking-tightest leading-[1.1] mb-6 animate-fade-up text-[clamp(2rem,5.5vw,3.75rem)] text-ink">
              Build a portfolio
              <br />
              <span className="text-ink-2">that gets you hired.</span>
            </h1>

            <p className="text-base sm:text-lg text-ink-2 max-w-xl mx-auto mb-10 leading-relaxed animate-fade-up">
              PortfolioForge turns your experience into a polished, responsive portfolio —
              complete with admin panel and deploy-ready code.
            </p>

            <div className="flex flex-col xs:flex-row items-stretch xs:items-center justify-center gap-3 mb-10 animate-fade-up">
              <button
                onClick={() => setModal('signup')}
                className="btn-primary px-6 py-3 text-sm sm:text-[15px] min-h-[44px] w-full xs:w-auto"
              >
                Start for free
                <ArrowRight size={16} strokeWidth={2.5} />
              </button>
              <button
                onClick={scrollToDemo}
                className="btn-ghost px-6 py-3 text-sm sm:text-[15px] min-h-[44px] w-full xs:w-auto"
              >
                View example
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {TRUST.map(item => (
                <span key={item} className="inline-flex items-center gap-2 text-[13px] text-ink-3">
                  <Check size={14} className="text-ink-3 shrink-0" strokeWidth={2} />
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Preview mockup */}
          <div className="relative mt-16 sm:mt-20 lg:mt-24 max-w-4xl mx-auto animate-fade-up">
            <div className="absolute inset-0 -z-10 rounded-2xl shadow-preview-glow pointer-events-none" aria-hidden="true" />
            <PreviewFrame />
          </div>
        </div>
      </section>

      <div className="landing-container"><div className="landing-divider" /></div>

      {/* Roles */}
      <section className="relative landing-section-sm">
        <div className="landing-container">
          <p className="text-center text-[13px] font-medium text-ink-3 uppercase tracking-[0.12em] mb-8">
            Templates for every profession
          </p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {ROLES.map(r => {
              const Icon = r.icon
              return (
                <div
                  key={r.label}
                  className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm text-ink-2 transition-colors hover:text-ink hover:bg-white/[0.03]"
                  style={{ border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <Icon size={15} strokeWidth={1.75} className="text-ink-3" />
                  <span className="font-medium text-ink">{r.label}</span>
                  <span className="text-xs text-ink-3 hidden sm:inline">{r.count}</span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <div className="landing-container"><div className="landing-divider" /></div>

      {/* How it works */}
      <section className="relative landing-section-sm">
        <div className="landing-container">
          <div className="text-center mb-12 sm:mb-14">
            <h2 className="type-display text-2xl sm:text-3xl font-semibold tracking-tight text-ink mb-3">
              How it works
            </h2>
            <p className="text-sm sm:text-base text-ink-2 max-w-md mx-auto">
              Three steps from blank canvas to live portfolio.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-px rounded-xl overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {STEPS.map(step => (
              <div key={step.num} className="bg-bg p-6 sm:p-8">
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-md text-xs font-semibold text-ink-2 mb-5"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {step.num}
                </span>
                <h3 className="type-display font-semibold text-[15px] sm:text-base text-ink mb-2">{step.title}</h3>
                <p className="text-sm text-ink-2 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative landing-section-sm">
        <div className="landing-container">
          <div className="text-center mb-12 sm:mb-14">
            <h2 className="type-display text-2xl sm:text-3xl font-semibold tracking-tight text-ink mb-3">
              Built for professionals
            </h2>
            <p className="text-sm sm:text-base text-ink-2 max-w-md mx-auto">
              Everything you need to launch, manage, and own your portfolio.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
            {FEATURES.map(f => {
              const Icon = f.icon
              return (
                <div
                  key={f.title}
                  className="group flex gap-4 sm:gap-5 p-5 sm:p-6 rounded-xl transition-colors hover:bg-white/[0.02]"
                  style={{ border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-ink-2 group-hover:text-ink transition-colors"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <Icon size={18} strokeWidth={1.75} />
                  </div>
                  <div>
                    <h3 className="type-display font-semibold text-[15px] text-ink mb-1.5">{f.title}</h3>
                    <p className="text-sm text-ink-2 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="relative landing-section-sm">
        <div className="landing-container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px rounded-xl overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {[
              { value: '20+', label: 'Templates' },
              { value: '< 60s', label: 'Average build' },
              { value: '100%', label: 'Responsive' },
              { value: '$0', label: 'To get started' },
            ].map(s => (
              <div key={s.label} className="bg-bg px-6 py-8 sm:py-10 text-center">
                <p className="type-display text-2xl sm:text-3xl font-semibold text-ink tracking-tight mb-1">{s.value}</p>
                <p className="text-xs text-ink-3 uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Preview section */}
      <section id="preview" className="relative landing-section scroll-mt-20">
        <div className="landing-container">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <p className="text-[13px] font-medium text-ink-3 uppercase tracking-[0.12em] mb-4">Example output</p>
              <h2 className="type-display text-2xl sm:text-3xl font-semibold tracking-tight text-ink mb-4">
                Clean layouts, out of the box
              </h2>
              <p className="text-sm sm:text-base text-ink-2 leading-relaxed mb-8">
                Every template is designed with proper typography, spacing, and responsive breakpoints —
                so your portfolio looks sharp on any screen.
              </p>
              <ul className="space-y-3 mb-8">
                {['Mobile-first responsive design', 'Accessible color contrast', 'Optimized for recruiters'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm text-ink-2">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <Check size={11} strokeWidth={2.5} className="text-ink" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setModal('signup')}
                className="btn-primary px-6 py-3 text-sm min-h-[44px]"
              >
                Create yours
                <ArrowRight size={16} strokeWidth={2.5} />
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 -z-10 rounded-2xl shadow-preview-glow pointer-events-none" aria-hidden="true" />
              <PreviewFrame variant="compact" url="portfolioforge.app/alex" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative landing-section-sm !pb-20 sm:!pb-24">
        <div className="landing-container max-w-2xl">
          <div className="text-center px-6 sm:px-10 py-12 sm:py-14 rounded-xl"
            style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}>
            <h2 className="type-display text-2xl sm:text-3xl font-semibold tracking-tight text-ink mb-3">
              Ready to launch?
            </h2>
            <p className="text-sm sm:text-base text-ink-2 mb-8 max-w-sm mx-auto">
              Create your portfolio today. No design experience needed.
            </p>
            <button
              onClick={() => setModal('signup')}
              className="btn-primary px-8 py-3 text-sm sm:text-[15px] min-h-[44px]"
            >
              Get started free
              <ArrowRight size={16} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="landing-container py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="type-display text-sm font-semibold text-ink">
              Portfolio<span className="text-ink-3">Forge</span>
            </p>
            <p className="text-xs text-ink-3">
              © {new Date().getFullYear()} PortfolioForge
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function PreviewChrome({ url }) {
  return (
    <div className="preview-chrome px-4 py-3 flex items-center gap-3">
      <div className="flex gap-1.5 shrink-0">
        <span className="w-2.5 h-2.5 rounded-full bg-zinc-600" />
        <span className="w-2.5 h-2.5 rounded-full bg-zinc-600" />
        <span className="w-2.5 h-2.5 rounded-full bg-zinc-600" />
      </div>
      <div className="flex-1 h-7 rounded-md preview-surface flex items-center px-3 min-w-0">
        {url ? (
          <span className="text-[11px] text-ink-3 font-mono truncate">{url}</span>
        ) : null}
      </div>
    </div>
  )
}

function PreviewFrame({ variant = 'hero', url }) {
  if (variant === 'compact') {
    return (
      <div className="preview-frame rounded-xl overflow-hidden">
        <PreviewChrome url={url} />
        <div className="p-6 sm:p-8 bg-bg-2">
          <div className="mb-6">
            <p className="text-xs text-ink-3 mb-2 font-mono">Full-Stack Developer</p>
            <h3 className="type-display text-xl sm:text-2xl font-semibold text-ink mb-2">Alex Johnson</h3>
            <p className="text-sm text-ink-2 leading-relaxed max-w-sm">
              Building scalable web applications with React, Node.js, and PostgreSQL.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 mb-8">
            {['React', 'TypeScript', 'Node.js'].map(tag => (
              <span key={tag} className="text-xs px-2.5 py-1 rounded-md text-ink-2 font-medium preview-surface">
                {tag}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            {['SaaS Dashboard', 'API Platform'].map(title => (
              <div key={title} className="rounded-lg overflow-hidden preview-surface">
                <div className="h-16 sm:h-20 preview-placeholder" />
                <div className="p-3 border-t border-white/[0.06]">
                  <p className="text-xs font-medium text-ink">{title}</p>
                  <p className="text-[11px] text-ink-3 mt-0.5">2024</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="preview-frame rounded-xl overflow-hidden">
      <PreviewChrome />
      <div className="p-8 sm:p-12 lg:p-16 text-center bg-bg-2">
        <p className="text-xs text-ink-3 uppercase tracking-widest mb-4 font-medium">Portfolio Preview</p>
        <h3 className="type-display text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-ink mb-3">
          Your name here
        </h3>
        <p className="text-sm sm:text-base text-ink-2 max-w-md mx-auto mb-8 leading-relaxed">
          A clean, professional layout that puts your work front and center.
        </p>
        <div className="flex justify-center gap-2 sm:gap-3 mb-10">
          {['Project One', 'Project Two', 'Project Three'].map(p => (
            <div
              key={p}
              className="w-24 sm:w-32 h-20 sm:h-24 rounded-lg preview-placeholder flex items-end p-2"
            >
              <span className="text-[10px] text-ink-3 font-medium truncate w-full text-left">{p}</span>
            </div>
          ))}
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs text-ink-2 preview-surface">
          <span className="w-1.5 h-1.5 rounded-full status-dot shrink-0" />
          Responsive · Deploy-ready · Yours to keep
        </div>
      </div>
    </div>
  )
}
