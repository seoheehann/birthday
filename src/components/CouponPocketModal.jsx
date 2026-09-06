import React, { useState } from 'react'

export default function CouponPocketModal({ coupons, usedCouponIds, onUseCoupon, onClose }) {
  const [activeTab, setActiveTab] = useState('available')
  const [confirmCoupon, setConfirmCoupon] = useState(null)
  const availableCoupons = coupons.filter(coupon => !usedCouponIds.includes(coupon.instanceId))
  const usedCoupons = coupons.filter(coupon => usedCouponIds.includes(coupon.instanceId))
  const visibleCoupons = activeTab === 'available' ? availableCoupons : usedCoupons

  function confirmUse() {
    if (!confirmCoupon) return
    onUseCoupon(confirmCoupon.instanceId)
    setConfirmCoupon(null)
    setActiveTab('used')
  }

  return (
    <div className="coupon-modal-backdrop" role="presentation" onMouseDown={event => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <section className="coupon-modal" role="dialog" aria-modal="true" aria-labelledby="coupon-modal-title">
        <header className="coupon-modal-header">
          <div><span>MY COUPONS</span><h3 id="coupon-modal-title">내 쿠폰함</h3></div>
          <button type="button" className="coupon-modal-close" onClick={onClose} aria-label="쿠폰함 닫기">×</button>
        </header>
        <div className="coupon-tabs" role="tablist" aria-label="쿠폰 상태">
          <button type="button" role="tab" aria-selected={activeTab === 'available'} className={activeTab === 'available' ? 'active' : ''} onClick={() => setActiveTab('available')}>사용 가능 <strong>{availableCoupons.length}</strong></button>
          <button type="button" role="tab" aria-selected={activeTab === 'used'} className={activeTab === 'used' ? 'active' : ''} onClick={() => setActiveTab('used')}>사용 완료 <strong>{usedCoupons.length}</strong></button>
        </div>
        <div className="coupon-list">
          {visibleCoupons.length === 0 ? (
            <div className="coupon-empty"><span aria-hidden="true">🎫</span><p>{activeTab === 'available' ? '사용 가능한 쿠폰이 없어요.' : '아직 사용한 쿠폰이 없어요.'}</p></div>
          ) : visibleCoupons.map(coupon => {
            const used = usedCouponIds.includes(coupon.instanceId)
            return (
              <article className={'coupon-ticket' + (used ? ' used' : '')} key={coupon.instanceId}>
                <div className="coupon-ticket-icon" aria-hidden="true">{coupon.icon}</div>
                <div className="coupon-ticket-copy"><h4>{coupon.name}</h4><p>{coupon.description}</p><small>NO. {coupon.instanceId.toUpperCase()}</small></div>
                {!used && <button type="button" className="coupon-use-btn" onClick={() => setConfirmCoupon(coupon)}>사용하기</button>}
                {used && <div className="coupon-used-stamp"><strong>USED</strong><span>사용완료</span></div>}
              </article>
            )
          })}
        </div>
        {confirmCoupon && (
          <div className="coupon-confirm-backdrop">
            <div className="coupon-confirm" role="alertdialog" aria-modal="true" aria-labelledby="coupon-confirm-title">
              <div className="coupon-confirm-icon" aria-hidden="true">🎫</div>
              <h4 id="coupon-confirm-title">{confirmCoupon.name}</h4>
              <p>정말 이 쿠폰을 사용하시겠습니까?<br /><strong>(사용 후 취소 불가!)</strong></p>
              <div className="coupon-confirm-actions">
                <button type="button" onClick={() => setConfirmCoupon(null)}>취소</button>
                <button type="button" className="confirm" onClick={confirmUse}>정말 사용하기</button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
