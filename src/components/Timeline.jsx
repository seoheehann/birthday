import React from 'react'
import memories from '../data/memories'

function MemoryCard({m}){
  return (
    <div className="card timeline-card">
      <img src={m.image} alt={m.title} />
      <div>
        <div className="muted">{m.date}</div>
        <div style={{fontWeight:700}}>{m.title}</div>
        <div className="muted">{m.description}</div>
      </div>
    </div>
  )
}

export default function Timeline({onNext}){
  return (
    <div className="screen">
      <div className="container">
        <div className="big-title">Our Timeline</div>
        <div className="muted">추억을 아래로 스크롤 해보세요.</div>

        <div style={{marginTop:12,overflowY:'auto',paddingBottom:120}}>
          {memories.map((m,i)=> <MemoryCard key={i} m={m} />)}
        </div>

        <div className="spacer" />
        <div className="center"><button className="btn" onClick={onNext}>다음</button></div>
      </div>
    </div>
  )
}
