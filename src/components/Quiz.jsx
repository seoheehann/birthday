import React, { useState } from 'react'
import quizData from '../data/quiz'

export default function Quiz({onNext}){
  const [idx,setIdx] = useState(0)
  const [score,setScore] = useState(0)
  const [selected, setSelected] = useState(null)
  const [finished, setFinished] = useState(false)

  const q = quizData[idx]

  function choose(i){
    setSelected(i)
    if(i === q.answer) setScore(s=>s+1)
    setTimeout(()=>{
      if(idx+1 < quizData.length){
        setIdx(idx+1); setSelected(null)
      } else {
        setFinished(true)
      }
    },700)
  }

  if(finished){
    return (
      <div className="screen">
        <div className="container center" style={{flexDirection:'column',gap:12}}>
          <div className="large">퀴즈 완료</div>
          <div className="big-title">{score} / {quizData.length}</div>
          <div className="muted">{score === quizData.length ? '남자친구 자격 유지 완료.' : '더 노력해봐요 :)'}</div>
          <div style={{height:12}} />
          <button className="btn" onClick={onNext}>다음</button>
        </div>
      </div>
    )
  }

  return (
    <div className="screen">
      <div className="container">
        <div className="big-title">Couple Quiz</div>
        <div className="muted">{q.question}</div>

        <div style={{marginTop:12}}>
          {q.options.map((op,i)=> (
            <div key={i} className={"card" + (selected===i? ' used':'')} style={{marginBottom:8}} onClick={() => choose(i)}>
              {op}
            </div>
          ))}
        </div>

        <div style={{height:12}} />
        <div className="muted">문제 {idx+1} / {quizData.length}</div>
      </div>
    </div>
  )
}
