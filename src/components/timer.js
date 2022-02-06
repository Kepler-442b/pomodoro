import React, { useEffect, useState, useRef } from "react"

const MyTimer = ({ target, paused }) => {
  const { minutes = 0, seconds = 0 } = target
  const [[mins, secs], setTimer] = useState([minutes, seconds])
  const countdown = useRef(null)
  const [timerId, setId] = useState(null)

  const reset = () => setTimer([parseInt(minutes), parseInt(seconds)])

  const tick = () => {
    if (mins === 0 && secs === 0) return
    //reset()
    else if (secs === 0) {
      setTimer([mins - 1, 59])
    } else {
      setTimer([mins, secs - 1])
    }
  }

  useEffect(() => {
    if (paused) {
      clearInterval(timerId)
    } else {
      const timerId = setInterval(() => tick(), 1000)
      setId(timerId)
      return () => clearInterval(timerId)
    }
  }, [[paused]])

  return (
    <>
      <div className="timerText">{`${mins}:${secs}`}</div>
    </>
  )
}

export default React.memo(MyTimer)
