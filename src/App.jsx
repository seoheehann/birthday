import React, { useEffect, useState } from 'react'
import Welcome from './components/Welcome'
import Timeline from './components/Timeline'
import MiniGameZone from './components/MiniGameZone'
import DailyTicketPopup from './components/DailyTicketPopup'
import MockExamAdmin from './components/MockExamAdmin'
import { getLocalDateKey, grantDailyFreeTicket, updateStoredRouletteState, writeRouletteState } from './utils/rouletteStorage'
import { migrateLegacyState, savePlayerState } from './utils/cloudSync'

export default function App() {
  if (new URLSearchParams(window.location.search).get('admin') === '1') {
    return <MockExamAdmin />
  }

  const [step, setStep] = useState(2)
  const [rouletteState, setRouletteState] = useState(() => grantDailyFreeTicket())
  const [cloudPlayerState, setCloudPlayerState] = useState(null)
  const [cloudSyncReady, setCloudSyncReady] = useState(false)

  const goTo = (n) => setStep(n)

  function updateRouletteState(updater) {
    const nextState = updateStoredRouletteState(updater)
    setRouletteState(nextState)
    if (cloudSyncReady) {
      let points = 0
      let purchasedCoupons = []
      let usedCouponIds = []
      try {
        points = Math.max(0, Number.parseInt(localStorage.getItem('miniPoints') || '0', 10) || 0)
        purchasedCoupons = JSON.parse(localStorage.getItem('miniShopPurchases') || '[]')
        usedCouponIds = JSON.parse(localStorage.getItem('miniShopUsedCoupons') || '[]')
      } catch (error) {}
      savePlayerState({ points, purchasedCoupons, usedCouponIds, rouletteState: nextState })
        .catch(error => console.error('Supabase roulette sync failed. Local storage remains active.', error))
    }
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

  useEffect(() => {
    migrateLegacyState()
      .then(result => {
        if (!result.state) return
        setCloudPlayerState(result.state)
        setCloudSyncReady(true)
        if (result.status === 'already-migrated') {
          setRouletteState(writeRouletteState(result.state.roulette_state || {}))
        }
      })
      .catch(error => console.error('Supabase migration is unavailable. Local storage remains active.', error))
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
          <MiniGameZone rouletteState={rouletteState} updateRouletteState={updateRouletteState} cloudPlayerState={cloudPlayerState} cloudSyncReady={cloudSyncReady} />
        )}
        {showTicketPopup && <DailyTicketPopup onClose={dismissTicketPopup} />}
      </div>
    </div>
  )
}
