import fs from 'fs'
import path from 'path'

const ROOT = path.resolve('src/templates/designer')
const SECTIONS = ['about', 'work', 'experience', 'contact', 'hero']

const OLD_HASH_LISTENER =
  `document.querySelectorAll('a[href^="#"]').forEach(a=>{a.addEventListener('click',e=>{const id=a.getAttribute('href').slice(1),el=document.getElementById(id);if(el){e.preventDefault();closeNav();el.scrollIntoView({behavior:'smooth'})}})});`

const PF_GO =
  `function pfGo(id){if(!id||id==='top')return false;var el=document.getElementById(id);if(!el)return false;document.querySelectorAll('.reveal').forEach(function(r){r.classList.add('show');r.style.opacity='1';r.style.transform='none';});try{if(typeof closeNav==='function')closeNav();}catch(_){}el.scrollIntoView({behavior:'smooth',block:'start'});return false;}`

function patchNavHrefs(html) {
  let out = html
  SECTIONS.forEach((id) => {
    out = out.replace(
      new RegExp(`href="#${id}"([^>]*?)onclick="closeNav\\(\\)"`, 'g'),
      `href="#" onclick="closeNav();return pfGo('${id}')"$1`
    )
    out = out.replace(new RegExp(`href="#${id}"`, 'g'), `href="#" onclick="return pfGo('${id}')"`)
  })
  return out
}

function patchFile(filePath) {
  let html = fs.readFileSync(filePath, 'utf8')
  const before = html
  html = patchNavHrefs(html)
  if (html.includes(OLD_HASH_LISTENER)) {
    html = html.replace(OLD_HASH_LISTENER, PF_GO)
  } else if (!html.includes('function pfGo(id)')) {
    html = html.replace(
      /document\.addEventListener\('click',e=>\{const n=document\.getElementById\('mob-nav'\)[\s\S]*?\}\);/,
      (m) => `${m}\n${PF_GO}`
    )
  }
  if (html !== before) {
    fs.writeFileSync(filePath, html, 'utf8')
    console.log('patched', path.relative(process.cwd(), filePath))
  }
}

for (const entry of fs.readdirSync(ROOT, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue
  const dir = path.join(ROOT, entry.name)
  for (const file of fs.readdirSync(dir)) {
    if (file.endsWith('.html')) patchFile(path.join(dir, file))
  }
}
