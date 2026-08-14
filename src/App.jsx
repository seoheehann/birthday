import React, { useState } from 'react'
import Welcome from './components/Welcome'
import Timeline from './components/Timeline'

export default function App() {
  const [step, setStep] = useState(2)

  const goTo = (n) => setStep(n)

  return (
    <div className="app-shell">
      <div className="mobile-frame">
        {step === 2 && <Welcome onStart={() => goTo(3)} />}
        {step === 3 && <Timeline onNext={() => goTo(2)} />}
      </div>
    </div>
  )
}
