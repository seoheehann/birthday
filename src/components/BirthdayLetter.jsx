import React from 'react'
import letter from '../data/letter'

export default function BirthdayLetter(){
  return (
    <div className="screen">
      <div className="container" style={{paddingTop:30}}>
        <div className="muted">To. {letter.to}</div>
        <div style={{height:12}} />
        <div className="card" style={{padding:20}}>
          <div style={{whiteSpace:'pre-wrap',lineHeight:1.6}}>{letter.body}</div>
        </div>

        <div style={{marginTop:20,textAlign:'center'}}>
          <div className="big-title">Happy Birthday, Dongshin 🎂</div>
          <div className="muted">이번 버전 업데이트는 여기까지입니다. 다음 업데이트도 계속 함께해 주세요.</div>
        </div>
      </div>
    </div>
  )
}
