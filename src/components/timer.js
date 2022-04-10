/**
 * File: /src/components/timer.js
 * Copyright (c) 2022 - Sooyeon Kim
 */

import React, { useEffect, useState } from "react"
import { LEVI_START } from "../../pages"

const SECONDS = "04" // TODO: change to 00

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
  setIsStartingNewPomo,
  setAudioFile,
}) => {
  const [[currMins, currSecs], setTimer] = useState([pomoTime, SECONDS])
  const [[currSBMins, currSBSecs], setSBTimer] = useState([shortBreak, SECONDS])
  const [[currLBMins, currLBSecs], setLBTimer] = useState([longBreak, SECONDS])

  useEffect(() => {
    setTimer([0, SECONDS]) //TODO: change to pomoTime
    setSBTimer([1, SECONDS])
    setLBTimer([longBreak, SECONDS])
  }, [pomoTime, shortBreak, longBreak])

  const tick = (id, handleSetTime) => {
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

    // when the timer ends, set the interval to long break, short break, or pomo time
    if (minsInt === 0 && secsInt === 0) {
      clearInterval(id)
      if (isOnShortBreak || isOnLongBreak) {
        setIsOnShortBreak(false)
        setIsOnLongBreak(false)
        setTimer([0, SECONDS])
        setAudioFile(new Audio(LEVI_START))
        setIsStartingNewPomo(true)
        count.current += 1
      } else {
        setIsOnShortBreak(true) //TODO: add long break too
        setSBTimer([0, SECONDS])
      }
      // when the timer's second reaches 00, set the next second to 59
    } else if (minsInt !== 0 && secsInt === 0) {
      handleSetTime([addZeroOnEnd(minsInt - 1), addZeroOnEnd(59)])
      // otherwise just reduce 1 second from the current time
    } else {
      handleSetTime([addZeroOnEnd(minsInt), addZeroOnEnd(secsInt - 1)])
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
      timerId = setInterval(() => {
        if (isOnShortBreak) tick(timerId, setSBTimer)
        else if (isOnLongBreak) tick(timerId, setLBTimer)
        else tick(timerId, setTimer)
      }, 1000)
    }
    return () => clearInterval(timerId)
  }, [[paused, isOnLongBreak, isOnShortBreak]])

  return (
    <>
      <div
        className={
          !isOnShortBreak && !isOnLongBreak ? "timerText" : "breakTimerText"
        }
      >
        {displayTime()}
      </div>
    </>
  )
}

export default MyTimer
