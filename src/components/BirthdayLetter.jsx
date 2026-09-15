import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

export default function BirthdayLetter({ onClose }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    dialog.showModal()
    return () => dialog.close()
  }, [])

  return createPortal(
    <dialog ref={dialogRef} className="birthday-letter" aria-labelledby="birthday-letter-title" onCancel={event => {
      event.preventDefault()
      onClose()
    }}>
      <div className="birthday-letter-paper">
        <button type="button" className="birthday-letter-close" onClick={onClose} aria-label="편지 닫기" autoFocus>×</button>
        <span className="birthday-letter-heart" aria-hidden="true">♥</span>
        <h2 id="birthday-letter-title">자기야 ! 생일 축하해 !</h2>
        <p>회사를 다니게 된 바람에 원래 챙겨주려 했던 생일처럼 흘러가진 않게 되었지만.. 오늘이 자기한테 정말 행복한 날이었으면 좋겠어 !</p>
        <p>내가 축하해줄 수 있게 나를 사랑해주고 곁에 있어줘서 너무 고마워 ㅎㅎ 앞으로도 매년 자기 생일을 곁에서 축하해주고 싶어.</p>
        <p>누구보다 많이 사랑하고 앞으로도 옆에서 자기를 행복하게 해줄게 ! 많이 부족하지만 나한테 최선을 다해주고 사랑 줘서 너무 고맙구 생일 축하해 태어나줘서 고마워 ㅎㅎ</p>
      </div>
    </dialog>,
    document.body,
  )
}
