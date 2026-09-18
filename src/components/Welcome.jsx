import React, { useState, useEffect } from 'react'
import { BIRTHDAY_START, isBirthdayCelebrationActive } from '../utils/birthdayCelebration'
import BirthdayLetter from './BirthdayLetter'

export default function Welcome({ onStart }){
  const [timeLeft, setTimeLeft] = useState({days: 0, totalHours: '00', mm: '00', ss: '00'})
  const [pin, setPin] = useState('')
  const [anim, setAnim] = useState('idle') // 'idle' | 'shake' | 'unlock'
  const [fireworks, setFireworks] = useState(false)
  const [letterOpened, setLetterOpened] = useState(false)

  const CORRECT_PIN = '0415'
  const target = BIRTHDAY_START

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

      setTimeLeftFromDiff(diff)
      setFireworks(isBirthdayCelebrationActive(now))
    }

    update()
    const id = setInterval(update, 1000)
    const onVisible = () => { if (!document.hidden) update() }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', onVisible)
    }
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

  const fireworksActive = fireworks

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
        <div className="letter-wrapper">
          <div className="letter-message">편지가 도착했어요!</div>
          <button
            type="button"
            className={`letter-envelope ${letterOpened ? 'opened' : ''}`}
            aria-label="생일 편지 열기"
            onClick={() => setLetterOpened(true)}
          >
            <span className="letter-flap" />
            <span className="letter-body" />
            <span className="letter-seal" aria-hidden="true" />
          </button>
        </div>

        {letterOpened && <BirthdayLetter onClose={() => setLetterOpened(false)} />}

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
