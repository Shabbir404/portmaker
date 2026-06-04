/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        syne: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        dm: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        bg: {
          DEFAULT: '#09090b',
          2: '#111113',
          3: '#18181b',
        },
        surface: {
          DEFAULT: '#18181b',
          2: '#1f1f23',
          3: '#27272a',
        },
        border: {
          DEFAULT: 'rgba(255,255,255,0.08)',
          2: 'rgba(255,255,255,0.12)',
          3: 'rgba(255,255,255,0.16)',
        },
        accent: {
          DEFAULT: '#2563eb',
          2: '#3b82f6',
          dim: 'rgba(37,99,235,0.12)',
        },
        emerald: { forge: '#10b981' },
        violet: { forge: '#8b5cf6' },
        rose: { forge: '#f43f5e' },
        amber: { forge: '#f59e0b' },
        ink: {
          DEFAULT: '#fafafa',
          2: '#a1a1aa',
          3: '#71717a',
          4: '#52525b',
        },
      },
      backgroundImage: {
        'grad-accent': 'linear-gradient(135deg, #2563eb, #3b82f6)',
        'grad-card': 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
        'grid-fade': 'linear-gradient(to bottom, rgba(9,9,11,0) 0%, #09090b 100%)',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(255,255,255,0.08), 0 8px 32px rgba(0,0,0,0.45)',
        'glow-sm': '0 0 0 1px rgba(255,255,255,0.06)',
        card: '0 1px 2px rgba(0,0,0,0.35), 0 8px 24px rgba(0,0,0,0.25)',
        float: '0 0 0 1px rgba(255,255,255,0.1), 0 0 0 1px rgba(255,255,255,0.05) inset, 0 20px 50px -12px rgba(0,0,0,0.65), 0 0 80px -20px rgba(255,255,255,0.06)',
        'preview-glow': '0 0 120px -30px rgba(255,255,255,0.12)',
      },
      animation: {
        'float-slow': 'floatSlow 18s ease-in-out infinite',
        'float-med': 'floatMed 14s ease-in-out infinite',
        'float-fast': 'floatFast 10s ease-in-out infinite',
        'fade-up': 'fadeUp 0.5s ease forwards',
        'slide-in': 'slideIn 0.3s ease forwards',
        spin: 'spin 0.8s linear infinite',
        pulse: 'pulse 2s ease-in-out infinite',
      },
      keyframes: {
        floatSlow: { '0%,100%': { transform: 'translate(0,0) scale(1)' }, '33%': { transform: 'translate(30px,-20px) scale(1.05)' }, '66%': { transform: 'translate(-20px,30px) scale(0.95)' } },
        floatMed: { '0%,100%': { transform: 'translate(0,0)' }, '50%': { transform: 'translate(-25px,20px)' } },
        floatFast: { '0%,100%': { transform: 'translate(0,0)' }, '50%': { transform: 'translate(20px,-15px)' } },
        fadeUp: { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        slideIn: { from: { opacity: 0, transform: 'translateX(-12px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
        '3xl': '20px',
      },
      letterSpacing: {
        tightest: '-0.03em',
      },
      screens: {
        xs: '480px',
      },
    },
  },
  plugins: [],
}
