import React, { useState } from 'react'
import randomMemories from '../data/randomMemories'

export default function RandomMemory({onNext}){
  const [item, setItem] = useState(null)

  function draw(){
    const r = randomMemories[Math.floor(Math.random()*randomMemories.length)]
    setItem(r)
  }

  return (
    <div className="screen">
      <div className="container center" style={{flexDirection:'column',gap:12}}>
        <div className="big-title">Memory Random Box</div>
        <div className="muted">추억을 뽑아보세요.</div>

        <div style={{width:'100%',maxWidth:360}} className="card center">
          {item ? (
            <div>
              <img src={item.image} alt='' style={{width:280,height:160,objectFit:'cover',borderRadius:12}} />
              <div style={{marginTop:8}}>{item.text}</div>
            </div>
          ) : (
            <div className="muted">카드를 뽑아보세요.</div>
          )}
        </div>

        <div style={{display:'flex',gap:10}}>
          <button className="btn" onClick={draw}>🎲 추억 하나 뽑기</button>
          <button className="btn" onClick={onNext}>다음</button>
        </div>
      </div>
    </div>
  )
}
