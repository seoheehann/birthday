import React, { useState } from 'react'
import BirthdayUpdate from './components/BirthdayUpdate'
import Welcome from './components/Welcome'
import Timeline from './components/Timeline'
import DongshinManual from './components/DongshinManual'
import Quiz from './components/Quiz'
import RandomMemory from './components/RandomMemory'
import CouponWallet from './components/CouponWallet'
import FinalGift from './components/FinalGift'
import BirthdayLetter from './components/BirthdayLetter'
import BottomNav from './components/BottomNav'

export default function App() {
  const [step, setStep] = useState(2)

  const goTo = (n) => setStep(n)

  return (
    <div className="app-shell">
      <div className="mobile-frame">
        {step === 1 && <BirthdayUpdate onComplete={() => goTo(2)} />}
        {step === 2 && <Welcome onStart={() => goTo(3)} />}
        {step === 3 && <Timeline onNext={() => goTo(4)} />}
        {step === 4 && <DongshinManual onNext={() => goTo(5)} />}
        {step === 5 && <Quiz onNext={() => goTo(6)} />}
        {step === 6 && <RandomMemory onNext={() => goTo(7)} />}
        {step === 7 && <CouponWallet onNext={() => goTo(8)} />}
        {step === 8 && <FinalGift onOpen={() => goTo(9)} />}
        {step === 9 && <BirthdayLetter />}
      </div>

      {step > 2 && step < 9 && (
        <BottomNav current={step} onNavigate={goTo} />
      )}
    </div>
  )
}
