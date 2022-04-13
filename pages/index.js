/**
 * File: /pages/index.js
 * Copyright (c) 2022 - Sooyeon Kim
 */

import { useCallback, useEffect, useRef, useState } from "react"
import Script from "next/script"
import Head from "next/head"
import Image from "next/image"
import Levi from "../public/images/levi.jpeg"
import DefaultBg from "../public/images/default-bg.png"
import SettingsIcon from "../public/icons/SettingsIcon.svg"
import MyButton from "../src/components/button"
import MyTimer from "../src/components/timer"
import MyTimerAnimation from "../src/components/timerAnimation"
import UserIcon from "../public/icons/UserIcon.svg"
import MyTextInputWithLabel from "../src/components/inputbox"
import SearchIcon from "../public/icons/SearchIcon.svg"
import ChatBubbleIcon from "../public/icons/ChatBubbleIcon.svg"
import debounce from "../src/utils/debounce"
import SettingsModal from "../src/components/settingsModal"

export const SECONDS = "06" // TODO: change to 00
export const FULL_DASH_ARRAY = 283

export const LEVI_BREAK = "/levi-break.mp3"
export const LEVI_START = "/levi-start.mp3"

export default function Home() {
  const [windowWidth, setWindowWidth] = useState(0)
  const [currImg, setCurrImg] = useState(DefaultBg)
  const [audio, setAudioFile] = useState(null)

  const [paused, togglePaused] = useState(true)
  const [isSettingsOpen, toggleSettings] = useState(false)
  const [pomoTime, setPomoTime] = useState("0")
  const [shortBreak, setShortBreak] = useState("0")
  const [longBreak, setLongBreak] = useState("15")
  const [longBreakInterval, setLongBreakInterval] = useState(5)
  const [isOnPomoSession, setIsOnPomoSession] = useState(false)
  const [isOnShortBreak, setIsOnShortBreak] = useState(false)
  const [isOnLongBreak, setIsOnLongBreak] = useState(false)
  const [[currMins, currSecs], setTimer] = useState([pomoTime, SECONDS])
  const [[currSBMins, currSBSecs], setSBTimer] = useState([shortBreak, SECONDS])
  const [[currLBMins, currLBSecs], setLBTimer] = useState([longBreak, SECONDS])
  const [dashArrVal, setDashArrVal] = useState(
    `${FULL_DASH_ARRAY} ${FULL_DASH_ARRAY}`
  )
  const [secsElapsed, setSecsElapsed] = useState(0)

  const countPomodoro = useRef(0)

  const setIntialVals = () => {
    window.localStorage.setItem("pomoTime", pomoTime)
    window.localStorage.setItem(
      "shortBreak",
      window.localStorage.getItem("shortBreak")
    )
    window.localStorage.setItem(
      "longBreak",
      window.localStorage.getItem("longBreak") || longBreak
    )
    window.localStorage.setItem(
      "longBreakInterval",
      window.localStorage.getItem("longBreakInterval") || longBreakInterval
    )
    // window.localStorage.setItem("alarm",alarm)
    setPomoTime(window.localStorage.getItem("pomoTime"))
    setShortBreak(window.localStorage.getItem("shortBreak"))
    setLongBreak(window.localStorage.getItem("longBreak"))
    setLongBreakInterval(window.localStorage.getItem("longBreakInterval"))
  }

  const handleSaveSettings = useCallback(() => {
    window.localStorage.setItem("pomoTime", pomoTime)
    window.localStorage.setItem("shortBreak", shortBreak)
    window.localStorage.setItem("longBreak", longBreak)
    window.localStorage.setItem("longBreakInterval", longBreakInterval)
    // window.localStorage.setItem("alarm",alarm)
  }, [pomoTime, shortBreak, longBreak, longBreakInterval])

  useEffect(() => {
    setIntialVals()
    setAudioFile(new Audio(LEVI_BREAK))
  }, [])

  useEffect(() => {
    if (
      (currMins === "00" &&
        currSecs === "00" &&
        !isOnLongBreak &&
        !isOnShortBreak) ||
      (currSBMins === "00" && currSBSecs === "00" && isOnShortBreak) ||
      (currLBMins === "00" && currLBSecs === "00" && isOnLongBreak)
    ) {
      setSecsElapsed(0)
      setDashArrVal(`${FULL_DASH_ARRAY} ${FULL_DASH_ARRAY}`)
    }
  }, [currMins, currSecs, currSBMins, currSBSecs, currLBMins, currLBSecs])

  useEffect(() => {
    setWindowWidth(window.innerWidth)

    window.addEventListener(
      "resize",
      debounce(() => {
        setWindowWidth(window.innerWidth)
      })
    )
    return () => {}
  }, [windowWidth])

  useEffect(() => {
    if (isOnShortBreak || isOnLongBreak) {
      console.log("on break", audio)
      setCurrImg(Levi)
      audio.play()
    } else if (isOnPomoSession && countPomodoro.current > 1) {
      setCurrImg(DefaultBg)
      console.log("on pomo session", audio, countPomodoro.current)
      audio.play()
    }

    if (audio) {
      audio.addEventListener("ended", () => {
        if (isOnPomoSession && countPomodoro.current > 1) {
          setAudioFile(new Audio(LEVI_BREAK))
        } else if (isOnLongBreak || isOnShortBreak) {
          setAudioFile(new Audio(LEVI_START))
        }
      })
    }
  }, [isOnLongBreak, isOnShortBreak, isOnPomoSession, countPomodoro.current])

  console.log("dashvalarl", dashArrVal)
  return (
    <>
      <Head>
        <title>Space and Anime Themed Pomodoro</title>
        <meta name="description" content="pomodoro" />
        <link rel="icon" href="/icons8-tomato-64.png" />
      </Head>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/react-modal/3.14.3/react-modal.min.js"
        strategy="lazyOnload"
        // integrity="sha512-MY2jfK3DBnVzdS2V8MXo5lRtr0mNRroUI9hoLVv2/yL3vrJTam3VzASuKQ96fLEpyYIT4a8o7YgtUs5lPjiLVQ=="
        // crossOrigin="anonymous"
        referrerPolicy="no-referrer"
        onError={(e) => {
          console.error("Script failed to load", e)
        }}
      />
      <nav className="navWrapper">
        <div className="top-left">
          <div className="flex h-full rounded-2xl bg-secondary">
            <MyTextInputWithLabel
              inputId="search-user"
              inputStyle="input-basic-style bg-secondary rounded-2xl h-10 md:w-full w-36"
              labelElement={
                <img
                  src={SearchIcon.src}
                  alt="icon"
                  className={"button-icon ml-2"}
                />
              }
              labelStyle="flex items-center"
              placeHolderText=" search users.."
            />
          </div>
        </div>
        <div className="flex top-right">
          <MyButton
            text="users"
            screenW={windowWidth}
            icon={UserIcon.src}
            styling="bg-secondary "
            iconStyling="button-icon"
          />
          <MyButton
            text="settings"
            screenW={windowWidth}
            icon={SettingsIcon.src}
            handleOnClick={() => toggleSettings(!isSettingsOpen)}
            styling="bg-secondary "
            iconStyling="button-icon"
          />
          {isSettingsOpen && (
            <SettingsModal
              handleToggle={toggleSettings}
              isOpen={isSettingsOpen}
              pomoTime={pomoTime}
              setPomoTime={setPomoTime}
              shortBreak={shortBreak}
              setShortBreak={setShortBreak}
              longBreak={longBreak}
              setLongBreak={setLongBreak}
              longBreakInterval={longBreakInterval}
              setLongBreakInterval={setLongBreakInterval}
              screenW={windowWidth}
              handleSave={handleSaveSettings}
            />
          )}
        </div>
      </nav>
      <div className="timerWrapper mid-center">
        <MyTimerAnimation dashArrVal={dashArrVal} />
        <div className="timer">
          <MyTimer
            pomoTime={pomoTime}
            shortBreak={shortBreak}
            longBreak={longBreak}
            paused={paused}
            count={countPomodoro}
            isOnPomoSession={isOnPomoSession}
            isOnShortBreak={isOnShortBreak}
            isOnLongBreak={isOnLongBreak}
            setIsOnPomoSession={setIsOnPomoSession}
            setIsOnShortBreak={setIsOnShortBreak}
            setIsOnLongBreak={setIsOnLongBreak}
            setAudioFile={setAudioFile}
            currMins={currMins}
            currSecs={currSecs}
            currSBMins={currSBMins}
            currSBSecs={currSBSecs}
            currLBMins={currLBMins}
            currLBSecs={currLBSecs}
            setTimer={setTimer}
            setSBTimer={setSBTimer}
            setLBTimer={setLBTimer}
            setDashArrVal={setDashArrVal}
            secsElapsed={secsElapsed}
            setSecsElapsed={setSecsElapsed}
          />
          <Image
            objectFit="cover"
            src={currImg}
            alt="timer background"
            layout="fill"
            priority
          />
        </div>
      </div>
      <div className="buttonsWrapper">
        <MyButton
          text="start"
          toggleText="pause"
          showToggle={!paused}
          handleOnClick={() => {
            togglePaused(!paused)
            if (!isOnShortBreak && !isOnShortBreak) {
              setIsOnPomoSession(!isOnPomoSession)
            }
          }}
          screenW={windowWidth}
          styling="long-button-style"
          textOnly={true}
        />
        <MyButton
          text="skip"
          screenW={windowWidth}
          styling="long-button-style"
          textOnly={true}
        />
      </div>
      <div className="chatButtonWrapper">
        <MyButton
          icon={ChatBubbleIcon.src}
          styling="circle-button-style bg-secondary"
          iconStyling="circle-icon"
        />
      </div>
    </>
  )
}
