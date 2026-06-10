import { loadThemeHtml } from '../templates/themeLoader.js'
import { personalizeDevTemplate } from './personalizeDevTemplate.js'
import { personalizeDesignerTemplate } from './personalizeDesignerTemplate.js'
import { injectPortfolioNavFix } from '../utils/portfolioNavFix.js'
import { builderProjectsToTemplateSeed } from '../lib/builderProjects.js'

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function defaultHeadline(form) {
  const map = {
    developer: 'Full-Stack Developer & Problem Solver',
    designer: 'UI/UX Designer crafting beautiful experiences',
    doctor: 'Dedicated Medical Professional',
    student: 'Student & Aspiring Professional',
  }
  return form.headline || map[form.role] || 'Professional'
}

function defaultBio(form) {
  return form.bio || `Hi, I'm ${form.name || 'there'}. Welcome to my portfolio.`
}

function buildSkillsHtml(form, accent) {
  const skills = form.skills?.slice(0, 12) || []
  if (!skills.length) return ''
  return skills
    .map(
      (s) =>
        `<span class="pf-skill" style="--accent:${accent}">${escapeHtml(s)}</span>`
    )
    .join('')
}

function buildSocialsHtml(form) {
  const links = []

  form.selectedSocials?.forEach((id) => {
    const url = form.socialUrls?.[id]
    if (url) links.push({ label: id, url })
  })

  form.customSocials?.forEach(({ name, url }) => {
    if (url) links.push({ label: name, url })
  })

  if (form.github) links.push({ label: 'GitHub', url: form.github })
  if (form.website) links.push({ label: 'Website', url: form.website })

  if (!links.length) return ''

  return links
    .map(
      (l) =>
        `<a href="${escapeHtml(l.url)}" target="_blank" rel="noopener noreferrer" class="pf-social">${escapeHtml(l.label)}</a>`
    )
    .join('')
}

function buildContactBlock(form, accent) {
  const parts = []
  if (form.email) {
    parts.push(
      `<a href="mailto:${escapeHtml(form.email)}" class="pf-contact-email" style="--accent:${accent}">${escapeHtml(form.email)}</a>`
    )
  }
  if (form.phone && !form.skipped?.phone) {
    parts.push(`<p class="pf-contact-meta">${escapeHtml(form.phone)}</p>`)
  }
  if (form.location && !form.skipped?.location) {
    parts.push(`<p class="pf-contact-meta">${escapeHtml(form.location)}</p>`)
  }
  return parts.join('')
}

function buildAdminScript(form, accent) {
  const user = escapeHtml(form.adminUser || 'admin')
  const pass = escapeHtml(form.adminPass || 'admin123')
  const seed = JSON.stringify(builderProjectsToTemplateSeed(form.projects, form.role))
    .replace(/</g, '\\u003c')
  return `
<script>
const ADMIN_USER = '${user}';
const ADMIN_PASS = '${pass}';
const ACCENT = '${accent}';
const PF_SEED = ${seed};
try{localStorage.setItem('pf_projects',JSON.stringify(PF_SEED));}catch(_e){}
function pfGetProjects(){
  try{var s=localStorage.getItem('pf_projects');if(s){var p=JSON.parse(s);if(Array.isArray(p)&&p.length)return p}}catch(_x){}
  return(Array.isArray(PF_SEED)&&PF_SEED.length)?PF_SEED:[];
}
function renderProjects() {
  const projects = pfGetProjects();
  const grid = document.getElementById('projects-grid');
  if (!grid || !projects.length) return;
  grid.innerHTML = projects.map(p => \`
    <article class="pf-project">
      \${(p.img1||p.img) ? \`<img src="\${p.img1||p.img}" alt="" class="pf-project-img">\` : \`<div class="pf-project-img pf-project-img--placeholder"></div>\`}
      <div class="pf-project-body">
        <h3>\${p.title}</h3>
        <p>\${p.desc || ''}</p>
      </div>
    </article>\`).join('');
}
if (window.location.search.includes('admin=1')) {
  const u = prompt('Admin Username:'); const p = prompt('Admin Password:');
  if (u === ADMIN_USER && p === ADMIN_PASS) {
    document.body.insertAdjacentHTML('beforeend', \`
    <div class="pf-admin-overlay">
      <div class="pf-admin-modal">
        <h2>Admin Panel</h2>
        <p>Add and manage your projects</p>
        <input id="proj-title" placeholder="Project title">
        <textarea id="proj-desc" placeholder="Project description"></textarea>
        <input id="proj-img" placeholder="Image URL (optional)">
        <div class="pf-admin-actions">
          <button type="button" onclick="saveProject()">Save Project</button>
          <button type="button" onclick="this.closest('.pf-admin-overlay').remove()">Close</button>
        </div>
      </div>
    </div>\`);
  } else { alert('Invalid credentials'); }
}
function saveProject() {
  const title = document.getElementById('proj-title').value;
  const desc = document.getElementById('proj-desc').value;
  const img = document.getElementById('proj-img').value;
  if (!title) { alert('Enter a title'); return; }
  const projects = JSON.parse(localStorage.getItem('pf_projects') || '[]');
  projects.push({ title, desc, img, id: Date.now() });
  localStorage.setItem('pf_projects', JSON.stringify(projects));
  renderProjects();
  document.querySelector('.pf-admin-overlay')?.remove();
}
renderProjects();
<\/script>`
}

