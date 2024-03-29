/**
 * File: /src/components/timer.tsx
 * Copyright (c) 2022 - Sooyeon Kim
 */

import axios from "axios"
import Cookie from "js-cookie"
import React, { Dispatch, SetStateAction, useCallback, useEffect } from "react"
import { FULL_DASH_ARRAY, SECONDS } from "../utils/constant"
import { getYYYYMMDD } from "../utils/date"

const addZeroOnEnd = (int: number) => int.toString().padStart(2, "0")

interface Props {
  pomoTime: string
  shortBreak: string
  longBreak: string
  interval: number
  paused: boolean
  count: number
  isOnShortBreak: boolean
  isOnLongBreak: boolean
  isOnPomoSession: boolean
  setIsOnPomoSession: Dispatch<SetStateAction<boolean>>
  setIsOnShortBreak: Dispatch<SetStateAction<boolean>>
  setIsOnLongBreak: Dispatch<SetStateAction<boolean>>
  currMins: string
  currSecs: string
  currSBMins: string
  currSBSecs: string
  currLBMins: string
  currLBSecs: string
  setTimer: Dispatch<SetStateAction<[string, string]>>
  setSBTimer: Dispatch<SetStateAction<[string, string]>>
  setLBTimer: Dispatch<SetStateAction<[string, string]>>
  setDashArrVal: Dispatch<SetStateAction<string>>
  secsElapsed: number
  setSecsElapsed: Dispatch<SetStateAction<number>>
  setCount: Dispatch<SetStateAction<number>>
}

const MyTimer = (props: Props): JSX.Element => {
  const {
    pomoTime,
    shortBreak,
    longBreak,
    interval,
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
    setCount,
  } = props

  useEffect(() => {
    setTimer([pomoTime, SECONDS])
    setSBTimer([shortBreak, SECONDS])
    setLBTimer([longBreak, SECONDS])
  }, [pomoTime, shortBreak, longBreak, setTimer, setSBTimer, setLBTimer])

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
          setTimer([pomoTime, SECONDS])
          setIsOnPomoSession(true)
          setCount((prevCount) => prevCount + 1)
        } else if (count % interval === 0) {
          // calculate whether it is long or short break
          setIsOnLongBreak(true)
          setIsOnPomoSession(false)
          setLBTimer([longBreak, SECONDS])
          axios.post(`/api/users/report?userId=${Cookie.get("userId")}`, {
            intervalsCompleted: 1,
            hoursCompleted: parseInt(pomoTime) / 60,
            date: getYYYYMMDD(),
          })
        } else {
          setIsOnShortBreak(true)
          setIsOnPomoSession(false)
          setSBTimer([shortBreak, SECONDS])
          axios.post(`/api/users/report?userId=${Cookie.get("userId")}`, {
            intervalsCompleted: 1,
            hoursCompleted: parseInt(pomoTime) / 60,
            date: getYYYYMMDD(),
          })
        }
        // when the timer's second reaches 00, set the next second to 59
      } else if (minsInt !== 0 && secsInt === 0) {
        count === 0
          ? setCount((prevCount) => prevCount + 1)
          : handleSetTime([addZeroOnEnd(minsInt - 1), addZeroOnEnd(59)])
        // otherwise just reduce 1 second from the current time
      } else {
        count === 0
          ? setCount((prevCount) => prevCount + 1)
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
      count,
      interval,
      longBreak,
      pomoTime,
      setIsOnLongBreak,
      setIsOnPomoSession,
      setIsOnShortBreak,
      setTimer,
      setSBTimer,
      setLBTimer,
      shortBreak,
      setCount,
    ]
  )

  const displayTime = () => {
    // show Begin! only on the initial pomo session of the day
    if (isOnPomoSession && count === 0) return "Begin!"
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
          baseMins = shortBreak
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

        const remainedFraction = secsLeft / totalSecs
        // gradually reduce the dash array to be set to 0, so that when the
        // timer ends, the animation also ends at the same time
        const reducer =
          remainedFraction - (1 / totalSecs) * (1 - remainedFraction)
        const updatedDashArr = reducer * FULL_DASH_ARRAY

        const circleDasharray = `${updatedDashArr.toFixed(
          0
        )} ${FULL_DASH_ARRAY}`
        setDashArrVal(circleDasharray)
      }, 1000)
    }
    return () => clearInterval(timerId)
  }, [
    paused,
    isOnLongBreak,
    isOnShortBreak,
    secsElapsed,
    pomoTime,
    shortBreak,
    longBreak,
    setDashArrVal,
    setLBTimer,
    setSBTimer,
    setTimer,
    tick,
    setIsOnLongBreak,
    setIsOnPomoSession,
    setIsOnShortBreak,
    setSecsElapsed,
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
