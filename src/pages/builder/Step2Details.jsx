import { useBuilder } from '../../context/BuilderContext'
import { Input, Textarea, SkillsInput, PhotoUpload } from '../../components/UI'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const DESIGN_TOOLS = ['Figma', 'Adobe XD', 'Sketch', 'Illustrator', 'Photoshop', 'InVision', 'Framer', 'Canva', 'Blender', 'After Effects']

export default function Step2Details({ totalSteps = 4 }) {
  const {
    form, updateForm, skipField, unskipField, isSkipped,
    addSkill, removeSkill, addDesignTool, removeDesignTool,
    setStep,
  } = useBuilder()

  const u = (k) => (e) => updateForm({ [k]: e.target.value })

  return (
    <div className="animate-fade-up">
      <div className="mb-8">
        <p className="text-xs font-mono text-accent-2 mb-2">// step 2 of {totalSteps}</p>
        <h2 className="font-syne text-3xl font-bold text-ink">
          {form.role === 'developer' && 'Developer Details'}
          {form.role === 'designer' && 'Designer Details'}
          {form.role === 'doctor' && 'Professional Details'}
          {form.role === 'student' && 'Student Details'}
          {form.role === 'other' && 'Your Details'}
        </h2>
        <p className="text-ink-2 text-sm mt-2">
          Only your <strong className="text-ink">name</strong> is required. Everything else is optional — use "Prefer not to" to skip any field.
        </p>
      </div>

      <div className="flex flex-col gap-5">

        {/* ── BASICS (all roles) ── */}
        <div className="card-surface rounded-2xl p-5 flex flex-col gap-4">
          <p className="text-xs font-semibold text-ink-2 uppercase tracking-widest">Basic Information</p>

          <Input label="Full Name *" placeholder="Your full name" value={form.name} onChange={u('name')} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Email Address" placeholder="you@example.com" type="email"
              skip skipped={isSkipped('email')} onSkip={() => skipField('email')} onUnskip={() => unskipField('email')}
              value={form.email} onChange={u('email')} />
            <Input label="Phone" placeholder="+880 1XX XXX XXXX"
              skip skipped={isSkipped('phone')} onSkip={() => skipField('phone')} onUnskip={() => unskipField('phone')}
              value={form.phone} onChange={u('phone')} />
          </div>

          <Input label="Location" placeholder="Dhaka, Bangladesh"
            skip skipped={isSkipped('location')} onSkip={() => skipField('location')} onUnskip={() => unskipField('location')}
            value={form.location} onChange={u('location')} />

          <Input label="Headline / Tagline" placeholder={
            form.role === 'developer' ? 'Full-Stack Developer & Open Source Enthusiast' :
            form.role === 'designer' ? 'UI/UX Designer crafting delightful digital experiences' :
            form.role === 'doctor' ? 'Senior Cardiologist · MBBS, MD · 10+ Years Experience' :
            form.role === 'student' ? 'CS Student at BUET · Aspiring Software Engineer' :
            'Brief one-liner about what you do'
          }
            skip skipped={isSkipped('headline')} onSkip={() => skipField('headline')} onUnskip={() => unskipField('headline')}
            value={form.headline} onChange={u('headline')} />

          <Textarea label="About / Bio"
            placeholder="Tell the world about yourself, your experience, and what drives you..."
            skip skipped={isSkipped('bio')} onSkip={() => skipField('bio')} onUnskip={() => unskipField('bio')}
            value={form.bio} onChange={u('bio')} />

          <PhotoUpload
            label="Profile Photo"
            value={form.avatar}
            onChange={(dataUrl) => updateForm({ avatar: dataUrl })}
            onClear={() => updateForm({ avatar: '' })}
            skip
            skipped={isSkipped('avatar')}
            onSkip={() => skipField('avatar')}
            onUnskip={() => unskipField('avatar')}
            hint="JPG, PNG, WebP or GIF · max 2 MB · square photos work best"
          />
        </div>

        {/* ── DEVELOPER ── */}
        {form.role === 'developer' && (
          <div className="card-surface rounded-2xl p-5 flex flex-col gap-4">
            <p className="text-xs font-semibold text-ink-2 uppercase tracking-widest">Developer Info</p>
            <Input label="GitHub Profile URL" placeholder="https://github.com/yourusername"
              skip skipped={isSkipped('github')} onSkip={() => skipField('github')} onUnskip={() => unskipField('github')}
              value={form.github} onChange={u('github')} />
            <div>
              <label className="label">Skills & Technologies</label>
              <SkillsInput skills={form.skills} onAdd={addSkill} onRemove={removeSkill}
                placeholder="e.g. React, TypeScript, Node.js, Python — press Enter or comma" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Years of Experience" placeholder="3" type="number"
                skip skipped={isSkipped('yearsExp')} onSkip={() => skipField('yearsExp')} onUnskip={() => unskipField('yearsExp')}
                value={form.yearsExp} onChange={u('yearsExp')} />
              <Input label="Current Role / Job Title" placeholder="Senior Frontend Developer"
                skip skipped={isSkipped('jobTitle')} onSkip={() => skipField('jobTitle')} onUnskip={() => unskipField('jobTitle')}
                value={form.jobTitle} onChange={u('jobTitle')} />
            </div>
            <Input label="Company / Currently Working At" placeholder="Company name or 'Freelance'"
              skip skipped={isSkipped('company')} onSkip={() => skipField('company')} onUnskip={() => unskipField('company')}
              value={form.company} onChange={u('company')} />
          </div>
        )}

        {/* ── DESIGNER ── */}
        {form.role === 'designer' && (
          <div className="card-surface rounded-2xl p-5 flex flex-col gap-4">
            <p className="text-xs font-semibold text-ink-2 uppercase tracking-widest">Designer Info</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Dribbble Profile URL" placeholder="https://dribbble.com/yourname"
                skip skipped={isSkipped('dribbble')} onSkip={() => skipField('dribbble')} onUnskip={() => unskipField('dribbble')}
                value={form.dribbble} onChange={u('dribbble')} />
              <Input label="Behance Profile URL" placeholder="https://behance.net/yourname"
                skip skipped={isSkipped('behance')} onSkip={() => skipField('behance')} onUnskip={() => unskipField('behance')}
                value={form.behance} onChange={u('behance')} />
            </div>
            <Input label="Portfolio / Website URL" placeholder="https://yourwebsite.com"
              skip skipped={isSkipped('website')} onSkip={() => skipField('website')} onUnskip={() => unskipField('website')}
              value={form.website} onChange={u('website')} />
            <Input label="Design Specialization" placeholder="UI/UX Design, Brand Design, Motion Design..."
              skip skipped={isSkipped('designSpec')} onSkip={() => skipField('designSpec')} onUnskip={() => unskipField('designSpec')}
              value={form.designSpec} onChange={u('designSpec')} />
            <div>
              <label className="label">Design Tools</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {DESIGN_TOOLS.map(t => (
                  <button key={t} type="button"
                    onClick={() => form.designTools.includes(t) ? removeDesignTool(t) : addDesignTool(t)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                      form.designTools.includes(t)
                        ? 'border-rose-forge/50 bg-rose-forge/10 text-rose-forge'
                        : 'border-white/10 bg-white/[0.03] text-ink-2 hover:border-white/20'
                    }`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Years of Experience" placeholder="4"
                skip skipped={isSkipped('yearsExp')} onSkip={() => skipField('yearsExp')} onUnskip={() => unskipField('yearsExp')}
                value={form.yearsExp} onChange={u('yearsExp')} />
              <Input label="Current Agency / Company" placeholder="Company or 'Freelance'"
                skip skipped={isSkipped('company')} onSkip={() => skipField('company')} onUnskip={() => unskipField('company')}
                value={form.company} onChange={u('company')} />
            </div>
          </div>
        )}

        {/* ── DOCTOR ── */}
        {form.role === 'doctor' && (
          <div className="card-surface rounded-2xl p-5 flex flex-col gap-4">
            <p className="text-xs font-semibold text-ink-2 uppercase tracking-widest">Medical Professional Info</p>
            <Input label="Specialization" placeholder="Cardiologist, Neurosurgeon, Dermatologist..."
              skip skipped={isSkipped('specialization')} onSkip={() => skipField('specialization')} onUnskip={() => unskipField('specialization')}
              value={form.specialization} onChange={u('specialization')} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Hospital / Clinic" placeholder="Dhaka Medical College Hospital"
                skip skipped={isSkipped('hospital')} onSkip={() => skipField('hospital')} onUnskip={() => unskipField('hospital')}
                value={form.hospital} onChange={u('hospital')} />
              <Input label="Degrees & Qualifications" placeholder="MBBS, MD, FCPS"
                skip skipped={isSkipped('degrees')} onSkip={() => skipField('degrees')} onUnskip={() => unskipField('degrees')}
                value={form.degrees} onChange={u('degrees')} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Years of Experience" placeholder="12"
                skip skipped={isSkipped('yearsExp')} onSkip={() => skipField('yearsExp')} onUnskip={() => unskipField('yearsExp')}
                value={form.yearsExp} onChange={u('yearsExp')} />
              <Input label="Medical License No." placeholder="BMDC: A-XXXXX"
                skip skipped={isSkipped('medicalLicense')} onSkip={() => skipField('medicalLicense')} onUnskip={() => unskipField('medicalLicense')}
                value={form.medicalLicense} onChange={u('medicalLicense')} />
            </div>
            <Input label="Research / Publications" placeholder="Published research, journal articles..."
              skip skipped={isSkipped('publications')} onSkip={() => skipField('publications')} onUnskip={() => unskipField('publications')}
              value={form.publications} onChange={u('publications')} />
            <Input label="Consultation Hours" placeholder="Sat–Thu: 10am–6pm"
              skip skipped={isSkipped('consultationHours')} onSkip={() => skipField('consultationHours')} onUnskip={() => unskipField('consultationHours')}
              value={form.consultationHours} onChange={u('consultationHours')} />
          </div>
        )}

        {/* ── STUDENT ── */}
        {form.role === 'student' && (
          <div className="card-surface rounded-2xl p-5 flex flex-col gap-4">
            <p className="text-xs font-semibold text-ink-2 uppercase tracking-widest">Student Info</p>
            <Input label="University / Institution" placeholder="Bangladesh University of Engineering and Technology"
              skip skipped={isSkipped('university')} onSkip={() => skipField('university')} onUnskip={() => unskipField('university')}
              value={form.university} onChange={u('university')} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Degree" placeholder="BSc in Computer Science & Engineering"
                skip skipped={isSkipped('degree')} onSkip={() => skipField('degree')} onUnskip={() => unskipField('degree')}
                value={form.degree} onChange={u('degree')} />
              <Input label="Graduation Year" placeholder="2025"
                skip skipped={isSkipped('graduationYear')} onSkip={() => skipField('graduationYear')} onUnskip={() => unskipField('graduationYear')}
                value={form.graduationYear} onChange={u('graduationYear')} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="CGPA / Grade" placeholder="3.85 / 4.00"
                skip skipped={isSkipped('cgpa')} onSkip={() => skipField('cgpa')} onUnskip={() => unskipField('cgpa')}
                value={form.cgpa} onChange={u('cgpa')} />
              <Input label="Current Semester / Year" placeholder="7th Semester"
                skip skipped={isSkipped('semester')} onSkip={() => skipField('semester')} onUnskip={() => unskipField('semester')}
                value={form.semester} onChange={u('semester')} />
            </div>
            <div>
              <label className="label">Skills & Interests</label>
              <SkillsInput skills={form.skills} onAdd={addSkill} onRemove={removeSkill}
                placeholder="e.g. Machine Learning, DSA, Web Dev — press Enter" />
            </div>
            <Input label="GitHub (if any)" placeholder="https://github.com/yourusername"
              skip skipped={isSkipped('github')} onSkip={() => skipField('github')} onUnskip={() => unskipField('github')}
              value={form.github} onChange={u('github')} />
          </div>
        )}

        {/* ── OTHER ── */}
        {form.role === 'other' && (
          <div className="card-surface rounded-2xl p-5 flex flex-col gap-4">
            <p className="text-xs font-semibold text-ink-2 uppercase tracking-widest">Professional Info</p>
            <Input label="Profession / Title" placeholder="Researcher, Marketing Manager, Lawyer..."
              value={form.profession} onChange={u('profession')} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Organization / Company" placeholder="Your organization"
                skip skipped={isSkipped('organization')} onSkip={() => skipField('organization')} onUnskip={() => unskipField('organization')}
                value={form.organization} onChange={u('organization')} />
              <Input label="Years of Experience" placeholder="5"
                skip skipped={isSkipped('yearsExp')} onSkip={() => skipField('yearsExp')} onUnskip={() => unskipField('yearsExp')}
                value={form.yearsExp} onChange={u('yearsExp')} />
            </div>
            <Input label="Website / Portfolio" placeholder="https://yourwebsite.com"
              skip skipped={isSkipped('website')} onSkip={() => skipField('website')} onUnskip={() => unskipField('website')}
              value={form.website} onChange={u('website')} />
            <div>
              <label className="label">Skills / Expertise</label>
              <SkillsInput skills={form.skills} onAdd={addSkill} onRemove={removeSkill}
                placeholder="Your key skills and areas of expertise" />
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <div className="flex justify-between mt-8">
        <button onClick={() => setStep(1)} className="btn-ghost px-6 py-3 gap-2">
          <ChevronLeft size={16} /> Back
        </button>
        <button
          onClick={() => { if (!form.name.trim()) { alert('Please enter your name'); return; } setStep(3) }}
          className="btn-primary px-7 py-3 gap-2">
          Continue <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
