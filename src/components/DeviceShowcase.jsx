import { useState } from 'react'
import { Monitor, Tablet, Smartphone } from 'lucide-react'

const DEVICES = [
  { id: 'desktop', label: 'Desktop', icon: Monitor, width: 'w-full max-w-2xl' },
  { id: 'tablet', label: 'Tablet', icon: Tablet, width: 'w-full max-w-md mx-auto' },
  { id: 'mobile', label: 'Mobile', icon: Smartphone, width: 'w-full max-w-[220px] mx-auto' },
]

export default function DeviceShowcase({ url = 'portfolioforge.app/you' }) {
  const [active, setActive] = useState('desktop')
  const device = DEVICES.find((d) => d.id === active) || DEVICES[0]

  return (
    <div className="device-showcase">
      <div className="device-showcase__glow" aria-hidden="true" />

      <div className="glass-panel device-showcase__panel">
        <div className="device-tabs">
          {DEVICES.map((d) => {
            const Icon = d.icon
            const isActive = active === d.id
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => setActive(d.id)}
                className={`device-tab ${isActive ? 'device-tab--active' : ''}`}
              >
                <Icon size={15} strokeWidth={2} />
                {d.label}
              </button>
            )
          })}
        </div>

        <div className={`device-stage ${device.width}`}>
          <DeviceFrame type={active} url={url} />
        </div>
      </div>
    </div>
  )
}

function DeviceFrame({ type, url }) {
  const isMobile = type === 'mobile'

  return (
    <div
      className={`device-frame device-frame--${type} transition-all duration-500 ease-out`}
    >
      {!isMobile && (
        <div className="device-frame__chrome">
          <div className="device-frame__dots">
            <span className="device-dot device-dot--rose" />
            <span className="device-dot device-dot--amber" />
            <span className="device-dot device-dot--green" />
          </div>
          <div className="device-frame__url">
            <span className="device-frame__lock" />
            <span className="truncate font-mono text-[11px] text-ink-2">{url}</span>
          </div>
        </div>
      )}

      {isMobile && (
        <div className="device-frame__notch" aria-hidden="true" />
      )}

      <div className="device-frame__screen">
        <PortfolioScreen compact={isMobile} />
      </div>

      {isMobile && (
        <div className="device-frame__home-bar" aria-hidden="true" />
      )}
    </div>
  )
}

function PortfolioScreen({ compact }) {
  return (
    <div className={`portfolio-screen ${compact ? 'portfolio-screen--compact' : ''}`}>
      <div className="portfolio-screen__hero">
        <div className="portfolio-screen__avatar" />
        <div>
          <p className="portfolio-screen__role">Full-Stack Developer</p>
          <h4 className="portfolio-screen__name">Alex Johnson</h4>
          {!compact && (
            <p className="portfolio-screen__bio">
              Building fast, accessible products with React & Node.
            </p>
          )}
        </div>
      </div>

      {!compact && (
        <div className="portfolio-screen__tags">
          {['React', 'TypeScript', 'Node'].map((t) => (
            <span key={t} className="portfolio-screen__tag">{t}</span>
          ))}
        </div>
      )}

      <div className={`portfolio-screen__grid ${compact ? 'grid-cols-1' : 'grid-cols-2'}`}>
        {['SaaS Platform', 'Design System'].slice(0, compact ? 1 : 2).map((title, i) => (
          <div key={title} className="portfolio-screen__card group/card">
            <div
              className="portfolio-screen__card-img"
              style={{
                background: i === 0
                  ? 'linear-gradient(135deg, rgba(59,130,246,0.5), rgba(139,92,246,0.35))'
                  : 'linear-gradient(135deg, rgba(34,211,238,0.4), rgba(59,130,246,0.3))',
              }}
            />
            <div className="portfolio-screen__card-body">
              <p className="text-xs font-semibold text-ink">{title}</p>
              <p className="text-[10px] text-ink-3">2024 · Case study</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
