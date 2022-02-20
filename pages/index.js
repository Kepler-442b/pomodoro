/**
 * File: /pages/index.js
 * Copyright (c) 2022 - Sooyeon Kim
 */

import { useCallback, useEffect, useState } from "react"
import Script from "next/script"
import Head from "next/head"
import Image from "next/image"
import levi from "../public/images/levi.jpeg"
import DefaultBg from "../public/images/default-bg.png"
import SettingsIcon from "../public/icons/SettingsIcon.svg"
import MyButton from "../src/components/button"
import MyTimer from "../src/components/timer"
import UserIcon from "../public/icons/UserIcon.svg"
import MyTextInputWithLabel from "../src/components/inputbox"
import SearchIcon from "../public/icons/SearchIcon.svg"
import ChatBubbleIcon from "../public/icons/ChatBubbleIcon.svg"
import debounce from "../src/utils/debounce"
import SettingsModal from "../src/components/settingsModal"

export default function Home() {
  const [windowWidth, setWindowWidth] = useState(0)
  const [paused, togglePaused] = useState(true)
  const [isSettingsOpen, toggleSettings] = useState(false)
  const [pomoTime, setPomoTime] = useState("25")
  const [shortBreak, setShortBreak] = useState("5")
  const [longBreak, setLongBreak] = useState("15")
  const [interval, setInterval] = useState(5)
  // const [alarm, setAlarm] = useState("")
  const [isOnShortBreak, setIsOnShortBreak] = useState(false)
  const [isOnLongBreak, setIsOnLongBreak] = useState(false)

  const setIntialVals = () => {
    window.localStorage.setItem(
      "pomoTime",
      window.localStorage.getItem("pomoTime") || pomoTime
    )
    window.localStorage.setItem(
      "shortBreak",
      window.localStorage.getItem("shortBreak") || shortBreak
    )
    window.localStorage.setItem(
      "longBreak",
      window.localStorage.getItem("longBreak") || longBreak
    )
    window.localStorage.setItem(
      "interval",
      window.localStorage.getItem("interval") || interval
    )
    // window.localStorage.setItem("alarm",alarm)
    setPomoTime(window.localStorage.getItem("pomoTime"))
    setShortBreak(window.localStorage.getItem("shortBreak"))
    setLongBreak(window.localStorage.getItem("longBreak"))
    setInterval(window.localStorage.getItem("interval"))
  }

  const handleSaveSettings = useCallback(() => {
    window.localStorage.setItem("pomoTime", pomoTime)
    window.localStorage.setItem("shortBreak", shortBreak)
    window.localStorage.setItem("longBreak", longBreak)
    window.localStorage.setItem("interval", interval)
    // window.localStorage.setItem("alarm",alarm)
  }, [pomoTime, shortBreak, longBreak, interval])

  useEffect(() => {
    setIntialVals()
  }, [])

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
        referrerPolicy="no-referrer"
        // crossOrigin="anonymous"
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
              interval={interval}
              setInterval={setInterval}
              screenW={windowWidth}
              handleSave={handleSaveSettings}
            />
          )}
        </div>
      </nav>
      <div className="timerWrapper mid-center">
        <div className="timer">
          <MyTimer
            pomoTime={pomoTime}
            shortBreak={shortBreak}
            longBreak={longBreak}
            paused={paused}
          />
          <Image
            objectFit="cover"
            src={DefaultBg}
            alt="Picture of Levi"
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
          handleOnClick={() => togglePaused(!paused)}
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