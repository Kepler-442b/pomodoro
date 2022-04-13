/**
 * File: /src/components/timer.js
 * Copyright (c) 2022 - Sooyeon Kim
 */

import React, { useCallback, useEffect, useState } from "react"
import { FULL_DASH_ARRAY, LEVI_BREAK, LEVI_START, SECONDS } from "../../pages"

const addZeroOnEnd = (int) => int.toString().padStart(2, "0")

const MyTimer = ({
  pomoTime,
  shortBreak,
  longBreak,
  paused,
  count,
  isOnShortBreak,
  isOnLongBreak,
  setIsOnPomoSession,
  setIsOnShortBreak,
  setIsOnLongBreak,
  setAudioFile,
  currMins,
  currSecs,
  currSBMins,
  currSBSecs,
  currLBMins,
  currLBSecs,
  setTimer,
  setSBTimer,
  setLBTimer,
  setDashArrVal,
  secsElapsed,
  setSecsElapsed,
}) => {
  useEffect(() => {
    setTimer([0, SECONDS]) //TODO: change to pomoTime
    setSBTimer([0, SECONDS])
    setLBTimer([longBreak, SECONDS])
  }, [pomoTime, shortBreak, longBreak])

  const tick = useCallback(
    (id, handleSetTime) => {
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
          // setAudioFile(new Audio(LEVI_START))
          setIsOnPomoSession(true)
          count.current += 1
        } else {
          setIsOnShortBreak(true) //TODO: add long break too
          // setAudioFile(new Audio(LEVI_BREAK))
          setIsOnPomoSession(false)
          setSBTimer([0, SECONDS])
        }
        // when the timer's second reaches 00, set the next second to 59
      } else if (minsInt !== 0 && secsInt === 0) {
        handleSetTime([addZeroOnEnd(minsInt - 1), addZeroOnEnd(59)])
        // otherwise just reduce 1 second from the current time
      } else {
        handleSetTime([addZeroOnEnd(minsInt), addZeroOnEnd(secsInt - 1)])
      }
    },
    [
      isOnShortBreak,
      isOnLongBreak,
      currMins,
      currSecs,
      currSBMins,
      currSBSecs,
      currLBMins,
      currLBSecs,
    ]
  )

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
        let baseMins
        if (isOnShortBreak) {
          tick(timerId, setSBTimer)
          baseMins = 6 //shortBreak
        } else if (isOnLongBreak) {
          tick(timerId, setLBTimer)
          baseMins = longBreak
        } else {
          tick(timerId, setTimer)
          baseMins = pomoTime
        }
        setSecsElapsed((prev) => prev + 1)

        const totalSecs = 6 //parseInt(baseMins) * 60 + parseInt(SECONDS)
        const timeRemained = totalSecs - secsElapsed

        // console.log("Hit secsElapsed", secsElapsed)

        const remainedFraction = timeRemained / totalSecs
        // gradually reduce the dash array to set it to 0 when the timer is 00:00
        const reducer =
          remainedFraction - (1 / totalSecs) * (1 - remainedFraction)
        let updatedDashArr = FULL_DASH_ARRAY * reducer

        const circleDasharray = `${updatedDashArr.toFixed(
          0
        )} ${FULL_DASH_ARRAY}`
        setDashArrVal(circleDasharray)
      }, 1000)
    }
    return () => clearInterval(timerId)
  }, [
    [
      paused,
      isOnLongBreak,
      isOnShortBreak,
      secsElapsed,
      pomoTime,
      shortBreak,
      longBreak,
    ],
  ])

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
