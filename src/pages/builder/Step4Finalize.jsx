import { useBuilder } from '../../context/BuilderContext'
import { useApp } from '../../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { Input, PasswordInput, Select, Alert } from '../../components/UI'
import { ChevronLeft, Sparkles, Shield, Palette, ExternalLink } from 'lucide-react'

const THEMES = [
  { value: 'auto', label: 'Auto — AI picks the best theme for your role' },
  { value: 'dark', label: 'Dark / Moody — deep backgrounds, neon accents' },
  { value: 'light', label: 'Light / Clean — white space, minimal, elegant' },
  { value: 'colorful', label: 'Bold / Colorful — vibrant gradients, high energy' },
  { value: 'glass', label: 'Glassmorphic — frosted glass, blur effects' },
  { value: 'retro', label: 'Retro / Terminal — monospace, pixel, vintage' },
]

export default function Step4Finalize() {
  const { form, updateForm, setIsGenerating, setGeneratedHTML, setStep } = useBuilder()
  const { addToast } = useApp()
  const navigate = useNavigate()

  const u = (k) => (e) => updateForm({ [k]: e.target.value })

  const handleGenerate = async () => {
    if (!form.name.trim()) {
      addToast('Please go back and enter your name', 'error')
      return
    }
    if (!form.adminPass.trim()) {
      addToast('Please set an admin panel password', 'error')
      return
    }

    setIsGenerating(true)
    navigate('/preview')

    // In Phase 3 this will call the template engine
    // For now it's a placeholder with a demo HTML
    await new Promise(r => setTimeout(r, 2200))
    setGeneratedHTML(getDemoHTML(form))
    setIsGenerating(false)
    addToast('Portfolio generated! 🎉', 'success')
  }

  const roleLabel = { developer: 'Developer', designer: 'Designer', doctor: 'Doctor', student: 'Student', other: 'Professional' }

  return (
    <div className="animate-fade-up">
      <div className="mb-8">
        <p className="text-xs font-mono text-accent-2 mb-2">// step 4 of 4</p>
        <h2 className="font-syne text-3xl font-bold text-ink">Finalize & Generate</h2>
        <p className="text-ink-2 text-sm mt-2">
          Set your theme preference and admin panel credentials, then hit Generate.
        </p>
      </div>

      {/* Summary card */}
      <div className="rounded-2xl p-4 mb-5 flex items-center gap-4"
        style={{ background: 'rgba(79,140,255,0.06)', border: '1px solid rgba(79,140,255,0.15)' }}>
        <div className="text-3xl">{
          form.role === 'developer' ? '⌨️' : form.role === 'designer' ? '🎨' :
          form.role === 'doctor' ? '🩺' : form.role === 'student' ? '🎓' : '✦'
        }</div>
        <div>
          <p className="font-semibold text-ink text-sm">{form.name || 'Your Portfolio'}</p>
          <p className="text-xs text-ink-2">{roleLabel[form.role]} Portfolio · {form.skills?.length || 0} skills · {(form.selectedSocials?.length || 0) + (form.customSocials?.length || 0)} social links</p>
        </div>
        <button onClick={() => setStep(1)}
          className="ml-auto text-xs text-accent-2 hover:text-accent transition underline underline-offset-2 shrink-0">
          Edit
        </button>
      </div>

      <div className="flex flex-col gap-4">

        {/* Theme */}
        <div className="card-surface rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Palette size={16} className="text-violet-forge" />
            <p className="text-sm font-semibold text-ink">Design Theme</p>
          </div>
          <Select
            label="Color & Style Preference"
            options={THEMES}
            value={form.themePreference}
            onChange={u('themePreference')}
            hint="In Phase 3, you'll also preview and pick from matching templates."
          />
        </div>

        {/* Admin Panel */}
        <div className="rounded-2xl p-5"
          style={{ background: 'rgba(167,139,250,0.05)', border: '1px solid rgba(167,139,250,0.18)' }}>
          <div className="flex items-center gap-2 mb-1">
            <Shield size={16} className="text-violet-forge" />
            <p className="text-sm font-semibold" style={{ color: '#c4b5fd' }}>Admin Panel Access</p>
          </div>
          <p className="text-xs text-ink-3 mb-4">
            These credentials unlock the admin panel inside your generated portfolio, where you can add and manage your projects after deployment.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Admin Username" placeholder="admin" value={form.adminUser} onChange={u('adminUser')} />
            <PasswordInput label="Admin Password *" placeholder="Create a strong password"
              value={form.adminPass} onChange={u('adminPass')}
              hint="Min 6 characters. You'll need this to log into your portfolio's admin." />
          </div>
          <Alert type="warning" className="mt-3">
            <span className="text-xs">⚠️ Save these credentials. They'll be embedded in your portfolio's <code>.env</code> and the downloaded ZIP's README.</span>
          </Alert>
        </div>

        {/* Gemini (optional for Phase 1) */}
        <div className="card-surface rounded-2xl p-5">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-amber-forge" />
              <p className="text-sm font-semibold text-ink">AI Content Enhancement</p>
            </div>
            <span className="badge badge-amber text-xs">Optional</span>
          </div>
          <p className="text-xs text-ink-3 mb-3">
            Paste a Gemini API key to let AI enhance your bio, suggest section copy, and personalize descriptions. Templates work perfectly without it.
          </p>
          <PasswordInput label="Gemini API Key" placeholder="AIza..."
            value={form.geminiKey} onChange={u('geminiKey')} />
          <a href="https://aistudio.google.com" target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs text-accent hover:text-accent-2 transition mt-2">
            Get a free key at aistudio.google.com <ExternalLink size={11} />
          </a>
        </div>
      </div>

      {/* Generate CTA */}
      <div className="mt-8 rounded-3xl p-6 text-center"
        style={{ background: 'linear-gradient(135deg, rgba(79,140,255,0.08), rgba(167,139,250,0.08))', border: '1px solid rgba(79,140,255,0.2)' }}>
        <p className="text-sm text-ink-2 mb-4">Everything looks good? Let's build your portfolio.</p>
        <button onClick={handleGenerate}
          className="btn-primary px-8 py-4 text-base gap-2 rounded-2xl"
          style={{ boxShadow: '0 0 40px rgba(79,140,255,0.3)' }}>
          <Sparkles size={18} /> Generate My Portfolio
        </button>
      </div>

      {/* Back */}
      <div className="flex justify-start mt-5">
        <button onClick={() => setStep(3)} className="btn-ghost px-6 py-3 gap-2">
          <ChevronLeft size={16} /> Back
        </button>
      </div>
    </div>
  )
}

