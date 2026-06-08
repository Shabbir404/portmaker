import fs from 'fs'
import { injectPortfolioNavFix } from '../src/utils/portfolioNavFix.js'

const html = fs.readFileSync('./src/templates/developer/dev-3d/dev_3d_template.html', 'utf8')
const out = injectPortfolioNavFix(html)

console.log('onclick about:', out.includes("pfGo('section-about')"))
console.log('old hash about:', out.includes('href="#section-about"'))
console.log('old pfGo one-liner:', out.includes('var nav=document.querySelector'))
console.log('pfGo count:', (out.match(/function pfGo/g) || []).length)
console.log('nav fix injected:', out.includes('data-pf-nav-fix'))
