import fs from 'fs'
import path from 'path'

const ROOT = path.resolve('src/templates/developer')
const SECTIONS = ['section-about', 'skills', 'projects', 'experience', 'contact', 'hero']

const OLD_PF_GO =
  "function pfGo(id){if(!id||id==='top')return;var el=document.getElementById(id);if(!el)return;document.querySelectorAll('.reveal').forEach(r=>r.classList.add('show'));if(typeof closeNav==='function')closeNav();var nav=document.querySelector('nav'),off=(nav?nav.offsetHeight:72)+12,y=el.getBoundingClientRect().top+window.scrollY-off;window.scrollTo({top:Math.max(0,y),behavior:'smooth'})} document.querySelectorAll('a[href^=\"#\"]').forEach(a=>{a.addEventListener('click',e=>{const h=a.getAttribute('href');if(!h||h==='#'||h==='#top')return;const id=h.slice(1);if(document.getElementById(id)){e.preventDefault();pfGo(id)}})});"

const NEW_PF_GO =
  "function pfGo(id){if(!id||id==='top')return false;var el=document.getElementById(id);if(!el)return false;document.querySelectorAll('.reveal').forEach(function(r){r.classList.add('show');r.style.opacity='1';r.style.transform='none';});try{if(typeof closeNav==='function')closeNav();}catch(_){}el.scrollIntoView({behavior:'smooth',block:'start'});return false;}"

const TERMINAL_OLD = `/* ════ SMOOTH SCROLL ════ */
function pfGo(id){
  if(!id||id==='top')return;
  var el=document.getElementById(id);
  if(!el)return;
  document.querySelectorAll('.reveal').forEach(r=>r.classList.add('show'));
  if(typeof closeNav==='function')closeNav();
  var nav=document.querySelector('nav'),off=(nav?nav.offsetHeight:72)+12,y=el.getBoundingClientRect().top+window.scrollY-off;
  window.scrollTo({top:Math.max(0,y),behavior:'smooth'});
}
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const h = a.getAttribute('href');
    if(!h||h==='#'||h==='#top')return;
    const id = h.slice(1);
    if(document.getElementById(id)){ e.preventDefault(); pfGo(id); }
  });
});`

const TERMINAL_NEW = `/* ════ SMOOTH SCROLL ════ */
function pfGo(id){
  if(!id||id==='top')return false;
  var el=document.getElementById(id);
  if(!el)return false;
  document.querySelectorAll('.reveal').forEach(function(r){
    r.classList.add('show');
    r.style.opacity='1';
    r.style.transform='none';
  });
  try{if(typeof closeNav==='function')closeNav();}catch(_){}
  el.scrollIntoView({behavior:'smooth',block:'start'});
  return false;
}`

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

  if (html.includes(OLD_PF_GO)) {
    html = html.replace(OLD_PF_GO, NEW_PF_GO)
  } else if (html.includes(TERMINAL_OLD)) {
    html = html.replace(TERMINAL_OLD, TERMINAL_NEW)
  }

  if (html !== before) {
    fs.writeFileSync(filePath, html, 'utf8')
    console.log('patched', path.relative(process.cwd(), filePath))
  } else {
    console.log('unchanged', path.relative(process.cwd(), filePath))
  }
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full)
    else if (entry.name.endsWith('.html')) patchFile(full)
  }
}

walk(ROOT)
