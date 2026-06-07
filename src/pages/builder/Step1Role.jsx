import { useBuilder } from '../../context/BuilderContext'
import { ChevronRight } from 'lucide-react'

const ROLES = [
  {
    id: 'developer',
    emoji: '⌨️',
    title: 'Developer',
    desc: 'Software engineer, full-stack, mobile, backend, or any code-focused role',
    color: '#4f8cff',
    tags: ['GitHub', 'Skills', 'Projects'],
  },
  {
    id: 'designer',
    emoji: '🎨',
    title: 'Designer',
    desc: 'UI/UX, graphic, product, motion, or visual designer',
    color: '#f472b6',
    tags: ['Dribbble', 'Behance', 'Portfolio'],
  },
  {
    id: 'doctor',
    emoji: '🩺',
    title: 'Doctor / Medical',
    desc: 'Physician, surgeon, researcher, or any healthcare professional',
    color: '#22d3a0',
    tags: ['Publications', 'Specialization', 'Hospital'],
  },
  {
    id: 'student',
    emoji: '🎓',
    title: 'Student',
    desc: 'University student, fresher, intern, or recent graduate',
    color: '#a78bfa',
    tags: ['University', 'Projects', 'CGPA'],
  },
  {
    id: 'other',
    emoji: '✦',
    title: 'Other',
    desc: 'Researcher, marketer, lawyer, consultant, or anything else',
    color: '#fbbf24',
    tags: ['Custom fields', 'Flexible', 'Any role'],
  },
]

export default function Step1Role({ totalSteps = 4 }) {
  const { form, updateForm, setStep } = useBuilder()

  const handleNext = () => {
    if (!form.role) return
    setStep(2)
  }

  return (
    <div className="animate-fade-up">
      <div className="mb-8">
        <p className="text-xs font-mono text-accent-2 mb-2">// step 1 of {totalSteps}</p>
        <h2 className="font-syne text-3xl font-bold text-ink">What best describes you?</h2>
        <p className="text-ink-2 text-sm mt-2">
          We'll match you to the right templates and customize your form fields.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
        {ROLES.map(r => (
          <button
            key={r.id}
            type="button"
            onClick={() => updateForm({ role: r.id, selectedTheme: r.id === 'developer' ? form.selectedTheme : null })}
            className={`role-card text-left ${form.role === r.id ? 'selected' : ''}`}
            style={form.role === r.id ? { borderColor: r.color, background: `${r.color}0e`, boxShadow: `0 0 0 3px ${r.color}18` } : {}}
          >
            <div className="flex items-start gap-4 w-full">
              <div className="text-3xl w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${r.color}14`, border: `1px solid ${r.color}25` }}>
                {r.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-syne font-semibold text-ink text-base">{r.title}</h3>
                  {form.role === r.id && (
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: r.color }}>
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-ink-2 mt-1 leading-relaxed">{r.desc}</p>
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {r.tags.map(tag => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: `${r.color}12`, color: r.color, border: `1px solid ${r.color}22` }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleNext}
          disabled={!form.role}
          className={`btn-primary px-7 py-3 gap-2 transition-all ${!form.role ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
          Continue <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
