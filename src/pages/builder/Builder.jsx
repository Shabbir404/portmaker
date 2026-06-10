import { useBuilder } from '../../context/BuilderContext'
import { useMemo } from 'react'
import { Stepper } from '../../components/UI'
import Step1Role from './Step1Role'
import Step2Details from './Step2Details'
import Step3Socials from './Step3Socials'
import Step3Projects from './Step3Projects'
import Step4Theme from './Step4Theme'
import Step4Finalize from './Step4Finalize'

export default function Builder() {
  const { step, form } = useBuilder()

  const usesThemePicker = form.role === 'developer' || form.role === 'designer'

  const steps = useMemo(
    () => (usesThemePicker
      ? ['Choose Role', 'Your Details', 'Social Links', 'Your Projects', 'Select Theme', 'Generate']
      : ['Choose Role', 'Your Details', 'Social Links', 'Generate']),
    [usesThemePicker]
  )

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 md:px-10">
      <div className={`mx-auto ${usesThemePicker ? 'max-w-3xl' : 'max-w-2xl'}`}>
        <div className="mb-2">
          <Stepper steps={steps} current={step} />
        </div>

        {step === 1 && <Step1Role totalSteps={steps.length} />}
        {step === 2 && <Step2Details totalSteps={steps.length} />}
        {step === 3 && <Step3Socials totalSteps={steps.length} />}
        {step === 4 && (usesThemePicker ? <Step3Projects totalSteps={steps.length} /> : <Step4Finalize totalSteps={steps.length} />)}
        {step === 5 && usesThemePicker && <Step4Theme />}
        {step === 6 && usesThemePicker && <Step4Finalize totalSteps={steps.length} />}
      </div>
    </div>
  )
}
