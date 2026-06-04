export default function Logo({ size = 32, showText = true, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true" className="shrink-0">
        <rect width="32" height="32" rx="8" fill="url(#logo-bg)" />
        <path
          d="M8 22V10l8 6 8-6v12"
          stroke="url(#logo-stroke)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient id="logo-bg" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1e293b" />
            <stop offset="1" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="logo-stroke" x1="8" y1="10" x2="24" y2="22" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60a5fa" />
            <stop offset="0.45" stopColor="#a78bfa" />
            <stop offset="1" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
      </svg>
      {showText && (
        <span className="type-display text-[15px] sm:text-base font-bold tracking-tight">
          <span className="text-ink">Portfolio</span>
          <span className="text-gradient-brand">Forge</span>
        </span>
      )}
    </span>
  )
}
