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

function defaultHeadline(form) {
  return (
    form.headline ||
    'Full-Stack Developer & Open Source Enthusiast'
  )
}

function roleLabel(form, headline) {
  if (form.subRole?.trim()) return form.subRole.trim()
  const short = headline.split('&')[0].trim()
  return short || 'Developer'
}

const DEMO_BIO_HERO =
  'I build fast, accessible, and production-ready web applications with clean architecture and a sharp eye for developer experience.'

const DEMO_BIO_ABOUT =
  "I'm a full-stack developer based in Dhaka, Bangladesh, with 4+ years of experience building web applications that scale. I specialise in React, Node.js, and cloud infrastructure."

const DEMO_BIO_ABOUT_EXTRA =
  "I'm a full-stack developer based in Dhaka, Bangladesh, with 4+ years of experience building web applications that scale. I specialise in React, Node.js, and cloud infrastructure - and I genuinely love solving hard engineering problems."

const SKILL_RENDERERS = {
  'dev-3d': (s) =>
    `<span class="sk-3d"><span class="sk-dot"></span>${escapeHtml(s)}</span>`,
  'dev-glassmorphic': (s) => `<span class="sk-chip">${escapeHtml(s)}</span>`,
  'dev-magazine': (s) => `<span class="sk-m">${escapeHtml(s)}</span>`,
  'dev-minimal': (s) => `<span class="skill-pill">${escapeHtml(s)}</span>`,
  'dev-neon': (s) => `<span class="nsk">${escapeHtml(s)}</span>`,
  'dev-retro': (s) => `<span class="sk-r">${escapeHtml(s)}</span>`,
  'dev-terminal': (s) => `<span class="skill-tag">${escapeHtml(s)}</span>`,
}

const ROLE_LABEL_CLASSES = [
  'av-role-3d',
  'av-role-tag',
  'avf-role',
  'av-tag-role',
  't3-role',
  'tl-role',
  'tlm-role',
  'tln-role',
  'exp-role',
]

