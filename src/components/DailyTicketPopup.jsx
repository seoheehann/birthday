import React from 'react'

export default function DailyTicketPopup({ onClose }) {
  return (
    <div className="ticket-popup-backdrop" role="presentation">
      <section className="ticket-popup" role="dialog" aria-modal="true" aria-labelledby="ticket-popup-title">
        <button type="button" className="ticket-popup-close" onClick={onClose} aria-label="팝업 닫기">×</button>
        <div className="ticket-popup-icon" aria-hidden="true">🎟️</div>
        <h2 id="ticket-popup-title">오늘의 무료 티켓이<br />도착했어요!</h2>
        <div className="ticket-popup-reward">룰렛 티켓 <strong>+1</strong></div>
      </section>
    </div>
  )
}
