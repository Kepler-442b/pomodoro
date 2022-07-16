/**
 * File: /pages/index.js
 * Copyright (c) 2022 - Sooyeon Kim
 */

import axios from "axios"
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth"
import Head from "next/head"
import Image from "next/image"
import Script from "next/script"
import Cookie from "js-cookie"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import Confetti from "react-confetti"
import { unstable_batchedUpdates } from "react-dom"
import { ToastContainer, toast } from "react-toastify"
import { auth } from "../firebase/clientApp"
import MyButton from "../src/components/button"
// import MyTextInputWithLabel from "../src/components/inputbox"
import MyModal from "../src/components/modal"
import ReportModal from "../src/components/reportModal"
import SettingsModal from "../src/components/settingsModal"
import MyTimer from "../src/components/timer"
import MyTimerAnimation from "../src/components/timerAnimation"
import MyTargetCounter from "../src/components/targetCounter"
import debounce from "../src/utils/debounce"
import { FULL_DASH_ARRAY, SECONDS } from "../src/utils/constant"
import { getYYYYMMDD } from "../src/utils/date"
import "react-toastify/dist/ReactToastify.css"

export const ALARM_SELECT_OPTIONS = [
  {
    value: {
      audioStart: "/game-start.mp3",
      audioBreak: "/game-break.mp3",
      charImg: "/peanut.jpg",
      bgImg: "/default-wallpaper.jpg",
      btnClr: "bg-tertiary",
      theme: "/default-wallpaper.jpg",
    },
    label: "Default Sound",
  },
  {
    value: {
      audioStart: "/levi-start.mp3",
      audioBreak: "/levi-break.mp3",
      charImg: "/Levi.jpeg",
      bgImg: "levi-wallpaper.jpg",
      btnClr: "bg-secondary",
      theme: "/levi-wallpaper.jpg",
    },
    label: "Levi Ackerman",
  },
  {
    value: {
      audioStart: "/anya-start.mp3",
      audioBreak: "/anya-break.mp3",
      charImg: "/Anya.png",
      bgImg: "/anya-wallpaper.jpg",
      btnClr: "bg-quaternary",
      theme: "/anya-wallpaper.jpg",
    },
    label: "Anya Foger",
  },
]

