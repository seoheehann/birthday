import React, { useState } from 'react'
import couponsData from '../data/coupons'

export default function CouponWallet({onNext}){
  const [coupons, setCoupons] = useState(couponsData)

  function useCoupon(id){
    if(!confirm('정말 이 쿠폰을 사용하시겠습니까?')) return
    setCoupons(coupons.map(c=> c.id===id? {...c, used:true}: c))
  }

  return (
    <div className="screen">
      <div className="container">
        <div className="big-title">Birthday Coupons</div>
        <div className="muted">모바일 Wallet 스타일로 디자인</div>

        <div style={{marginTop:12}}>
          {coupons.map(c=> (
            <div key={c.id} className={"coupon" + (c.used? ' used':'') }>
              <div>
                <div style={{fontWeight:700}}>{c.title}</div>
                <div className="muted">사용 가능: {c.subtitle}</div>
              </div>
              <div>
                <button className="btn" onClick={() => useCoupon(c.id)}>{c.used? 'USED':'사용하기'}</button>
              </div>
            </div>
          ))}
        </div>

        <div className="center"><button className="btn" onClick={onNext}>마지막 선물</button></div>
      </div>
    </div>
  )
}
