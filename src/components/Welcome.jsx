import React, { useState, useEffect, useRef } from 'react'

export default function Welcome({ onStart }){
  const TEST_MODE = false

  const [timeLeft, setTimeLeft] = useState({days: 0, totalHours: '00', mm: '00', ss: '00'})
  const [pin, setPin] = useState('')
  const [anim, setAnim] = useState('idle') // 'idle' | 'shake' | 'unlock'
  const [fireworks, setFireworks] = useState(TEST_MODE)
  const [letterOpened, setLetterOpened] = useState(false)
  const fireworksStartRef = useRef(null)

  const CORRECT_PIN = '0415'
  const target = TEST_MODE ? new Date(Date.now() + 2000) : new Date(2026, 8, 17, 0, 0, 0) // TEST: after 2s
  const dayEnd = TEST_MODE ? new Date(Date.now() + 60000) : new Date(2026, 8, 18, 0, 0, 0) // TEST: 1 min window
  const messageHideAt = TEST_MODE ? new Date(Date.now() + 15000) : new Date(2026, 8, 17, 1, 0, 0)

  useEffect(() => {
    function setTimeLeftFromDiff(diff){
      const days = Math.floor(diff / (1000*60*60*24))
      const totalHours = String(Math.floor(diff / (1000*60*60))).padStart(2,'0')
      const mm = String(Math.floor((diff / (1000*60)) % 60)).padStart(2,'0')
      const ss = String(Math.floor((diff / 1000) % 60)).padStart(2,'0')
      setTimeLeft({ days, totalHours, mm, ss })
    }

    function update(){
      const now = new Date()
      const diff = Math.max(target - now, 0)

      if (diff <= 0) {
        setTimeLeft({ days: 0, totalHours: '00', mm: '00', ss: '00' })
        if (!fireworksStartRef.current) {
          fireworksStartRef.current = now
          setFireworks(true)
        }
      } else {
        setTimeLeftFromDiff(diff)
        // ensure fireworks not active before target
        if (!fireworksStartRef.current) setFireworks(false)
      }

      // stop fireworks after 60 seconds from start
      if (fireworksStartRef.current) {
        const elapsed = now - fireworksStartRef.current
        if (elapsed >= 60_000) {
          fireworksStartRef.current = null
          setFireworks(false)
        }
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

  const now = new Date()
  const fireworksActive = fireworks && now < dayEnd
  const shouldShowLetterMessage = fireworksActive && now < messageHideAt
  const letterMessage = letterOpened ? '비밀번호를 입력해주세요!' : '편지가 도착했어요!'

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
        {fireworksActive && (
          <div className="letter-wrapper">
            {shouldShowLetterMessage && (
              <div className="letter-message">{letterMessage}</div>
            )}
            <button
              type="button"
              className={`letter-envelope ${letterOpened ? 'opened' : ''}`}
              aria-label="Letter envelope"
              onClick={() => setLetterOpened(true)}
            >
              <span className="letter-flap" />
              <span className="letter-body" />
              <span className="letter-seal" aria-hidden="true" />
            </button>
          </div>
        )}

        {fireworksActive && (
          <div className="fireworks" aria-hidden="true">
            {[...Array(60)].map((_, i) => {
              const angle = (i / 60) * Math.PI * 2
              const distance = 42 + (i % 10) * 16
              const x = Math.cos(angle) * distance
              const y = Math.sin(angle) * distance
              const scale = 1 + (i % 5) * 0.35
              return (
                <span
                  key={i}
                  style={{
                    '--dx': `${x}px`,
                    '--dy': `${y}px`,
                    '--delay': `${i * 12}ms`,
                    '--size': `${5 + (i % 4) * 6}px`,
                    '--scale': scale
                  }}
                />
              )
            })}
            {[...Array(24)].map((_, i) => {
              const angle = (i / 24) * Math.PI * 2
              const distance = 86 + (i % 6) * 18
              const x = Math.cos(angle) * distance
              const y = Math.sin(angle) * distance
              return (
                <span className="spark spark--star" key={`star-${i}`} style={{
                  '--dx': `${x}px`,
                  '--dy': `${y}px`,
                  '--delay': `${i * 18}ms`,
                  '--size': `${10 + (i % 4) * 6}px`
                }} />
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
