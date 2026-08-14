import React from 'react'

export default function Welcome({ onStart }){
  return (
    <div className="screen">
      <div className="container center" style={{flexDirection:'column',gap:12}}>
        <div className="large">Happy Birthday,</div>
        <div className="big-title">동신아.</div>
        <div className="muted center">오늘 하루 정도는 너를 위해 만든 앱의 주인공이 되어주세요.</div>
        <div style={{height:20}} />
        <button className="btn" onClick={onStart}>시작하기</button>
      </div>
    </div>
  )
}