export default function Home() {
  const [title, setTitle] = useState("Pomodoro")
  const [windowWidth, setWindowWidth] = useState(0)
  const [currImg, setCurrImg] = useState("/default-wallpaper.jpg")
  const [audio, setAudioFile] = useState(null)
  const [goal, setGoal] = useState(5)
  const [paused, togglePaused] = useState(true)
  const [isSettingsOpen, toggleSettings] = useState(false)
  const [isSignOutModalOpen, showSignOutModal] = useState(false)
  const [isReportOpen, showReport] = useState(false)
  const [isSkipModalOpen, showSkipModal] = useState(false)
  const [isResetModalOpen, showResetModal] = useState(false)
  const [pomoTime, setPomoTime] = useState("25")
  const [shortBreak, setShortBreak] = useState("5")
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
  const [volume, setVolume] = useState(30)
  const [selectedAlarm, selectAlarm] = useState(ALARM_SELECT_OPTIONS[0])
  const [user, setUser] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [sessionCount, setSessionCount] = useState(0)

  const setIntialVals = () => {
    if (typeof window !== "undefined") {
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
        "longBreakInterval",
        window.localStorage.getItem("longBreakInterval") || longBreakInterval
      )
      window.localStorage.setItem(
        "goal",
        window.localStorage.getItem("goal") || goal
      )
      window.localStorage.setItem(
        "volume",
        window.localStorage.getItem("volume") || volume
      )
      window.localStorage.setItem(
        "selectedAlarm",
        window.localStorage.getItem("selectedAlarm") ||
          JSON.stringify(selectedAlarm)
      )

      setPomoTime(window.localStorage.getItem("pomoTime"))
      setShortBreak(window.localStorage.getItem("shortBreak"))
      setLongBreak(window.localStorage.getItem("longBreak"))
      setLongBreakInterval(window.localStorage.getItem("longBreakInterval"))
      setGoal(window.localStorage.getItem("goal"))
      setVolume(window.localStorage.getItem("volume"))
      selectAlarm(JSON.parse(window.localStorage.getItem("selectedAlarm")))
      setSessionCount(parseInt(Cookie.get("strikeToday")))
    }
  }

  const expiration = useMemo(() => {
    const today = new Date()
    const tomorrow = new Date(new Date(getYYYYMMDD(today)))
    tomorrow.setDate(tomorrow.getDate() + 1)
    return new Date(tomorrow.getTime() + today.getTimezoneOffset() * 60000)
  }, [])

  useEffect(() => {
    setIntialVals()
    if (!Cookie.get("strikeToday")) {
      document.cookie = `strikeToday=0; expires=${expiration} sameSite=strict;`
    }
  }, [expiration])

  useEffect(() => {
    if (sessionCount >= Cookie.get("strikeToday")) {
      Cookie.set("strikeToday", sessionCount)
    }
  }, [sessionCount])

  useEffect(() => {
    setAudioFile(new Audio(selectedAlarm.value.audioStart))
    setCurrImg(selectedAlarm.value.bgImg)
  }, [selectedAlarm])

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth)

      window.addEventListener(
        "resize",
        debounce(() => {
          setWindowWidth(window.innerWidth)
        })
      )
      return () => window.removeEventListener("resize", debounce)
    }
  }, [windowWidth])

  useEffect(() => {
    if (audio) audio.volume = volume / 100
  }, [audio, volume])

  useEffect(() => {
    if (goal == sessionCount && (isOnShortBreak || isOnLongBreak)) {
      toast.success("Congratulations! You have reached your goal for today!", {
        autoClose: 4000,
        position: "top-center",
      })
    }
  }, [goal, isOnLongBreak, isOnShortBreak, sessionCount])

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
  }, [
    currMins,
    currSecs,
    currSBMins,
    currSBSecs,
    currLBMins,
    currLBSecs,
    isOnLongBreak,
    isOnShortBreak,
  ])

  useEffect(() => {
    if (isOnShortBreak || isOnLongBreak) {
      setCurrImg(selectedAlarm.value.charImg)
      audio.play()
    } else if (isOnPomoSession && sessionCount > 0) {
      setCurrImg(selectedAlarm.value.bgImg)
      audio.play()
    }

    if (audio) {
      audio.addEventListener("ended", () => {
        if (isOnPomoSession && sessionCount > 0) {
          setAudioFile(new Audio(selectedAlarm.value.audioBreak))
        } else {
          setAudioFile(new Audio(selectedAlarm.value.audioStart))
        }
      })
    }
  }, [
    isOnLongBreak,
    isOnShortBreak,
    isOnPomoSession,
    selectedAlarm.value.audioStart,
    selectedAlarm.value.audioBreak,
    selectedAlarm.value.bgImg,
    selectedAlarm.value.charImg,
    sessionCount,
  ])

  useEffect(() => {
    if (isOnPomoSession) setTitle(`On session for ${currMins}:${currSecs}`)
    else if (isOnLongBreak) setTitle(`On break for ${currLBMins}:${currLBSecs}`)
    else if (isOnShortBreak)
      setTitle(`On break for ${currSBMins}:${currSBSecs}`)
    else setTitle("Pomodoro")
  }, [
    isOnPomoSession,
    isOnLongBreak,
    isOnShortBreak,
    currMins,
    currSecs,
    currLBMins,
    currLBSecs,
    currSBMins,
    currSBSecs,
  ])

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currUser) => {
      unstable_batchedUpdates(() => {
        setUser(currUser?.uid)
        setIsLoading(false)
      })
      console.log("Auth state changed")
    })
    return () => unsub
  }, [])

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider()

    signInWithPopup(auth, provider)
      .then(async (result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result)
        // const token = credential.accessToken

        // The signed-in user info.
        if (result.user?.photoURL) {
          Cookie.set("profilePic", result.user.photoURL, { expires: 14 })
        }

        await axios
          .post(`/api/users/login`, { result, credential })
          .then((res) => {
            Cookie.set("userId", res.data.userId, { expires: 14 })
          })
      })
      .then(() =>
        toast.success("Successfully logged in!", {
          autoClose: 1500,
          hideProgressBar: true,
          pauseOnHover: true,
          position: "bottom-right",
        })
      )
      .catch((error) => {
        // Handle Errors here.
        const { code, message, email } = error
        // The AuthCredential type that was used.
        // const credential = GoogleAuthProvider.credentialFromError(error)
        toast.error(
          `Error while logging in ${email}: ${message}(error code: ${code})`
        )
      })
  }
  const handleSignOut = async () => {
    if (window)
      try {
        await signOut(auth).then(() => {
          Cookie.remove("userId")
          Cookie.remove("profilePic")
        })
        toast.success("Successfully logged out!", {
          autoClose: 1500,
          hideProgressBar: true,
          pauseOnHover: true,
          position: "bottom-right",
        })
      } catch (err) {
        toast.error(
          `Error while signing out: ${err.message}(error code: ${err.code})`,
          { autoClose: false }
        )
      }
  }

  const handleSaveSettings = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("pomoTime", pomoTime)
      window.localStorage.setItem("shortBreak", shortBreak)
      window.localStorage.setItem("longBreak", longBreak)
      window.localStorage.setItem("longBreakInterval", longBreakInterval)
      window.localStorage.setItem("goal", goal)
      window.localStorage.setItem("volume", volume)
      window.localStorage.setItem(
        "selectedAlarm",
        JSON.stringify(selectedAlarm)
      )
    }
  }, [
    pomoTime,
    shortBreak,
    longBreak,
    longBreakInterval,
    goal,
    volume,
    selectedAlarm,
  ])

  const handleSkip = useCallback(() => {
    showSkipModal(false)
    if (isOnShortBreak || isOnLongBreak) {
      setSBTimer([shortBreak, SECONDS])
      setLBTimer([longBreak, SECONDS])
      setIsOnShortBreak(false)
      setIsOnLongBreak(false)
      setIsOnPomoSession(true)
      setCurrImg(selectedAlarm.value.bgImg)
      setAudioFile(new Audio(selectedAlarm.value.audioStart))
    } else {
      setTimer([pomoTime, SECONDS])
      setIsOnShortBreak(true)
      setIsOnLongBreak(false)
      setIsOnPomoSession(false)
      setCurrImg(selectedAlarm.value.charImg)
      setAudioFile(new Audio(selectedAlarm.value.audioBreak))
    }
    setSecsElapsed(0)
    setDashArrVal(`${FULL_DASH_ARRAY} ${FULL_DASH_ARRAY}`)
    togglePaused(false)
  }, [
    isOnShortBreak,
    isOnLongBreak,
    pomoTime,
    shortBreak,
    longBreak,
    selectedAlarm.value.audioStart,
    selectedAlarm.value.audioBreak,
    selectedAlarm.value.bgImg,
    selectedAlarm.value.charImg,
  ])

  const handleResetProgress = () => {
    setSessionCount(0)
    Cookie.set("strikeToday", 0)
    setTimer([pomoTime, SECONDS])
    setLBTimer([longBreak, SECONDS])
    setSBTimer([shortBreak, SECONDS])
    setSecsElapsed(0)
    setDashArrVal(`${FULL_DASH_ARRAY} ${FULL_DASH_ARRAY}`)
    setCurrImg(selectedAlarm.value.bgImg)
    setAudioFile(new Audio(selectedAlarm.value.audioStart))
    togglePaused(true)
    setIsOnPomoSession(false)
    setIsOnLongBreak(false)
    setIsOnShortBreak(false)
    showResetModal(false)
  }

  const handleShowReport = () => {
    if (!user) {
      return toast.info("You must be signed in to view your report.", {
        autoClose: 2100,
        hideProgressBar: true,
        pauseOnHover: true,
        position: "bottom-right",
      })
    }
    showReport(!isReportOpen)
  }

  return isLoading ? (
    <div />
  ) : (
    <>
      <Head>
        <title>{title}</title>
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
      <Image
        alt="background"
        src={selectedAlarm.value.theme}
        objectFit="cover"
        layout="fill"
        quality={100}
      />
      <nav className="navWrapper">
        <div className="top-left">
          <div className="flex h-full rounded-2xl bg-tertiary">
            {/* <MyTextInputWithLabel
              inputId="search-user"
              inputStyle="input-basic-style bg-tertiary rounded-2xl h-10 md:w-full w-36"
              labelElement={
                <img
                  src={SearchIcon.src}
                  alt="icon"
                  className={"button-icon ml-2"}
                />
              }
              labelStyle="flex items-center"
              placeHolderText=" search users.."
            /> */}
          </div>
        </div>
        <div className="flex top-right">
          <MyButton
            titleTxt={user ? "Logout" : "Login"}
            icon={user ? Cookie.get("profilePic") : "/UserIcon.svg"}
            handleOnClick={() => {
              if (user) {
                showSignOutModal(true)
              } else {
                handleSignIn()
              }
            }}
            styling={`circle-button-style ${selectedAlarm.value.btnClr} ${
              Cookie.get("profilePic") ? "p-0" : ""
            }`}
            iconStyling="circle-icon"
          />
          {
            <MyModal
              isOpen={isSignOutModalOpen}
              showModal={showSignOutModal}
              handleConfirm={handleSignOut}
              message="Are you sure you want to sign out?"
              btnMsg="Yes"
              btnClr={selectedAlarm.value.btnClr}
            />
          }
          <MyButton
            titleTxt={"Show Report"}
            icon="/SummaryIcon.svg"
            handleOnClick={handleShowReport}
            styling={`circle-button-style ${selectedAlarm.value.btnClr}`}
            iconStyling="circle-icon"
          />
          {isReportOpen && (
            <ReportModal
              isOpen={isReportOpen}
              showReport={showReport}
              windowWidth={windowWidth}
            />
          )}
          <MyButton
            titleTxt={"Open Settings"}
            icon="/SettingsIcon.svg"
            handleOnClick={() => toggleSettings(!isSettingsOpen)}
            styling={`circle-button-style ${selectedAlarm.value.btnClr}`}
            iconStyling="circle-icon"
          />
          {isSettingsOpen && (
            <SettingsModal
              isOpen={isSettingsOpen}
              handleToggle={toggleSettings}
              pomoTime={pomoTime}
              setPomoTime={setPomoTime}
              shortBreak={shortBreak}
              setShortBreak={setShortBreak}
              longBreak={longBreak}
              setLongBreak={setLongBreak}
              longBreakInterval={longBreakInterval}
              setLongBreakInterval={setLongBreakInterval}
              handleSave={handleSaveSettings}
              goal={parseInt(goal)}
              setGoal={setGoal}
              audio={audio}
              volume={volume}
              setVolume={setVolume}
              selectedAlarm={selectedAlarm}
              selectAlarm={selectAlarm}
              windowWidth={windowWidth}
            />
          )}
        </div>
      </nav>
      <div className="flex justify-center layout-spaces">
        <MyTargetCounter
          goal={parseInt(goal)}
          current={sessionCount}
          showModal={showResetModal}
          setCount={setSessionCount}
        />
      </div>
      <div className="timerWrapper mid-center">
        <MyTimerAnimation dashArrVal={dashArrVal} />
        <div className="timer">
          <MyTimer
            pomoTime={pomoTime}
            shortBreak={shortBreak}
            longBreak={longBreak}
            interval={parseInt(longBreakInterval)}
            paused={paused}
            count={sessionCount}
            setCount={setSessionCount}
            isOnShortBreak={isOnShortBreak}
            isOnLongBreak={isOnLongBreak}
            isOnPomoSession={isOnPomoSession}
            setIsOnPomoSession={setIsOnPomoSession}
            setIsOnShortBreak={setIsOnShortBreak}
            setIsOnLongBreak={setIsOnLongBreak}
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
            if (!isOnShortBreak && !isOnShortBreak && sessionCount === 0) {
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
          handleOnClick={() => {
            showSkipModal(!isSkipModalOpen)
            togglePaused(true)
          }}
        />
      </div>
      {isSkipModalOpen && (
        <MyModal
          isOpen={isSkipModalOpen}
          showModal={showSkipModal}
          pauseTimer={togglePaused}
          handleConfirm={handleSkip}
          message="Are you sure you want to skip the current session?"
          btnMsg="Skip"
          btnClr={selectedAlarm.value.btnClr}
        />
      )}
      {isResetModalOpen && (
        <MyModal
          isOpen={isResetModalOpen}
          showModal={showResetModal}
          pauseTimer={togglePaused}
          handleConfirm={handleResetProgress}
          message="Are you sure you want to reset the progress for today?"
          btnMsg="Reset"
          btnClr={selectedAlarm.value.btnClr}
        />
      )}
      {/* <div className="chatButtonWrapper">
        <MyButton
          icon={ChatBubbleIcon.src}
            styling={`circle-button-style ${selectedAlarm.value.btnClr}`}
          iconStyling="circle-icon"
        />
      </div> */}
      {goal == sessionCount && (isOnShortBreak || isOnLongBreak) && (
        <Confetti width={windowWidth} numberOfPieces={300} recycle={false} />
      )}
      <ToastContainer theme="dark" />
    </>
  )
}