function injectSkills(html, skills, themeId) {
  const render = SKILL_RENDERERS[themeId]
  if (!render || !skills?.length) return html

  const skillHtml = skills.map(render).join('')

  const patterns = [
    /(<section id="skills"[\s\S]*?<div[^>]*id="skill-grid"[^>]*>)[\s\S]*?(<\/div>)/,
    /(<section id="skills"[\s\S]*?<div[^>]*id="sk-wrap"[^>]*>)[\s\S]*?(<\/div>)/,
    /(<section id="skills"[\s\S]*?<div[^>]*display:grid[^>]*>)[\s\S]*?(<\/div>\s*<\/div>\s*<\/section>)/,
    /(<section id="skills"[\s\S]*?<div[^>]*display:flex[^>]*flex-wrap[^>]*>)[\s\S]*?(<\/div>)/,
  ]

  for (const pattern of patterns) {
    if (pattern.test(html)) {
      return html.replace(pattern, `$1${skillHtml}$2`)
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

function patchAdminConfig(html, form, themeId) {
  const user = escapeJs(form.adminUser || 'admin')
  const pass = escapeJs(form.adminPass || 'admin123')
  const storageKey = `pf_${themeId.replace(/[^a-z0-9_-]/gi, '_')}`

  return html.replace(
    /const CFG=\{adminUser:'[^']*',adminPass:'[^']*',storageKey:'[^']+'\};/,
    `const CFG={adminUser:'${user}',adminPass:'${pass}',storageKey:'${storageKey}'};`
  )
}

function patchRoleLabels(html, roleTag) {
  let out = html
  const safeRole = escapeHtml(roleTag)

  ROLE_LABEL_CLASSES.forEach((cls) => {
    out = out.replace(
      new RegExp(`(class="${cls}"[^>]*>)Full-Stack Developer(<)`, 'g'),
      `$1${safeRole}$2`
    )
  })

  out = out.replace(
    /(<span class="fact-v">)Full-Stack Developer(<\/span>)/g,
    `$1${safeRole}$2`
  )
  out = out.replace(
    /(<span class="fact-mv">)Full-Stack Developer(<\/span>)/g,
    `$1${safeRole}$2`
  )
  out = out.replace(
    /(<span class="val">)FULL-STACK DEVELOPER(<\/span>)/g,
    `$1${safeRole.toUpperCase()}$2`
  )

  return out
}

/**
 * Replaces demo profile content (Alex Chen, etc.) with builder form data
 * for HTML templates in src/templates/developer/{theme-id}/
 */
export function personalizeDevTemplate(html, form, themeId) {
  const name = form.name?.trim() || 'Your Name'
  const nameHtml = escapeHtml(name)
  const nameUpper = escapeHtml(name.toUpperCase())
  const initials = escapeHtml(getInitials(name))
  const headline = defaultHeadline(form)
  const headlineHtml = escapeHtml(headline)
  const roleTag = roleLabel(form, headline)
  const bio = form.bio?.trim()
  const bioHtml = bio ? escapeHtml(bio) : ''

  let out = html

  out = patchAdminConfig(out, form, themeId)

  out = out.replace(/Alex Chen/g, nameHtml)
  out = out.replace(/ALEX CHEN/g, nameUpper)

  out = out.replace(
    /(<[^>]*class="[^"]*(?:av-initials|avatar-initials-min)[^"]*"[^>]*>)AC(<\/div>)/g,
    `$1${initials}$2`
  )

  out = out.replace(
    /Full-Stack Developer &amp; Open Source Enthusiast/g,
    headlineHtml
  )
  out = out.replace(
    /Full-Stack Developer & Open Source Enthusiast/g,
    headlineHtml
  )

  out = patchRoleLabels(out, roleTag)

  if (bioHtml) {
    out = out.replace(DEMO_BIO_HERO, bioHtml)
    out = out.replace(DEMO_BIO_ABOUT, bioHtml)
    out = out.replace(DEMO_BIO_ABOUT_EXTRA, bioHtml)
    out = out.replace(
      /Full-Stack Developer &amp; Open Source Enthusiast building fast, accessible[^<]+/,
      `${headlineHtml}${bioHtml ? ` — ${bioHtml}` : ''}`
    )
  }

  if (form.email) {
    const emailHtml = escapeHtml(form.email)
    out = out.replace(/alex@example\.com/g, emailHtml)
    out = out.replace(/mailto:alex@example\.com/g, `mailto:${encodeURIComponent(form.email)}`)
  }

  if (form.phone && !form.skipped?.phone) {
    out = out.replace(/\+880 123 456 7890/g, escapeHtml(form.phone))
    out = out.replace(/tel:\+8801234567890/g, `tel:${form.phone.replace(/\s/g, '')}`)
  }

  if (form.location && !form.skipped?.location) {
    out = out.replace(/Dhaka, Bangladesh/g, escapeHtml(form.location))
  }

  if (form.github) {
    const ghUrl = escapeHtml(form.github)
    const ghDisplay = escapeHtml(
      form.github.replace(/^https?:\/\//, '').replace(/\/$/, '')
    )
    out = out.replace(/href="https:\/\/github\.com"/g, `href="${ghUrl}"`)
    out = out.replace(/github\.com\/alexchen/g, ghDisplay.replace(/^github\.com\/?/, 'github.com/'))
  }

  const socialMap = {
    linkedin: 'LinkedIn',
    twitter: 'Twitter',
    stackoverflow: 'Stack Overflow',
    github: 'GitHub',
    devto: 'Dev.to',
    codepen: 'CodePen',
  }

  form.selectedSocials?.forEach((id) => {
    const url = form.socialUrls?.[id]
    const label = socialMap[id]
    if (url && label) out = patchSocialLink(out, label, url)
  })

  if (form.github) {
    out = patchSocialLink(out, 'GitHub', form.github)
  }

  out = injectSkills(out, form.skills, themeId)
  out = injectAvatar(out, form)

  return out
}

function injectAvatar(html, form) {
  if (!form.avatar || form.skipped?.avatar) return html

  const src = escapeHtml(form.avatar)
  const alt = escapeHtml(form.name || 'Profile photo')

  let out = html

  const imgPatterns = [
    { pattern: /<div class="av-ph">[\s\S]*?<\/div>/, tag: `<img src="${src}" class="av-img" alt="${alt}">` },
    { pattern: /<div class="av-ph-m">[\s\S]*?<\/div>/, tag: `<img src="${src}" class="av-img-m" alt="${alt}">` },
    { pattern: /<div class="avatar-ph">[\s\S]*?<\/div>/, tag: `<img src="${src}" class="avatar-img" alt="${alt}">` },
    {
      pattern: /<div class="avatar-img-ph" id="avatar-ph">[\s\S]*?<\/div>/,
      tag: `<img src="${src}" class="avatar-img" alt="${alt}" id="avatar-ph">`,
    },
  ]

  imgPatterns.forEach(({ pattern, tag }) => {
    if (pattern.test(out)) out = out.replace(pattern, tag)
  })

  return out
}
