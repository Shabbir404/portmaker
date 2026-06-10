import { injectBuilderProjects } from './injectProjects.js'

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function escapeJs(str = '') {
  return String(str).replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

function getInitials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return 'YN'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const DEMO_BY_THEME = {
  'des-minimal': {
    name: 'Riya Sen',
    email: 'riya@example.com',
    dribbblePath: 'dribbble.com/riyasen',
    demoInitials: 'RS',
  },
  'des-gallery': {
    name: 'Sara Malik',
    email: 'sara@example.com',
    dribbblePath: 'dribbble.com/saramalik',
    demoInitials: 'SM',
  },
  'des-editorial': {
    name: 'Nadia Hossain',
    email: 'nadia@example.com',
    dribbblePath: 'dribbble.com/nadiahossain',
    demoInitials: 'NH',
  },
}

const TOOL_RENDERERS = {
  'des-minimal': (t) => `<span class="tool-m">${escapeHtml(t)}</span>`,
  'des-gallery': (t) => `<span class="tool-chip">${escapeHtml(t)}</span>`,
  'des-editorial': (t) => `<span class="tool-e">${escapeHtml(t)}</span>`,
}

const DEFAULT_TOOLS = ['Figma', 'Adobe XD', 'Illustrator', 'Photoshop', 'Framer']

function defaultHeadline(form) {
  return (
    form.headline ||
    form.designSpec ||
    'UI/UX Designer crafting delightful digital experiences'
  )
}

function roleLabel(form, headline) {
  if (form.designSpec?.trim()) return form.designSpec.trim()
  if (form.subRole?.trim()) return form.subRole.trim()
  const short = headline.split('—')[0].trim()
  return short || 'UI/UX Designer'
}

function patchAdminConfig(html, form, themeId) {
  const user = escapeJs(form.adminUser || 'admin')
  const pass = escapeJs(form.adminPass || 'admin123')
  const storageKey = `pf_${themeId.replace(/[^a-z0-9_-]/gi, '_')}`

  return html.replace(
    /const CFG=\{adminUser:'[^']*',adminPass:'[^']*',storageKey:'[^']+'\};/,
    `const CFG={adminUser:'${user}',adminPass:'${pass}',storageKey:'${storageKey}'};`
  )
}

function injectDesignTools(html, tools, themeId) {
  const render = TOOL_RENDERERS[themeId]
  const list = tools?.length ? tools : DEFAULT_TOOLS
  if (!render || !list.length) return html

  const toolHtml = list.map(render).join('')

  const patterns = [
    /(Design Tools[\s\S]*?<div[^>]*display:flex[^>]*flex-wrap[^>]*>)[\s\S]*?(<\/div>)/,
    /(<div class="eyebrow"[^>]*>Design Tools<\/div>\s*<div[^>]*>)[\s\S]*?(<\/div>)/,
  ]

  for (const pattern of patterns) {
    if (pattern.test(html)) {
      return html.replace(pattern, `$1${toolHtml}$2`)
    }
  }
  return html
}

function patchSocialLink(html, label, url) {
  if (!url) return html
  const safeUrl = escapeHtml(url)
  const re = new RegExp(
    `(<a\\s[^>]*href=")[^"]*("[^>]*>[\\s\\S]*?${label}[\\s\\S]*?<\\/a>)`,
    'i'
  )
  return html.replace(re, `$1${safeUrl}$2`)
}

function injectAvatar(html, form, demoInitials) {
  if (!form.avatar || form.skipped?.avatar) return html

  const src = escapeHtml(form.avatar)
  const alt = escapeHtml(form.name || 'Profile photo')
  const initials = escapeHtml(getInitials(form.name || ''))

  let out = html

  const replacements = [
    { pattern: /<div class="hr-ph">[\s\S]*?<\/div>/, tag: `<img src="${src}" class="hr-img" alt="${alt}">` },
    { pattern: /<div class="hero-ph">[\s\S]*?<\/div>/, tag: `<img src="${src}" class="hero-img" alt="${alt}">` },
    { pattern: /<div class="hp-ph">[\s\S]*?<\/div>/, tag: `<img src="${src}" class="hp-img" alt="${alt}">` },
    { pattern: /<div class="am-ph">[\s\S]*?<\/div>/, tag: `<img src="${src}" class="am-img" alt="${alt}">` },
    { pattern: /<div class="about-ph">[\s\S]*?<\/div>/, tag: `<img src="${src}" class="about-img" alt="${alt}">` },
    { pattern: /<div class="aie-ph">[\s\S]*?<\/div>/, tag: `<img src="${src}" class="aie-img" alt="${alt}">` },
  ]

  replacements.forEach(({ pattern, tag }) => {
    if (pattern.test(out)) out = out.replace(pattern, tag)
  })

  if (demoInitials) {
    out = out.replace(
      new RegExp(`(<div class="[^"]*-ph-init[^"]*">)${demoInitials}(</div>)`, 'g'),
      `$1${initials}$2`
    )
    out = out.replace(
      new RegExp(`(<div class="[^"]*-initials[^"]*">)${demoInitials}(</div>)`, 'g'),
      `$1${initials}$2`
    )
    out = out.replace(
      new RegExp(`(<div class="hr-ph-init">)${demoInitials}(</div>)`, 'g'),
      `$1${initials}$2`
    )
  }

  return out
}

/**
 * Replaces demo designer profile content with builder form data.
 */
export function personalizeDesignerTemplate(html, form, themeId) {
  const demo = DEMO_BY_THEME[themeId] || { name: 'Your Name', email: 'hello@example.com', demoInitials: 'YN' }
  const name = form.name?.trim() || 'Your Name'
  const nameHtml = escapeHtml(name)
  const initials = escapeHtml(getInitials(name))
  const headline = defaultHeadline(form)
  const headlineHtml = escapeHtml(headline)
  const roleTag = escapeHtml(roleLabel(form, headline))
  const bio = form.bio?.trim()
  const bioHtml = bio ? escapeHtml(bio) : ''

  let out = html

  out = patchAdminConfig(out, form, themeId)
  out = out.replace(new RegExp(demo.name, 'g'), nameHtml)
  out = out.replace(/UI\/UX Designer/g, roleTag)
  out = out.replace(/UI\/UX · Brand · Visual/g, headlineHtml)

  if (bioHtml) {
    const demoBios = [
      "I'm a UI/UX and brand designer with 5+ years turning complex problems into elegant, user-centered solutions. My work spans product design, brand systems, and motion.",
      "I'm a UI/UX designer with 5+ years of experience creating digital products for startups, agencies, and enterprises. My work spans mobile apps, web platforms, and brand identities.",
      "I'm a UI/UX and brand designer based in Dhaka with 5+ years of experience creating digital products and visual identities. My work lives at the intersection of aesthetics and function.",
      'I design interfaces that feel intuitive, look stunning, and solve real problems. Based in Dhaka — working globally.',
      'I create interfaces, identities, and digital experiences that resonate with people on an emotional level.',
    ]
    demoBios.forEach((text) => {
      out = out.replace(text, bioHtml)
    })
    out = out.replace(
      /I design <strong>products people love<\/strong> — from research to pixel-perfect UI\. Based in Dhaka, working everywhere\./,
      bioHtml
    )
  }

  if (form.email) {
    const emailHtml = escapeHtml(form.email)
    out = out.replace(new RegExp(demo.email, 'g'), emailHtml)
    out = out.replace(
      new RegExp(`mailto:${demo.email.replace('.', '\\.')}`, 'g'),
      `mailto:${encodeURIComponent(form.email)}`
    )
  }

  if (form.phone && !form.skipped?.phone) {
    out = out.replace(/\+880 123 456 7890/g, escapeHtml(form.phone))
    out = out.replace(/tel:\+8801234567890/g, `tel:${form.phone.replace(/\s/g, '')}`)
  }

  if (form.location && !form.skipped?.location) {
    out = out.replace(/Dhaka, Bangladesh/g, escapeHtml(form.location))
  }

  if (form.company && !form.skipped?.company) {
    out = out.replace(/Studio Nova/g, escapeHtml(form.company))
  }

  if (form.dribbble && !form.skipped?.dribbble) {
    const url = escapeHtml(form.dribbble)
    const display = escapeHtml(form.dribbble.replace(/^https?:\/\//, '').replace(/\/$/, ''))
    out = out.replace(/href="https:\/\/dribbble\.com"/g, `href="${url}"`)
    if (demo.dribbblePath) {
      out = out.replace(new RegExp(demo.dribbblePath.replace('.', '\\.'), 'g'), display)
    }
    out = patchSocialLink(out, 'Dribbble', form.dribbble)
  }

  if (form.behance && !form.skipped?.behance) {
    out = patchSocialLink(out, 'Behance', form.behance)
  }

  if (form.website && !form.skipped?.website) {
    out = patchSocialLink(out, 'Website', form.website)
  }

  const socialMap = {
    linkedin: 'LinkedIn',
    twitter: 'Twitter',
    instagram: 'Instagram',
    pinterest: 'Pinterest',
    artstation: 'ArtStation',
    figmacommunity: 'Figma Community',
  }

  form.selectedSocials?.forEach((id) => {
    const url = form.socialUrls?.[id]
    const label = socialMap[id]
    if (url && label) out = patchSocialLink(out, label, url)
  })

  out = injectDesignTools(out, form.designTools, themeId)
  out = injectAvatar(out, form, demo.demoInitials)

  out = out.replace(
    /(<title>)[^—]+( — Designer<\/title>)/,
    `$1${nameHtml}$2`
  )

  out = injectBuilderProjects(out, form, themeId)

  return out
}
