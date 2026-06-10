import { createContext, useContext, useState } from 'react'
import { BUILDER_PROJECT_LIMIT, emptyBuilderProject } from '../lib/builderProjects.js'

const BuilderContext = createContext(null)

export const SOCIAL_PRESETS = {
  developer: [
    { id: 'github', name: 'GitHub', color: '#1a1a2e', abbr: 'GH' },
    { id: 'linkedin', name: 'LinkedIn', color: '#0077b5', abbr: 'LI' },
    { id: 'twitter', name: 'X / Twitter', color: '#14171a', abbr: 'X' },
    { id: 'stackoverflow', name: 'Stack Overflow', color: '#f48024', abbr: 'SO' },
    { id: 'devto', name: 'Dev.to', color: '#0a0a0a', abbr: 'DV' },
    { id: 'codepen', name: 'CodePen', color: '#131417', abbr: 'CP' },
    { id: 'hashnode', name: 'Hashnode', color: '#2962ff', abbr: 'HN' },
    { id: 'youtube', name: 'YouTube', color: '#ff0000', abbr: 'YT' },
  ],
  designer: [
    { id: 'dribbble', name: 'Dribbble', color: '#ea4c89', abbr: 'DR' },
    { id: 'behance', name: 'Behance', color: '#1769ff', abbr: 'BE' },
    { id: 'linkedin', name: 'LinkedIn', color: '#0077b5', abbr: 'LI' },
    { id: 'twitter', name: 'X / Twitter', color: '#14171a', abbr: 'X' },
    { id: 'figmacommunity', name: 'Figma Community', color: '#f24e1e', abbr: 'FG' },
    { id: 'instagram', name: 'Instagram', color: '#e1306c', abbr: 'IG' },
    { id: 'pinterest', name: 'Pinterest', color: '#e60023', abbr: 'PT' },
    { id: 'artstation', name: 'ArtStation', color: '#13aff0', abbr: 'AS' },
  ],
  doctor: [
    { id: 'linkedin', name: 'LinkedIn', color: '#0077b5', abbr: 'LI' },
    { id: 'twitter', name: 'X / Twitter', color: '#14171a', abbr: 'X' },
    { id: 'researchgate', name: 'ResearchGate', color: '#00d0af', abbr: 'RG' },
    { id: 'googlescholar', name: 'Google Scholar', color: '#4285f4', abbr: 'GS' },
    { id: 'orcid', name: 'ORCID', color: '#a6ce39', abbr: 'OR' },
  ],
  student: [
    { id: 'linkedin', name: 'LinkedIn', color: '#0077b5', abbr: 'LI' },
    { id: 'github', name: 'GitHub', color: '#1a1a2e', abbr: 'GH' },
    { id: 'twitter', name: 'X / Twitter', color: '#14171a', abbr: 'X' },
    { id: 'instagram', name: 'Instagram', color: '#e1306c', abbr: 'IG' },
    { id: 'youtube', name: 'YouTube', color: '#ff0000', abbr: 'YT' },
  ],
  other: [
    { id: 'linkedin', name: 'LinkedIn', color: '#0077b5', abbr: 'LI' },
    { id: 'twitter', name: 'X / Twitter', color: '#14171a', abbr: 'X' },
    { id: 'instagram', name: 'Instagram', color: '#e1306c', abbr: 'IG' },
    { id: 'youtube', name: 'YouTube', color: '#ff0000', abbr: 'YT' },
    { id: 'facebook', name: 'Facebook', color: '#1877f2', abbr: 'FB' },
    { id: 'website', name: 'Website', color: '#4f8cff', abbr: 'WB' },
  ],
}

