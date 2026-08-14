import React from 'react'
import { FaHome, FaClock, FaQuestionCircle, FaGift } from 'react-icons/fa'

export default function BottomNav({current,onNavigate}){
  return (
    <div className="bottom-nav">
      <div className="nav-item" onClick={() => onNavigate(2)}>
        <div style={{fontSize:16}}><FaHome/></div>
        <div className="muted">Home</div>
      </div>
      <div className="nav-item" onClick={() => onNavigate(3)}>
        <div style={{fontSize:16}}><FaClock/></div>
        <div className="muted">Memory</div>
      </div>
      <div className="nav-item" onClick={() => onNavigate(5)}>
        <div style={{fontSize:16}}><FaQuestionCircle/></div>
        <div className="muted">Quiz</div>
      </div>
      <div className="nav-item" onClick={() => onNavigate(7)}>
        <div style={{fontSize:16}}><FaGift/></div>
        <div className="muted">Gift</div>
      </div>
    </div>
  )
}
