import React from 'react'

export default function Welcome({ onStart }){
  return (
    <div className="screen welcome-screen">
      <div className="welcome-portal">
        <h1 className="welcome-title">조동신님의<br />생일 포털 입구</h1>
        <div className="welcome-subtitle">SPECIALLY DESIGNED FOR DONGSIN</div>

        <div className="welcome-pin-box">
          <div className="welcome-dots" aria-label="PIN indicator">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>

          <div className="welcome-hint-wrap">
            <div className="welcome-hint">First date movie? (4 digits PIN)</div>
          </div>

          <div className="welcome-time">D-25 : 14 : 02 : 18</div>

          <div className="welcome-lock" aria-label="Locked">
            <span className="lock-icon" aria-hidden="true" />
          </div>
        </div>

        <button className="btn welcome-btn" onClick={onStart}>UNLOCK</button>
      </div>
    </div>
  )
}
