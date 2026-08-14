import React, { useState, useEffect } from 'react'

export default function BirthdayUpdate({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [installing, setInstalling] = useState(false)

  useEffect(() => {
    let t
    if (installing && progress < 100) {
      t = setInterval(() => setProgress((p) => Math.min(100, p + Math.ceil(Math.random() * 18))), 500)
    }
    if (progress === 100) {
      setTimeout(() => setInstalling(false), 500)
    }
    return () => clearInterval(t)
  }, [installing, progress])

  return (
    <div className="screen">
      <div className="container center" style={{flexDirection:'column',gap:12}}>
        <div className="big-title">DONGSHIN OS</div>
        <div className="muted">Birthday Update Available</div>
        <div className="large">Version 2.0</div>

        <div className="card" style={{width:'100%'}}>
          <div className="muted">What's New</div>
          <ul className="muted">
            <li>Age +1</li>
            <li>Memories +365 days</li>
            <li>Girlfriend Love +∞</li>
            <li>Cuteness +12%</li>
          </ul>
          <div className="muted">Known Issues</div>
          <ul className="muted">
            <li>배고프면 기능이 불안정할 수 있음</li>
            <li>여자친구 말을 가끔 듣지 않음</li>
          </ul>
        </div>

        {!installing && (
          <button className="btn" onClick={() => { setInstalling(true); setProgress(0) }}>Update Now</button>
        )}

        {installing && (
          <div style={{width:'100%'}}>
            <div className="muted">Installing Birthday Update...</div>
            <div className="spacer" />
            <div className="progress"><i style={{width:progress + '%'}}></i></div>
            <div className="spacer" />
            <div className="center muted">{progress}%</div>
            {progress === 100 && (
              <div className="spacer" />
            )}
          </div>
        )}

        {!installing && progress === 100 && (
          <button className="btn" onClick={onComplete}>Open Birthday Gift</button>
        )}

        {progress === 100 && !installing && <div className="muted">Update Complete 🎂</div>}
      </div>
    </div>
  )
}