const initForm = {
  // Step 1
  role: null,        // developer | designer | doctor | student | other
  subRole: '',       // e.g. "Cardiologist", "Computer Science Student"

  // Step 2 — basics
  name: '',
  email: '',
  phone: '',
  location: '',
  headline: '',
  bio: '',
  avatar: '',

  // Developer specific
  github: '',
  skills: [],

  // Designer specific
  dribbble: '',
  behance: '',
  designTools: [],

  // Doctor specific
  specialization: '',
  hospital: '',
  medicalLicense: '',
  publications: '',

  // Student specific
  university: '',
  degree: '',
  graduationYear: '',
  cgpa: '',

  // Other
  profession: '',
  organization: '',
  website: '',

  // Step 3 — socials
  selectedSocials: [],   // array of social ids
  socialUrls: {},        // { github: 'https://...', ... }
  customSocials: [],     // [{ name, url }]

  // Step 4 — projects (developer / designer, max 3)
  projects: [],

  // Step 5 — theme (developer / designer)
  selectedTheme: null,

  // Step 4/5 — finalize
  themePreference: 'auto',
  adminUser: 'admin',
  adminPass: '',

  // Skipped fields
  skipped: {},
}

export function BuilderProvider({ children }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(initForm)
  const [generatedHTML, setGeneratedHTML] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const updateForm = (updates) => setForm(f => ({ ...f, ...updates }))
  const skipField = (field) => setForm(f => ({ ...f, skipped: { ...f.skipped, [field]: true } }))
  const unskipField = (field) => setForm(f => { const s = { ...f.skipped }; delete s[field]; return { ...f, skipped: s } })
  const isSkipped = (field) => !!form.skipped[field]

  const toggleSocial = (id) => {
    setForm(f => {
      const has = f.selectedSocials.includes(id)
      return { ...f, selectedSocials: has ? f.selectedSocials.filter(x => x !== id) : [...f.selectedSocials, id] }
    })
  }
  const setSocialUrl = (id, url) => setForm(f => ({ ...f, socialUrls: { ...f.socialUrls, [id]: url } }))
  const addCustomSocial = (name, url) => setForm(f => ({ ...f, customSocials: [...f.customSocials, { name, url }] }))
  const removeCustomSocial = (i) => setForm(f => ({ ...f, customSocials: f.customSocials.filter((_, idx) => idx !== i) }))
  const addSkill = (skill) => setForm(f => ({ ...f, skills: f.skills.includes(skill) ? f.skills : [...f.skills, skill] }))
  const removeSkill = (skill) => setForm(f => ({ ...f, skills: f.skills.filter(s => s !== skill) }))
  const addDesignTool = (tool) => setForm(f => ({ ...f, designTools: f.designTools.includes(tool) ? f.designTools : [...f.designTools, tool] }))
  const removeDesignTool = (tool) => setForm(f => ({ ...f, designTools: f.designTools.filter(s => s !== tool) }))

  const addProject = () => setForm((f) => {
    const list = f.projects || []
    if (list.length >= BUILDER_PROJECT_LIMIT) return f
    return {
      ...f,
      projects: [...list, emptyBuilderProject(f.role)],
    }
  })

  const updateProject = (index, updates) => setForm((f) => {
    const list = [...(f.projects || [])]
    if (!list[index]) return f
    list[index] = { ...list[index], ...updates }
    return { ...f, projects: list }
  })

  const removeProject = (index) => setForm((f) => ({
    ...f,
    projects: (f.projects || []).filter((_, i) => i !== index),
  }))

  const reset = () => { setForm(initForm); setStep(1); setGeneratedHTML(null) }

  return (
    <BuilderContext.Provider value={{
      step, setStep,
      form, updateForm, skipField, unskipField, isSkipped,
      toggleSocial, setSocialUrl, addCustomSocial, removeCustomSocial,
      addSkill, removeSkill, addDesignTool, removeDesignTool,
      addProject, updateProject, removeProject,
      generatedHTML, setGeneratedHTML,
      isGenerating, setIsGenerating,
      reset,
    }}>
      {children}
    </BuilderContext.Provider>
  )
}

export const useBuilder = () => useContext(BuilderContext)
