import { Link } from 'react-router-dom'
import Logo from './Logo'

const LINKS = {
  Product: [
    { label: 'Features', to: '/#features' },
    { label: 'How it works', to: '/#how-it-works' },
    { label: 'Live preview', to: '/#preview' },
    { label: 'Pricing', to: '/pricing' },
  ],
  Company: [
    { label: 'About', to: '/' },
    { label: 'Blog', to: '/' },
    { label: 'Contact', to: '/' },
  ],
  Legal: [
    { label: 'Privacy', to: '/' },
    { label: 'Terms', to: '/' },
  ],
}

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="landing-container py-14 sm:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-12">
          <div className="col-span-2 md:col-span-4 lg:col-span-2">
            <Link to="/" className="inline-block mb-4 hover:opacity-90 transition-opacity">
              <Logo />
            </Link>
            <p className="text-sm text-ink-2 leading-relaxed max-w-xs mb-6">
              Build a stunning portfolio in minutes. Templates, admin panel, and deploy-ready code — all in one place.
            </p>
            <div className="flex gap-2">
              {['Twitter', 'GitHub', 'LinkedIn'].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="footer-social"
                  aria-label={s}
                >
                  {s[0]}
                </a>
              ))}
            </div>
          </div>

          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title}>
              <p className="footer-col-title">{title}</p>
              <ul className="space-y-2.5">
                {links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="footer-link">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <p className="text-xs text-ink-3">
            © {new Date().getFullYear()} PortfolioForge. All rights reserved.
          </p>
          <p className="text-xs text-ink-3 flex items-center gap-1.5">
            <span className="status-dot w-1.5 h-1.5" />
            All systems operational
          </p>
        </div>
      </div>
    </footer>
  )
}
