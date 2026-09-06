import React, { useEffect, useState } from 'react'
import Welcome from './components/Welcome'
import Timeline from './components/Timeline'
import MiniGameZone from './components/MiniGameZone'
import DailyTicketPopup from './components/DailyTicketPopup'
import { getLocalDateKey, grantDailyFreeTicket, updateStoredRouletteState } from './utils/rouletteStorage'

export default function App() {
  const [step, setStep] = useState(2)
  const [rouletteState, setRouletteState] = useState(() => grantDailyFreeTicket())

  const goTo = (n) => setStep(n)

  function updateRouletteState(updater) {
    const nextState = updateStoredRouletteState(updater)
    setRouletteState(nextState)
    return nextState
  }

  function dismissTicketPopup() {
    const todayKey = getLocalDateKey()
    updateRouletteState(current => ({ ...current, popupDismissedDate: todayKey }))
  }

  useEffect(() => {
    const checkDateChange = () => setRouletteState(grantDailyFreeTicket())
    const intervalId = window.setInterval(checkDateChange, 60000)
    return () => window.clearInterval(intervalId)
  }, [])

  const todayKey = getLocalDateKey()
  const showTicketPopup = step === 2
    && rouletteState.lastFreeTicketDate === todayKey
    && rouletteState.popupDismissedDate !== todayKey

  return (
    <div className="app-shell">
      <div className="mobile-frame">
        {step === 2 && <Welcome onStart={() => goTo(3)} />}
        {step === 3 && <Timeline onNext={() => goTo(4)} />}
        {step === 4 && (
          <MiniGameZone rouletteState={rouletteState} updateRouletteState={updateRouletteState} />
        )}
        {showTicketPopup && <DailyTicketPopup onClose={dismissTicketPopup} />}
      </div>
    </div>
  )
}
