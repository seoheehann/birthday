import React, { useState } from 'react'

export default function FinalGift({onOpen}){
  const [dark, setDark] = useState(false)

  function open(){
    setDark(true)
    setTimeout(() => onOpen(), 900)
  }

  return (
    <div className="screen">
      <div className="container center" style={{flexDirection:'column',gap:12}}>
        <div className="large">아직 하나 남았습니다.</div>
        <div className="muted">마지막 선물을 열어보세요.</div>
        <div style={{height:12}} />
        <button className="btn" onClick={open}>마지막 선물 열기</button>
        {dark && <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.6)',transition:'opacity .9s'}}></div>}
      </div>
    </div>
  )
}
