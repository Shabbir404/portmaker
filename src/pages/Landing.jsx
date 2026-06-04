import { useApp } from '../context/AppContext'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Zap, Shield, Download, Globe, Check,
  Code2, Palette, Stethoscope, GraduationCap, Sparkles,
} from 'lucide-react'
import DeviceShowcase from '../components/DeviceShowcase'
import Footer from '../components/Footer'

const FEATURES = [
  { icon: Zap, title: 'Instant generation', desc: 'Pick a template, fill your details — live portfolio in under 60 seconds.', color: 'from-blue-500/20 to-cyan-500/10', iconColor: 'text-blue-400' },
  { icon: Shield, title: 'Admin panel', desc: 'Update projects and content from a beautiful private dashboard.', color: 'from-violet-500/20 to-purple-500/10', iconColor: 'text-violet-400' },
  { icon: Download, title: 'Own your code', desc: 'Download full source as ZIP. No lock-in, host anywhere.', color: 'from-emerald-500/20 to-teal-500/10', iconColor: 'text-emerald-400' },
  { icon: Globe, title: 'One-click deploy', desc: 'Publish to Vercel instantly with your own subdomain.', color: 'from-amber-500/20 to-orange-500/10', iconColor: 'text-amber-400' },
]

const ROLES = [
  { icon: Code2, label: 'Developer', count: '7', color: '#60a5fa' },
  { icon: Palette, label: 'Designer', count: '6', color: '#c084fc' },
  { icon: Stethoscope, label: 'Doctor', count: '2', color: '#34d399' },
  { icon: GraduationCap, label: 'Student', count: '3', color: '#a78bfa' },
  { icon: Sparkles, label: 'Other', count: '2', color: '#fbbf24' },
]

const STEPS = [
  { num: '01', title: 'Choose your role', desc: 'Developer, designer, doctor, student — templates tuned for you.' },
  { num: '02', title: 'Fill your story', desc: 'Projects, skills, socials — guided step-by-step builder.' },
  { num: '03', title: 'Go live', desc: 'Preview, export source, or deploy with one click.' },
]

