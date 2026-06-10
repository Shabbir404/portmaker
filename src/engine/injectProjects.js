import {
  builderProjectsToTemplateSeed,
  storageKeyForTheme,
} from '../lib/builderProjects.js'

function escapeScriptJson(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}

const GETP_PATTERN =
  /function getP\(\)\{try\{return JSON\.parse\(localStorage\.getItem\(CFG\.storageKey\)\|\|'\[\]'\)\}catch\{return\[\]\}\}/

const GETP_REPLACEMENT = `function getP(){try{var s=localStorage.getItem(CFG.storageKey);if(s){var p=JSON.parse(s);if(Array.isArray(p)&&p.length)return p}}catch(_lp){}return(typeof PF_BUILDER_SEED!=='undefined'&&Array.isArray(PF_BUILDER_SEED))?PF_BUILDER_SEED:[]}`

/**
 * Embeds builder projects in generated HTML so preview (blob iframe) and
 * first paint show real work — localStorage alone fails in blob: URLs.
 */
export function injectBuilderProjects(html, form, themeId) {
  const seed = builderProjectsToTemplateSeed(form.projects, form.role)
  if (!seed.length) return html

  const seedLiteral = escapeScriptJson(seed)
  let out = html

  const seedDecl = `const PF_BUILDER_SEED=${seedLiteral};`

  if (/const CFG=\{/.test(out)) {
    if (!out.includes('PF_BUILDER_SEED')) {
      out = out.replace(/(const CFG=\{[^}]+\};)/, `$1\n${seedDecl}`)
    }
    if (GETP_PATTERN.test(out)) {
      out = out.replace(GETP_PATTERN, GETP_REPLACEMENT)
    }
    const storageSeed = `try{localStorage.setItem(CFG.storageKey,${seedLiteral});}catch(_pf){}`
    if (!out.includes(storageSeed)) {
      out = out.replace(/(const PF_BUILDER_SEED=[^;]+;)/, `$1\n${storageSeed}`)
    }
    return out
  }

  const key = storageKeyForTheme(themeId)
  const fallbackBlock = `<script>const PF_BUILDER_SEED=${seedLiteral};try{localStorage.setItem('${key}',${seedLiteral});}catch(_e){}</script>`

  const renderCall = out.includes('renderWork();') ? 'renderWork();' : 'renderProjects();'
  if (out.includes(renderCall) && !out.includes('PF_BUILDER_SEED')) {
    return out.replace(renderCall, `${fallbackBlock}\n${renderCall}`)
  }

  return out.replace(/<\/body>/i, `${fallbackBlock}</body>`)
}
