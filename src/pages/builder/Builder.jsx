import { useApp } from '../../context/AppContext'
import { useBuilder } from '../../context/BuilderContext'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { Stepper } from '../../components/UI'
import Step1Role from './Step1Role'
import Step2Details from './Step2Details'
import Step3Socials from './Step3Socials'
import Step4Finalize from './Step4Finalize'

const STEPS = ['Choose Role', 'Your Details', 'Social Links', 'Generate']

export default function Builder() {
  const { user, setModal } = useApp()
  const { step } = useBuilder()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) setModal('login')
  }, [user])

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 md:px-10">
      <div className="max-w-2xl mx-auto">

        {/* Stepper */}
        <div className="mb-2">
          <Stepper steps={STEPS} current={step} />
        </div>

        {/* Step content */}
        {step === 1 && <Step1Role />}
        {step === 2 && <Step2Details />}
        {step === 3 && <Step3Socials />}
        {step === 4 && <Step4Finalize />}
      </div>
    </div>
  )
}
