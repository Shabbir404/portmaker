import fs from 'fs'

const line = fs.readFileSync('./src/templates/developer/dev-3d/dev_3d_template.html', 'utf8')
  .split('\n')[765].trim()

const ending = line.slice(line.indexOf('pfGo(id)'))
const suffix = ending.slice('pfGo(id)'.length)
console.log('suffix:', JSON.stringify(suffix))
console.log('regex:', /\}\}\)\}\)\);/.test(suffix))

// Try matching whole block with flexible ending
const r = /function pfGo\(id\)\{if\(!id\|\|id==='top'\)return;var el=document\.getElementById\(id\);if\(!el\)return;document\.querySelectorAll\('\.reveal'\)\.forEach\(r=>r\.classList\.add\('show'\)\);if\(typeof closeNav==='function'\)closeNav\(\);var nav=document\.querySelector\('nav'\),off=\(nav\?nav\.offsetHeight:72\)\+12,y=el\.getBoundingClientRect\(\)\.top\+window\.scrollY-off;window\.scrollTo\(\{top:Math\.max\(0,y\),behavior:'smooth'\}\)\} document\.querySelectorAll\('a\[href\^="#"\]'\)\.forEach\(a=>\{a\.addEventListener\('click',e=>\{const h=a\.getAttribute\('href'\);if\(!h\|\|h==='#'\|\|h==='#top'\)return;const id=h\.slice\(1\);if\(document\.getElementById\(id\)\)\{e\.preventDefault\(\);pfGo\(id\)\}\}\)\}\);/
console.log('exact match:', r.test(line))
