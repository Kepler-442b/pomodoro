/**
 * File: /src/components/timer.js
 * Copyright (c) 2022 - Sooyeon Kim
 */

import React, { useEffect, useState } from "react"

const MyTimer = ({ pomoTime, paused }) => {
  const { minutes = "00", seconds = "00" } = pomoTime
  const [[currMins, currSecs], setTimer] = useState([minutes, seconds])

  // const reset = () => setTimer([parseInt(minutes), parseInt(seconds)])

  const addZeroOnEnd = (int) => int.toString().padStart(2, "0")

  const tick = (id) => {
    const minsInt = parseInt(currMins)
    const secsInt = parseInt(currSecs)

    if (minsInt === 0 && secsInt === 0) clearInterval(id)
    //reset()
    else if (secsInt === 0) {
      setTimer([addZeroOnEnd(minsInt - 1)])
    } else {
      setTimer([addZeroOnEnd(minsInt), addZeroOnEnd(secsInt - 1)])
    }
  }

  useEffect(() => {
    let timerId
    if (paused) {
      clearInterval(timerId)
    } else {
      timerId = setInterval(() => tick(timerId), 1000)
    }
    return () => clearInterval(timerId)
  }, [[paused]])

  return (
    <>
      <div className="timerText">{`${currMins}:${currSecs}`}</div>
    </>
  )
}

export default React.memo(MyTimer)