// Placeholder demo HTML until Phase 3 template engine
function getDemoHTML(form) {
  const name = form.name || 'Your Name'
  const headline = form.headline || (
    form.role === 'developer' ? 'Full-Stack Developer & Problem Solver' :
    form.role === 'designer' ? 'UI/UX Designer crafting beautiful experiences' :
    form.role === 'doctor' ? 'Dedicated Medical Professional' :
    form.role === 'student' ? 'Student & Aspiring Professional' : 'Professional'
  )
  const bio = form.bio || `Hi, I'm ${name}. Welcome to my portfolio.`
  const skills = form.skills?.slice(0,8) || []
  const accentColor = form.role === 'developer' ? '#4f8cff' : form.role === 'designer' ? '#f472b6' : form.role === 'doctor' ? '#22d3a0' : form.role === 'student' ? '#a78bfa' : '#fbbf24'

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${name} — Portfolio</title>
<script src="https://cdn.tailwindcss.com"><\/script>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@400;500&display=swap" rel="stylesheet">
<style>
body { font-family: 'DM Sans', sans-serif; background: #060b14; color: #e8edf7; }
.syne { font-family: 'Syne', sans-serif; }
::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-thumb { background: #2a3550; border-radius: 3px; }
</style>
</head>
<body class="min-h-screen">
<nav class="fixed top-0 w-full z-50 flex items-center justify-between px-8 py-4 backdrop-blur-xl" style="background:rgba(6,11,20,0.85);border-bottom:1px solid rgba(255,255,255,0.07)">
  <span class="syne font-bold text-lg" style="color:${accentColor}">${name.split(' ')[0]}<span style="color:#e8edf7">.dev</span></span>
  <div class="hidden md:flex gap-6 text-sm text-gray-400">
    <a href="#about" class="hover:text-white transition">About</a>
    ${form.role === 'developer' || form.role === 'student' ? '<a href="#skills" class="hover:text-white transition">Skills</a>' : ''}
    <a href="#work" class="hover:text-white transition">Work</a>
    <a href="#contact" class="hover:text-white transition">Contact</a>
  </div>
  <a href="#contact" class="text-xs px-4 py-2 rounded-full font-medium transition" style="background:${accentColor}22;border:1px solid ${accentColor}44;color:${accentColor}">
    Hire Me
  </a>
</nav>

<section class="min-h-screen flex items-center justify-center px-8 pt-20">
  <div class="max-w-3xl w-full text-center">
    <div class="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full text-xs font-medium" style="background:${accentColor}15;border:1px solid ${accentColor}30;color:${accentColor}">
      <span class="w-1.5 h-1.5 rounded-full animate-pulse" style="background:${accentColor}"></span>
      Available for ${form.role === 'doctor' ? 'consultations' : 'opportunities'}
    </div>
    <h1 class="syne text-5xl md:text-7xl font-black tracking-tight mb-5" style="line-height:1.05">
      Hi, I'm <span style="color:${accentColor}">${name}</span>
    </h1>
    <p class="text-xl text-gray-400 mb-4">${headline}</p>
    <p class="text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">${bio}</p>
    <div class="flex items-center justify-center gap-4 flex-wrap">
      <a href="#work" class="px-7 py-3.5 rounded-xl font-medium text-sm text-white transition" style="background:${accentColor}">View My Work</a>
      <a href="#contact" class="px-7 py-3.5 rounded-xl font-medium text-sm transition" style="border:1px solid rgba(255,255,255,0.12);color:#8a9bbf">Get in Touch</a>
    </div>
  </div>
</section>

${skills.length > 0 ? `
<section id="skills" class="py-20 px-8" style="background:rgba(255,255,255,0.02);border-top:1px solid rgba(255,255,255,0.06);border-bottom:1px solid rgba(255,255,255,0.06)">
  <div class="max-w-4xl mx-auto">
    <h2 class="syne text-3xl font-bold mb-10 text-center">Skills & Technologies</h2>
    <div class="flex flex-wrap justify-center gap-3">
      ${skills.map(s => `<span class="px-5 py-2.5 rounded-xl text-sm font-medium" style="background:${accentColor}12;border:1px solid ${accentColor}25;color:${accentColor}">${s}</span>`).join('')}
    </div>
  </div>
</section>` : ''}

<section id="work" class="py-20 px-8">
  <div class="max-w-5xl mx-auto">
    <h2 class="syne text-3xl font-bold mb-3 text-center">Featured Work</h2>
    <p class="text-gray-500 text-center mb-12 text-sm">Projects and work samples — managed via admin panel</p>
    <div class="grid md:grid-cols-3 gap-5" id="projects-grid">
      ${[1,2,3].map(i => `
      <div class="rounded-2xl overflow-hidden transition hover:-translate-y-1" style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08)">
        <div class="h-44 flex items-center justify-center text-4xl" style="background:${accentColor}0a">${form.role === 'developer' ? '💻' : form.role === 'designer' ? '🎨' : form.role === 'doctor' ? '🩺' : '📁'}</div>
        <div class="p-5">
          <h3 class="font-semibold text-sm mb-1.5">Project ${i} <span class="text-xs text-gray-600">[placeholder]</span></h3>
          <p class="text-xs text-gray-500 leading-relaxed">Add your project details via the admin panel after deployment.</p>
        </div>
      </div>`).join('')}
    </div>
  </div>
</section>

<section id="contact" class="py-20 px-8" style="border-top:1px solid rgba(255,255,255,0.06)">
  <div class="max-w-xl mx-auto text-center">
    <h2 class="syne text-3xl font-bold mb-3">Let's Connect</h2>
    <p class="text-gray-500 text-sm mb-8">Open to ${form.role === 'doctor' ? 'consultations and collaborations' : 'new opportunities and collaborations'}.</p>
    ${form.email ? `<a href="mailto:${form.email}" class="inline-block px-8 py-4 rounded-xl font-medium text-sm text-white transition" style="background:${accentColor}">${form.email}</a>` : ''}
    <div class="flex justify-center gap-4 mt-6 flex-wrap">
      ${form.selectedSocials?.map(id => {
        const url = form.socialUrls?.[id]
        return url ? `<a href="${url}" target="_blank" class="text-xs px-4 py-2 rounded-full transition" style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);color:#8a9bbf">${id}</a>` : ''
      }).join('') || ''}
    </div>
  </div>
</section>

<footer class="py-6 text-center text-xs text-gray-700" style="border-top:1px solid rgba(255,255,255,0.05)">
  ${name} · Generated by PortfolioForge · Admin: <a href="?admin=1" style="color:${accentColor}33">Panel</a>
</footer>

<script>
const ADMIN_USER = '${form.adminUser || 'admin'}';
const ADMIN_PASS = '${form.adminPass || 'admin123'}';
let adminLoggedIn = false;
if (window.location.search.includes('admin=1')) {
  const u = prompt('Admin Username:'); const p = prompt('Admin Password:');
  if (u === ADMIN_USER && p === ADMIN_PASS) {
    adminLoggedIn = true;
    document.body.insertAdjacentHTML('beforeend', \`
    <div style="position:fixed;inset:0;z-index:999;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.85);backdrop-filter:blur(8px)">
      <div style="background:#0d1526;border:1px solid rgba(255,255,255,0.12);border-radius:20px;padding:32px;width:480px;max-width:90vw">
        <h2 style="font-size:20px;font-weight:700;margin-bottom:4px;color:#e8edf7">Admin Panel</h2>
        <p style="font-size:13px;color:#8a9bbf;margin-bottom:20px">Add and manage your projects</p>
        <input id="proj-title" placeholder="Project title" style="width:100%;padding:10px 14px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:10px;color:#e8edf7;font-size:14px;margin-bottom:10px;outline:none">
        <textarea id="proj-desc" placeholder="Project description" style="width:100%;padding:10px 14px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:10px;color:#e8edf7;font-size:14px;margin-bottom:10px;outline:none;resize:none;height:80px"></textarea>
        <input id="proj-img" placeholder="Image URL (optional)" style="width:100%;padding:10px 14px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:10px;color:#e8edf7;font-size:14px;margin-bottom:16px;outline:none">
        <div style="display:flex;gap:8px">
          <button onclick="saveProject()" style="flex:1;padding:11px;background:${accentColor};border:none;border-radius:10px;color:white;font-weight:600;cursor:pointer;font-size:14px">Save Project</button>
          <button onclick="this.closest('div[style]').remove()" style="padding:11px 16px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:10px;color:#8a9bbf;cursor:pointer;font-size:14px">Close</button>
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
  document.querySelector('div[style*="position:fixed"]').remove();
}
function renderProjects() {
  const projects = JSON.parse(localStorage.getItem('pf_projects') || '[]');
  if (!projects.length) return;
  const grid = document.getElementById('projects-grid');
  grid.innerHTML = projects.map(p => \`
    <div style="border-radius:16px;overflow:hidden;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08)">
      \${p.img ? \`<img src="\${p.img}" style="width:100%;height:176px;object-fit:cover">\` : \`<div style="height:176px;background:${accentColor}0a;display:flex;align-items:center;justify-content:center;font-size:36px">📁</div>\`}
      <div style="padding:20px">
        <h3 style="font-weight:600;font-size:14px;margin-bottom:6px;color:#e8edf7">\${p.title}</h3>
        <p style="font-size:12px;color:#4a5a7a;line-height:1.5">\${p.desc}</p>
      </div>
    </div>\`).join('');
}
renderProjects();
<\/script>
</body>
</html>`
}
