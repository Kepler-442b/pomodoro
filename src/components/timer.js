/**
 * File: /src/components/timer.js
 * Copyright (c) 2022 - Sooyeon Kim
 */

import React, { useEffect, useState } from "react"

const SECONDS = "00"

const addZeroOnEnd = (int) => int.toString().padStart(2, "0")

const MyTimer = ({
  pomoTime,
  shortBreak,
  longBreak,
  paused,
  count,
  isOnShortBreak,
  isOnLongBreak,
  setIsOnShortBreak,
  setIsOnLongBreak,
  togglePaused,
}) => {
  const [[currMins, currSecs], setTimer] = useState([pomoTime, SECONDS])
  const [[currSBMins, currSBSecs], setSBTimer] = useState([shortBreak, SECONDS])
  const [[currLBMins, currLBSecs], setLBTimer] = useState([longBreak, SECONDS])
  let pomoTimeFromLocal, sbFromLocal, lbFromLocal, intervalFromLocal
  // if (typeof window !== "undefined") {
  //   pomoTimeFromLocal = window.localStorage.getItem("pomoTime")
  //   sbFromLocal = window.localStorage.getItem("shortBreak")
  //   lbFromLocal = window.localStorage.getItem("longBreak")
  //   intervalFromLocal = window.localStorage.getItem("longBreakInterval")
  // }
  useEffect(() => {
    setTimer([0, SECONDS])
    setSBTimer([shortBreak, SECONDS])
    setLBTimer([longBreak, SECONDS])
  }, [pomoTime, shortBreak, longBreak])

  const tick = (id) => {
    let minsInt, secsInt
    if (isOnShortBreak) {
      minsInt = parseInt(currSBMins)
      secsInt = parseInt(currSBSecs)
    } else if (isOnLongBreak) {
      minsInt = parseInt(currLBMins)
      secsInt = parseInt(currLBSecs)
    } else {
      minsInt = parseInt(currMins)
      secsInt = parseInt(currSecs)
    }

    console.log("tick", minsInt, secsInt, isOnShortBreak)
    if (minsInt === 0 && secsInt === 0) {
      clearInterval(id)
      if (isOnShortBreak || isOnLongBreak) {
        setIsOnShortBreak(false)
        setIsOnLongBreak(false)
        count.current += 1
      } else {
        setIsOnShortBreak(true)
      }
    } else if (minsInt !== 0 && secsInt === 0) {
      if (isOnLongBreak)
        setLBTimer([addZeroOnEnd(minsInt - 1), addZeroOnEnd(59)])
      else if (isOnShortBreak)
        setSBTimer([addZeroOnEnd(minsInt - 1), addZeroOnEnd(59)])
      else setTimer([addZeroOnEnd(minsInt - 1), addZeroOnEnd(59)])
    } else {
      if (isOnLongBreak)
        setLBTimer([addZeroOnEnd(minsInt), addZeroOnEnd(secsInt - 1)])
      else if (isOnShortBreak)
        setSBTimer([addZeroOnEnd(minsInt), addZeroOnEnd(secsInt - 1)])
      else setTimer([addZeroOnEnd(minsInt), addZeroOnEnd(secsInt - 1)])
    }
  }

  const displayTime = () => {
    if (isOnShortBreak) return `${currSBMins}:${currSBSecs}`
    else if (isOnLongBreak) return `${currLBMins}:${currLBSecs}`
    else return `${currMins}:${currSecs}`
  }

  useEffect(() => {
    let timerId
    if (paused) {
      clearInterval(timerId)
    } else {
      timerId = setInterval(() => tick(timerId), 1000)
    }
    return () => clearInterval(timerId)
  }, [[paused, isOnLongBreak, isOnShortBreak]])

  return (
    <>
      <div className="timerText">{displayTime()}</div>
    </>
  )
}

export default MyTimer
