import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Check, ArrowRight, Sparkles } from 'lucide-react'
import Footer from '../components/Footer'

const PLANS = [
  {
    name: 'Starter',
    price: 'Free',
    period: 'forever',
    desc: 'Perfect for students and first portfolios.',
    featured: false,
    cta: 'Start free',
    features: [
      '3 portfolio templates',
      'Basic admin panel',
      'PortfolioForge subdomain',
      'Source code download',
      'Community support',
    ],
  },
  {
    name: 'Pro',
    price: '$12',
    period: '/month',
    desc: 'For professionals who want to stand out.',
    featured: true,
    cta: 'Go Pro',
    features: [
      'All 20+ templates',
      'Full admin panel',
      'Custom domain',
      'One-click Vercel deploy',
      'Priority support',
      'Remove branding',
    ],
  },
  {
    name: 'Team',
    price: '$39',
    period: '/month',
    desc: 'Agencies and bootcamps building at scale.',
    featured: false,
    cta: 'Contact sales',
    features: [
      'Everything in Pro',
      '5 team seats',
      'Shared template library',
      'Bulk export',
      'Dedicated onboarding',
    ],
  },
]

export default function Pricing() {
  const { setModal } = useApp()

  return (
    <div className="min-h-screen pt-16 overflow-x-hidden page-mesh">
      <section className="landing-section !pt-12 sm:!pt-16">
        <div className="landing-container text-center max-w-2xl mx-auto">
          <span className="landing-badge landing-badge--glow mb-6">
            <Sparkles size={14} className="text-cyan-400" />
            Simple, transparent pricing
          </span>
          <h1 className="type-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-ink mb-4">
            Plans that <span className="text-gradient-brand">grow with you</span>
          </h1>
          <p className="text-base sm:text-lg text-ink-2 leading-relaxed">
            Start free. Upgrade when you need more templates, custom domains, and premium deploy features.
          </p>
        </div>
      </section>

      <section className="landing-section-sm !pt-0">
        <div className="landing-container">
          <div className="grid md:grid-cols-3 gap-5 lg:gap-6 items-stretch">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`pricing-card ${plan.featured ? 'pricing-card--featured' : ''}`}
              >
                {plan.featured && (
                  <span className="pricing-card__badge">Most popular</span>
                )}
                <h3 className="type-display text-xl font-bold text-ink mb-1">{plan.name}</h3>
                <p className="text-sm text-ink-2 mb-6">{plan.desc}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-ink">{plan.price}</span>
                  <span className="text-sm text-ink-3 ml-1">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-ink-2">
                      <Check size={16} className="text-emerald-forge shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => setModal(plan.name === 'Team' ? 'login' : 'signup')}
                  className={plan.featured ? 'btn-gradient w-full py-3' : 'btn-ghost w-full py-3 hover:border-accent/40'}
                >
                  {plan.cta}
                  <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-ink-3 mt-10">
            All plans include responsive templates and instant preview.{' '}
            <Link to="/" className="text-accent-2 hover:text-ink transition-colors">
              Compare features on the homepage →
            </Link>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  )
}