export function buildTemplateData(form) {
  const name = form.name || 'Your Name'
  const headline = defaultHeadline(form)
  const bio = defaultBio(form)
  const accent =
    form.role === 'developer'
      ? '#4f8cff'
      : form.role === 'designer'
        ? '#f472b6'
        : form.role === 'doctor'
          ? '#22d3a0'
          : form.role === 'student'
            ? '#a78bfa'
            : '#fbbf24'

  const skillsHtml = buildSkillsHtml(form, accent)
  const socialsHtml = buildSocialsHtml(form)
  const contactHtml = buildContactBlock(form, accent)
  const firstName = name.split(' ')[0] || name

  return {
    NAME: escapeHtml(name),
    FIRST_NAME: escapeHtml(firstName),
    HEADLINE: escapeHtml(headline),
    BIO: escapeHtml(bio),
    EMAIL: escapeHtml(form.email || ''),
    PHONE: escapeHtml(form.phone || ''),
    LOCATION: escapeHtml(form.location || ''),
    ROLE: escapeHtml(form.role || 'professional'),
    SUB_ROLE: escapeHtml(form.subRole || ''),
    GITHUB: escapeHtml(form.github || ''),
    SKILLS_HTML: skillsHtml,
    SKILLS_SECTION: skillsHtml
      ? `<section id="skills" class="pf-section pf-skills-section"><div class="pf-container"><h2>Skills</h2><div class="pf-skills">${skillsHtml}</div></div></section>`
      : '',
    SOCIALS_HTML: socialsHtml,
    SOCIALS_SECTION: socialsHtml
      ? `<div class="pf-socials">${socialsHtml}</div>`
      : '',
    CONTACT_HTML: contactHtml,
    ACCENT: accent,
    THEME_NAME: escapeHtml(form.selectedTheme || form.themePreference || 'default'),
    YEAR: String(new Date().getFullYear()),
    ADMIN_SCRIPT: buildAdminScript(form, accent),
  }
}

export function renderTemplate(html, form) {
  const data = buildTemplateData(form)
  let out = html
  Object.entries(data).forEach(([key, value]) => {
    out = out.replaceAll(`{{${key}}}`, value)
  })
  if (data.ADMIN_SCRIPT && !html.includes('{{ADMIN_SCRIPT}}') && !out.includes('pf-admin-overlay')) {
    out = out.replace(/<\/body>/i, `${data.ADMIN_SCRIPT}</body>`)
  }
  return out
}

export async function loadThemeTemplate(role, themeId) {
  return loadThemeHtml(role, themeId)
}

export async function generatePortfolio(form) {
  if (form.role === 'developer' && form.selectedTheme) {
    const raw = await loadThemeTemplate('developer', form.selectedTheme)
    const personalized = personalizeDevTemplate(raw, form, form.selectedTheme)
    return injectPortfolioNavFix(renderTemplate(personalized, form))
  }
  if (form.role === 'designer' && form.selectedTheme) {
    const raw = await loadThemeTemplate('designer', form.selectedTheme)
    const personalized = personalizeDesignerTemplate(raw, form, form.selectedTheme)
    return injectPortfolioNavFix(renderTemplate(personalized, form))
  }
  return injectPortfolioNavFix(renderFallbackHTML(form))
}

/** Fallback when no theme file is selected (non-developer roles) */
function renderFallbackHTML(form) {
  const data = buildTemplateData(form)
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${data.NAME} — Portfolio</title>
<style>
body{font-family:system-ui,sans-serif;background:#09090b;color:#fafafa;margin:0;padding:2rem;line-height:1.6}
h1{color:${data.ACCENT}}
.pf-skills span{display:inline-block;margin:4px;padding:6px 12px;border-radius:999px;background:${data.ACCENT}22;border:1px solid ${data.ACCENT}44;color:${data.ACCENT}}
.pf-social{display:inline-block;margin:4px;padding:8px 14px;border-radius:8px;border:1px solid #333;color:#ccc;text-decoration:none}
</style>
</head>
<body>
<h1>${data.NAME}</h1>
<p>${data.HEADLINE}</p>
<p>${data.BIO}</p>
${data.SKILLS_SECTION}
${data.SOCIALS_SECTION}
${data.CONTACT_HTML}
<footer><small>© ${data.YEAR} · Generated by PortfolioForge</small></footer>
${data.ADMIN_SCRIPT}
</body>
</html>`
}
