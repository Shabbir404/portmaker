/**
 * Patches portfolio HTML so in-page nav works in preview iframes.
 *
 * Templates use onclick="return pfGo('section-about')" — desktop nav no longer
 * relies on hash links (which scrolled to invisible .reveal sections).
 * In iframes we still force .reveal visible on load because IntersectionObserver
 * often does not fire inside embedded previews.
 */

const NAV_SECTION_IDS = [
  'section-about', 'about', 'skills', 'projects', 'work', 'experience', 'contact', 'hero',
]

const OLD_PF_GO_ONE_LINER =
  "function pfGo(id){if(!id||id==='top')return;var el=document.getElementById(id);if(!el)return;document.querySelectorAll('.reveal').forEach(r=>r.classList.add('show'));if(typeof closeNav==='function')closeNav();var nav=document.querySelector('nav'),off=(nav?nav.offsetHeight:72)+12,y=el.getBoundingClientRect().top+window.scrollY-off;window.scrollTo({top:Math.max(0,y),behavior:'smooth'})} document.querySelectorAll('a[href^=\"#\"]').forEach(a=>{a.addEventListener('click',e=>{const h=a.getAttribute('href');if(!h||h==='#'||h==='#top')return;const id=h.slice(1);if(document.getElementById(id)){e.preventDefault();pfGo(id)}})});"

export function patchNavLinks(html = '') {
  let out = html

  // Legacy hash links → onclick (safe in iframes and standalone)
  NAV_SECTION_IDS.forEach((id) => {
    out = out.replace(
      new RegExp(`href="#${id}"([^>]*?)onclick="closeNav\\(\\)"`, 'g'),
      `href="#" onclick="closeNav();return pfGo('${id}')"$1`
    )
    out = out.replace(new RegExp(`href="#${id}"`, 'g'), `href="#" onclick="return pfGo('${id}')"`)
  })

  if (out.includes(OLD_PF_GO_ONE_LINER)) {
    out = out.replace(
      OLD_PF_GO_ONE_LINER,
      "function pfGo(id){if(!id||id==='top')return false;var el=document.getElementById(id);if(!el)return false;document.querySelectorAll('.reveal').forEach(function(r){r.classList.add('show');r.style.opacity='1';r.style.transform='none';});try{if(typeof closeNav==='function')closeNav();}catch(_){}el.scrollIntoView({behavior:'smooth',block:'start'});return false;}"
    )
  }

  return out
}

export function injectPortfolioNavFix(html = '') {
  if (!html || html.includes('data-pf-nav-fix')) return html

  let out = patchNavLinks(html)

  const css = `<style data-pf-nav-fix>
html{scroll-behavior:smooth;scroll-padding-top:96px;}
section[id]{scroll-margin-top:96px;}
</style>`

  const js = `<script data-pf-nav-fix>
(function(){
  function showAll(){
    document.querySelectorAll('.reveal').forEach(function(el){
      el.classList.add('show');
      el.style.setProperty('opacity','1','important');
      el.style.setProperty('transform','none','important');
    });
  }
  if(window.self!==window.top){showAll();}
  document.addEventListener('click',function(e){
    var link=e.target.closest('a[onclick*="pfGo"]');
    if(!link||window.self===window.top)return;
    setTimeout(showAll,0);
  },false);
})();
<\/script>`

  if (out.includes('</head>')) {
    out = out.replace('</head>', css + '</head>')
  } else {
    out = css + out
  }
  if (out.includes('</body>')) {
    return out.replace('</body>', js + '</body>')
  }
  return out + js
}
