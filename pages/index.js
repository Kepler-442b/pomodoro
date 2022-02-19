/**
 * File: /pages/index.js
 * Copyright (c) 2022 - Sooyeon Kim
 */

import { useEffect, useState } from "react"
import Script from "next/script"
import Head from "next/head"
import Image from "next/image"
import Modal from "react-modal"
import Select from "react-select"
import levi from "../public/images/levi.jpeg"
import SettingsIcon from "../public/icons/SettingsIcon.svg"
import MyButton from "../src/components/button"
import MyTimer from "../src/components/timer"
import UserIcon from "../public/icons/UserIcon.svg"
import MyTextInputWithLabel from "../src/components/inputbox"
import SearchIcon from "../public/icons/SearchIcon.svg"
import ChatBubbleIcon from "../public/icons/ChatBubbleIcon.svg"
import debounce from "../src/utils/debounce"

export default function Home() {
  const [windowWidth, setWindowWidth] = useState(0)
  const [paused, togglePaused] = useState(true)
  const [isSettingsOpen, toggleSettings] = useState(false)
  const [targetTime, setTargetTime] = useState({ minutes: "00", seconds: "10" })
  const [selectedOption, setSelectedOption] = useState(null)
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

  const handleSelectOption = (e) => {
    console.log(e)
    // setSelectedOption
  }

  Modal.setAppElement("#__next")

  console.log("isSettingsOpen,", isSettingsOpen)
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
            <Modal
              className="settingsModal"
              isOpen={isSettingsOpen}
              onRequestClose={() => toggleSettings(false)}
              style={{ overlay: { backgroundColor: "transparent" } }}
              contentLabel="Example Modal"
            >
              <div className="modalTitle">TIMER SETTINGS</div>
              <div id="mainTimerSetting" className="settingGroup">
                <div className="modalSubtitle">Time(minutes)</div>
                <div className="px-3">
                  <label className="modalLabel" htmlFor="pomodoroInput">
                    pomodoro
                  </label>
                  <label className="modalLabel" htmlFor="shortBreakInput">
                    short break
                  </label>
                  <label className="modalLabel" htmlFor="longBreakInput">
                    long break
                  </label>
                  <input
                    className="modalInput"
                    id="pomodoroInput"
                    type="number"
                    min={0}
                    max={60}
                    step={1}
                    value={25}
                  />
                  <input
                    className="modalInput"
                    id="shortBreakInput"
                    type="number"
                    min={0}
                    max={10}
                    step={1}
                    value={5}
                  />
                  <input
                    className="modalInput"
                    id="longBreakInput"
                    type="number"
                    min={0}
                    max={60}
                    step={1}
                    value={15}
                  />
                </div>
              </div>
              <div id="intervalSetting" className="settingGroup">
                <div className="modalSubtitle">Long break every..</div>
                <div className="px-3">
                  <input
                    className="modalInput"
                    id="intervalInput"
                    type="number"
                    min={1}
                    max={10}
                    step={1}
                    value={5}
                  />
                  <label className="modalLabel" htmlFor="pomodoroInput">
                    pomodoro(s)
                  </label>
                </div>
              </div>
              <div id="soundSetting" className="settingGroup">
                <div className="modalSubtitle">Alarm Sound</div>
                <div className="px-3 ">
                  <Select
                    className="font-semibold border-2 border-black border-solid rounded-md w-64mx-2"
                    onChange={(option) => setSelectedOption(option)}
                    value={selectedOption}
                    options={[
                      { value: "Levi Ackerman", label: "Levi Ackerman" },
                      { value: "Eren Jaeger", label: "Eren Jaeger" },
                    ]}
                  />
                </div>
              </div>
            </Modal>
          )}
        </div>
      </nav>
      <div className="timerWrapper mid-center">
        <div className="timer">
          <MyTimer pomoTime={targetTime} paused={paused} />
          <Image
            objectFit="cover"
            src={levi}
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
