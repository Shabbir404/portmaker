import { useApp } from '../../context/AppContext'
import { useBuilder } from '../../context/BuilderContext'
import { useEffect, useMemo } from 'react'
import { Stepper } from '../../components/UI'
import Step1Role from './Step1Role'
import Step2Details from './Step2Details'
import Step3Socials from './Step3Socials'
import Step4Theme from './Step4Theme'
import Step4Finalize from './Step4Finalize'

export default function Builder() {
  const { user, setModal } = useApp()
  const { step, form } = useBuilder()

  const isDeveloper = form.role === 'developer'

  const steps = useMemo(
    () => (isDeveloper
      ? ['Choose Role', 'Your Details', 'Social Links', 'Select Theme', 'Generate']
      : ['Choose Role', 'Your Details', 'Social Links', 'Generate']),
    [isDeveloper]
  )

  useEffect(() => {
    if (!user) setModal('login')
  }, [user, setModal])

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 md:px-10">
      <div className={`mx-auto ${isDeveloper ? 'max-w-3xl' : 'max-w-2xl'}`}>
        <div className="mb-2">
          <Stepper steps={steps} current={step} />
        </div>

        {step === 1 && <Step1Role totalSteps={steps.length} />}
        {step === 2 && <Step2Details totalSteps={steps.length} />}
        {step === 3 && <Step3Socials totalSteps={steps.length} isDeveloper={isDeveloper} />}
        {step === 4 && (isDeveloper ? <Step4Theme /> : <Step4Finalize totalSteps={steps.length} />)}
        {step === 5 && isDeveloper && <Step4Finalize totalSteps={steps.length} />}
      </div>
    </div>
  )
}
