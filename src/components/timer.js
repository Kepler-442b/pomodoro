/**
 * File: /src/components/timer.js
 * Copyright (c) 2022 - Sooyeon Kim
 */

import React, { useEffect, useState } from "react"

const MyTimer = ({ pomoTime, paused }) => {
  const SECONDS = "00"

  const [[currMins, currSecs], setTimer] = useState([pomoTime, SECONDS])

  const addZeroOnEnd = (int) => int.toString().padStart(2, "0")

  let pomoTimeFromLocal, sbFromLocal, lbFromLocal, intervalFromLocal
  if (typeof window !== "undefined") {
    pomoTimeFromLocal = window.localStorage.getItem("pomoTime")
    sbFromLocal = window.localStorage.getItem("shortBreak")
    lbFromLocal = window.localStorage.getItem("longBreak")
    intervalFromLocal = window.localStorage.getItem("interval")
  }

  useEffect(() => {
    setTimer([pomoTimeFromLocal, SECONDS])
  }, [pomoTimeFromLocal, sbFromLocal, lbFromLocal, intervalFromLocal])

  const tick = (id) => {
    const minsInt = parseInt(currMins)
    const secsInt = parseInt(currSecs)

    if (minsInt === 0 && secsInt === 0) clearInterval(id)
    else if (secsInt === 0) {
      setTimer([addZeroOnEnd(minsInt - 1), addZeroOnEnd(59)])
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

export default MyTimer