export default function Landing() {
  const { setModal } = useApp()

  return (
    <div className="min-h-screen pt-16 overflow-x-hidden page-mesh">
      <AmbientBackground />

      {/* Hero */}
      <section className="relative landing-section !pt-10 sm:!pt-14 lg:!pt-16 !pb-12">
        <div className="landing-container">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="landing-badge landing-badge--glow mb-6 animate-fade-up">
              <span className="status-dot w-1.5 h-1.5 shrink-0" />
              20 templates · Free to start · Deploy in seconds
            </span>

            <h1 className="type-display font-bold tracking-tightest leading-[1.08] mb-6 animate-fade-up text-[clamp(2.25rem,6vw,4rem)]">
              <span className="text-ink">Build a portfolio</span>
              <br />
              <span className="text-gradient-brand">that gets you hired</span>
            </h1>

            <p className="text-base sm:text-lg text-ink-2 max-w-xl mx-auto mb-8 leading-relaxed animate-fade-up">
              Stunning, responsive portfolios with admin panel and deploy-ready code —
              crafted for developers, designers, and professionals.
            </p>

            <div className="flex flex-col xs:flex-row items-stretch xs:items-center justify-center gap-3 mb-8 animate-fade-up">
              <button onClick={() => setModal('signup')} className="btn-gradient px-7 py-3.5 text-sm sm:text-base min-h-[48px] w-full xs:w-auto">
                Start building free
                <ArrowRight size={18} />
              </button>
              <a href="#preview" className="btn-glass px-7 py-3.5 text-sm sm:text-base min-h-[48px] w-full xs:w-auto">
                See live preview
              </a>
            </div>

            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[13px] text-ink-3">
              {['No credit card', 'Full source code', 'Mobile · Tablet · Desktop'].map((item) => (
                <span key={item} className="inline-flex items-center gap-2">
                  <Check size={14} className="text-emerald-forge shrink-0" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="animate-fade-up max-w-5xl mx-auto">
            <DeviceShowcase url="portfolioforge.app/your-name" />
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="landing-section-sm">
        <div className="landing-container">
          <p className="text-center text-xs font-semibold text-ink-3 uppercase tracking-[0.15em] mb-8">
            Templates for every profession
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {ROLES.map((r) => {
              const Icon = r.icon
              return (
                <div
                  key={r.label}
                  className="role-pill group"
                  style={{ '--role-color': r.color }}
                >
                  <span
                    className="role-pill__icon"
                    style={{ background: `${r.color}18`, borderColor: `${r.color}35`, color: r.color }}
                  >
                    <Icon size={16} />
                  </span>
                  <span className="font-medium text-ink">{r.label}</span>
                  <span className="text-xs text-ink-3">{r.count} templates</span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="landing-section-sm scroll-mt-24">
        <div className="landing-container">
          <SectionHeader
            eyebrow="How it works"
            title="Three steps to a live portfolio"
            sub="No design skills. No boilerplate. Just your story — beautifully presented."
          />
          <div className="grid md:grid-cols-3 gap-5">
            {STEPS.map((step, i) => (
              <div key={step.num} className="step-card hover-lift" style={{ animationDelay: `${i * 80}ms` }}>
                <span className="step-card__num">{step.num}</span>
                <h3 className="type-display font-semibold text-lg text-ink mb-2">{step.title}</h3>
                <p className="text-sm text-ink-2 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="landing-section-sm scroll-mt-24">
        <div className="landing-container">
          <SectionHeader
            eyebrow="Features"
            title="Everything you need to stand out"
            sub="Professional tools without the professional price tag."
          />
          <div className="grid sm:grid-cols-2 gap-5">
            {FEATURES.map((f) => {
              const Icon = f.icon
              return (
                <div key={f.title} className={`feature-card hover-lift bg-gradient-to-br ${f.color}`}>
                  <div className={`feature-card__icon ${f.iconColor}`}>
                    <Icon size={20} strokeWidth={1.75} />
                  </div>
                  <h3 className="type-display font-semibold text-base text-ink mb-2">{f.title}</h3>
                  <p className="text-sm text-ink-2 leading-relaxed">{f.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="landing-section-sm">
        <div className="landing-container">
          <div className="stats-bar">
            {[
              { value: '20+', label: 'Templates', grad: 'from-blue-400 to-cyan-400' },
              { value: '<60s', label: 'Build time', grad: 'from-violet-400 to-purple-400' },
              { value: '100%', label: 'Responsive', grad: 'from-emerald-400 to-teal-400' },
              { value: '$0', label: 'To start', grad: 'from-amber-400 to-orange-400' },
            ].map((s) => (
              <div key={s.label} className="stats-bar__item hover-lift">
                <p className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r ${s.grad} bg-clip-text text-transparent`}>
                  {s.value}
                </p>
                <p className="text-xs text-ink-3 uppercase tracking-wider mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Preview / Example output */}
      <section id="preview" className="landing-section scroll-mt-24">
        <div className="landing-container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <span className="section-eyebrow">Example output</span>
              <h2 className="type-display text-2xl sm:text-3xl lg:text-4xl font-bold text-ink mb-4 tracking-tight">
                Pixel-perfect on{' '}
                <span className="text-gradient-brand">every device</span>
              </h2>
              <p className="text-sm sm:text-base text-ink-2 leading-relaxed mb-8">
                Switch between desktop, tablet, and mobile views. Every template adapts with
                glass-smooth layouts recruiters love.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  { title: 'Desktop', desc: 'Full project grids & rich hero sections' },
                  { title: 'Tablet', desc: 'Balanced two-column layouts' },
                  { title: 'Mobile', desc: 'Thumb-friendly navigation & cards' },
                ].map((item) => (
                  <li key={item.title} className="preview-benefit group">
                    <span className="preview-benefit__dot" />
                    <div>
                      <p className="text-sm font-semibold text-ink group-hover:text-blue-300 transition-colors">{item.title}</p>
                      <p className="text-xs text-ink-3">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col xs:flex-row gap-3">
                <button onClick={() => setModal('signup')} className="btn-gradient px-6 py-3 min-h-[44px]">
                  Create yours
                  <ArrowRight size={16} />
                </button>
                <Link to="/pricing" className="btn-glass px-6 py-3 min-h-[44px] text-center">
                  View pricing
                </Link>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <DeviceShowcase url="portfolioforge.app/alex" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="landing-section-sm">
        <div className="landing-container max-w-3xl">
          <div className="cta-panel hover-lift">
            <div className="cta-panel__glow" aria-hidden="true" />
            <h2 className="type-display text-2xl sm:text-3xl font-bold text-ink mb-3 relative">
              Ready to launch your career?
            </h2>
            <p className="text-ink-2 mb-8 max-w-md mx-auto relative">
              Join thousands of creators who ship portfolios with PortfolioForge.
            </p>
            <button onClick={() => setModal('signup')} className="btn-gradient px-8 py-3.5 relative">
              Get started — it&apos;s free
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

function SectionHeader({ eyebrow, title, sub }) {
  return (
    <div className="text-center mb-12 sm:mb-14">
      <span className="section-eyebrow block mb-3">{eyebrow}</span>
      <h2 className="type-display text-2xl sm:text-3xl font-bold text-ink mb-3 tracking-tight">{title}</h2>
      <p className="text-sm sm:text-base text-ink-2 max-w-lg mx-auto">{sub}</p>
    </div>
  )
}

function AmbientBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10" aria-hidden="true">
      <div className="ambient-orb ambient-orb--blue" />
      <div className="ambient-orb ambient-orb--violet" />
      <div className="ambient-orb ambient-orb--cyan" />
    </div>
  )
}
