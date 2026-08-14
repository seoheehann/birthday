import React, { useState, useEffect } from 'react'

export default function Welcome({ onStart }){
  const [timeLeft, setTimeLeft] = useState({days: 0, totalHours: '00', mm: '00', ss: '00'})
  const [pin, setPin] = useState('')
  const [anim, setAnim] = useState('idle') // 'idle' | 'shake' | 'unlock'
  const [fireworks, setFireworks] = useState(false)

  const CORRECT_PIN = '0415'

  useEffect(() => {
    const target = new Date(2026, 8, 17, 0, 0, 0) // 2026-09-17 00:00 local

    function update(){
      const now = new Date()
      let diff = target - now
      const sign = diff < 0 ? -1 : 1
      diff = Math.abs(diff)
      const days = Math.floor(diff / (1000*60*60*24)) * sign
      const totalHours = String(Math.floor(diff / (1000*60*60))).padStart(2,'0')
      const mm = String(Math.floor((diff / (1000*60)) % 60)).padStart(2,'0')
      const ss = String(Math.floor((diff / 1000) % 60)).padStart(2,'0')
      setTimeLeft({ days, totalHours, mm, ss })

      // trigger fireworks when target reached
      if (target - now <= 0 && !fireworks) {
        setFireworks(true)
      }
    }

    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if(pin.length === 4){
      if(pin === CORRECT_PIN){
        setAnim('unlock')
        setTimeout(() => {
          onStart && onStart()
        }, 700)
      } else {
        setAnim('shake')
        setTimeout(() => {
          setPin('')
          setAnim('idle')
        }, 600)
      }
    }
  }, [pin])

  function handleUnlockClick(){
    const el = document.getElementById('welcome-pin-input')
    if(el) el.focus()
  }

  return (
    <div className={`screen welcome-screen ${anim === 'shake' ? 'shake' : ''}`}>
      <div className="welcome-portal">
        <h1 className="welcome-title">조동신님의<br />생일 포털 입구</h1>
        <div className="welcome-subtitle">SPECIALLY DESIGNED FOR DONGSIN</div>

        <div className="welcome-pin-box">
          <div className="welcome-time">D{timeLeft.days >= 0 ? '-' + timeLeft.days : '+' + Math.abs(timeLeft.days)} : <span className="time-remaining">{timeLeft.totalHours} : {timeLeft.mm} : {timeLeft.ss}</span></div>

          <div className="welcome-dots" aria-label="PIN indicator">
            {[0,1,2,3].map(i => (
              <span key={i} className={i < pin.length ? 'filled' : ''} />
            ))}
          </div>

          <div className="welcome-hint-wrap">
            <div className="welcome-hint">HINT: 제일 잘 한 일</div>
          </div>

          <div className={`welcome-lock ${anim === 'unlock' ? 'unlocked' : ''}`} aria-label="Locked">
            <span className="lock-icon" aria-hidden="true" />
          </div>
        </div>

        <button className="btn welcome-btn" onClick={handleUnlockClick}>UNLOCK</button>

        <input
          id="welcome-pin-input"
          className="welcome-pin-input"
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={4}
          value={pin}
          onChange={e => {
            const v = (e.target.value || '').replace(/[^0-9]/g, '').slice(0,4)
            if(anim !== 'idle') return
            setPin(v)
          }}
        />
        {fireworks && (
          <div className="fireworks" aria-hidden="true">
            {[...Array(12)].map((_, i) => (
              <span key={i} style={{ transform: `rotate(${i * 30}deg)` }} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
