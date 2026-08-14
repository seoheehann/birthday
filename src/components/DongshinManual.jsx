import React from 'react'
import { FaBatteryHalf, FaTools, FaHeart, FaBug } from 'react-icons/fa'

const items = [
  {k:'Product Name', v:'조동신', icon:<FaTools/>},
  {k:'Developer', v:'한서희', icon:<FaHeart/>},
  {k:'Primary Function', v:'여자친구 웃기기', icon:<FaHeart/>},
  {k:'Battery Low Signal', v:'말수가 줄어듦', icon:<FaBatteryHalf/>},
  {k:'Known Bugs', v:'가끔 여자친구 말을 안 듣음', icon:<FaBug/>},
  {k:'Warranty', v:'평생', icon:<FaHeart/>}
]

export default function DongshinManual({onNext}){
  return (
    <div className="screen">
      <div className="container">
        <div className="big-title">DONGSHIN USER MANUAL</div>
        <div className="muted">조동신 사용 설명서</div>

        <div style={{marginTop:12}}>
          {items.map((it,idx)=> (
            <div key={idx} className="card" style={{display:'flex',gap:12,alignItems:'center'}}>
              <div style={{fontSize:20}}>{it.icon}</div>
              <div>
                <div style={{fontWeight:700}}>{it.k}</div>
                <div className="muted">{it.v}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="center" style={{marginTop:12}}>
          <button className="btn" onClick={onNext}>퀴즈로 가기</button>
        </div>
      </div>
    </div>
  )
}
