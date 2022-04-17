/**
 * File: /src/components/timer.js
 * Copyright (c) 2022 - Sooyeon Kim
 */

import React, { useCallback, useEffect } from "react"
import { FULL_DASH_ARRAY, SECONDS } from "../../pages"

const addZeroOnEnd = (int) => int.toString().padStart(2, "0")

const MyTimer = ({
  pomoTime,
  shortBreak,
  longBreak,
  paused,
  count,
  isOnShortBreak,
  isOnLongBreak,
  isOnPomoSession,
  setIsOnPomoSession,
  setIsOnShortBreak,
  setIsOnLongBreak,
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
    setTimer([pomoTime, SECONDS]) //TODO: change 0 to pomoTime
    setSBTimer([shortBreak, SECONDS])
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
          setIsOnPomoSession(true)
          count.current += 1
        } else {
          setIsOnShortBreak(true) //TODO: add long break too
          setIsOnPomoSession(false)
          setSBTimer([0, SECONDS])
        }
        // when the timer's second reaches 00, set the next second to 59
      } else if (minsInt !== 0 && secsInt === 0) {
        count.current === 0
          ? (count.current += 1)
          : handleSetTime([addZeroOnEnd(minsInt - 1), addZeroOnEnd(59)])
        // otherwise just reduce 1 second from the current time
      } else {
        count.current === 0
          ? (count.current += 1)
          : handleSetTime([addZeroOnEnd(minsInt), addZeroOnEnd(secsInt - 1)])
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
    // show Begin! only on the initial pomo session of the day
    if (isOnPomoSession && count.current === 0) return "Begin!"
    else if (isOnShortBreak) return `${currSBMins}:${currSBSecs}`
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

        const totalSecs = parseInt(baseMins) * 60 + parseInt(SECONDS)
        const secsLeft = totalSecs - secsElapsed

        // console.log("Hit secsElapsed", secsElapsed)

        const remainedFraction = secsLeft / totalSecs
        // gradually reduce the dash array to be set to 0, so that when the
        // timer ends, the animation also ends at the same time
        const reducer =
          remainedFraction - (1 / totalSecs) * (1 - remainedFraction)
        let updatedDashArr = reducer * FULL_DASH_ARRAY

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
