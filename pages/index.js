/**
 * File: /pages/index.js
 * Copyright (c) 2022 - Sooyeon Kim
 */

import { useCallback, useEffect, useRef, useState } from "react"
import axios from "axios"
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth"
import Cookie from "js-cookie"
import Script from "next/script"
import Head from "next/head"
import Image from "next/image"
import { ToastContainer, toast } from "react-toastify"
import { auth } from "../firebase/clientApp"
import Levi from "../public/images/levi.jpeg"
import DefaultBg from "../public/images/default-bg.png"
import SettingsIcon from "../public/icons/SettingsIcon.svg"
import SearchIcon from "../public/icons/SearchIcon.svg"
import UserIcon from "../public/icons/UserIcon.svg"
import SummaryIcon from "../public/icons/SummaryIcon.svg"
import ChatBubbleIcon from "../public/icons/ChatBubbleIcon.svg"
import MyButton from "../src/components/button"
import MyTimer from "../src/components/timer"
import MyTimerAnimation from "../src/components/timerAnimation"
import SettingsModal from "../src/components/settingsModal"
import MyTargetCounter from "../src/components/targetCounter"
import MyModal from "../src/components/modal"
import MyTextInputWithLabel from "../src/components/inputbox"
import debounce from "../src/utils/debounce"
import ReportModal from "../src/components/reportModal"
import "react-toastify/dist/ReactToastify.css"

export const SECONDS = "00"
export const FULL_DASH_ARRAY = 283
const LEVI_BREAK = "/levi-break.mp3"
const LEVI_START = "/levi-start.mp3"

export default function Home() {
  const [title, setTitle] = useState("Pomodoro")
  const [windowWidth, setWindowWidth] = useState(0)
  const [currImg, setCurrImg] = useState(DefaultBg)
  const [audio, setAudioFile] = useState(null)
  const [goal, setGoal] = useState(5)
  const [paused, togglePaused] = useState(true)
  const [profilePic, setProfilePic] = useState("")
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
  // const [alarmType, setAlarmType] = useState()

  const sessionCount = useRef(0)

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

    // window.localStorage.setItem( "alarm", alarm)
    setPomoTime(window.localStorage.getItem("pomoTime"))
    setShortBreak(window.localStorage.getItem("shortBreak"))
    setLongBreak(window.localStorage.getItem("longBreak"))
    setLongBreakInterval(window.localStorage.getItem("longBreakInterval"))
    setGoal(window.localStorage.getItem("goal"))
    setVolume(window.localStorage.getItem("volume"))
  }

  useEffect(() => {
    setIntialVals()
    setAudioFile(new Audio(LEVI_START))
    if (!document.cookie.includes("strikeToday")) {
      let date = new Date(Date.now() + 86400e3)
      date = date.toUTCString()
      document.cookie = `strikeToday=${sessionCount.current}; expires=${date}`
    } else {
      sessionCount.current = parseInt(document.cookie.split("strikeToday=")[1])
    }
  }, [])

  useEffect(() => {
    if (
      sessionCount.current > parseInt(document.cookie.split("strikeToday=")[1])
    ) {
      document.cookie = `strikeToday=${sessionCount.current}`
    }
  }, [sessionCount.current])

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
    if (audio) audio.volume = volume / 100
  }, [audio, volume])

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
    if (isOnShortBreak || isOnLongBreak) {
      setCurrImg(Levi)
      audio.play()
    } else if (isOnPomoSession && sessionCount.current > 0) {
      setCurrImg(DefaultBg)
      audio.play()
    }

    if (audio) {
      audio.addEventListener("ended", () => {
        if (isOnPomoSession && sessionCount.current > 0) {
          setAudioFile(new Audio(LEVI_BREAK))
        } else {
          setAudioFile(new Audio(LEVI_START))
        }
      })
    }
  }, [isOnLongBreak, isOnShortBreak, isOnPomoSession, sessionCount.current])

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

  const handleSaveSettings = useCallback(() => {
    window.localStorage.setItem("pomoTime", pomoTime)
    window.localStorage.setItem("shortBreak", shortBreak)
    window.localStorage.setItem("longBreak", longBreak)
    window.localStorage.setItem("longBreakInterval", longBreakInterval)
    window.localStorage.setItem("goal", goal)
    window.localStorage.setItem("volume", volume)

    // window.localStorage.setItem("alarm",alarm)
  }, [pomoTime, shortBreak, longBreak, longBreakInterval, goal, volume])

  const handleSkip = useCallback(() => {
    showSkipModal(false)
    if (isOnShortBreak || isOnLongBreak) {
      setSBTimer([shortBreak, SECONDS])
      setLBTimer([longBreak, SECONDS])
      setIsOnShortBreak(false)
      setIsOnLongBreak(false)
      setIsOnPomoSession(true)
      setCurrImg(DefaultBg)
      setAudioFile(new Audio(LEVI_START))
    } else {
      setTimer([pomoTime, SECONDS])
      setIsOnShortBreak(true)
      setIsOnLongBreak(false)
      setIsOnPomoSession(false)
      setCurrImg(Levi)
      setAudioFile(new Audio(LEVI_BREAK))
    }
    setSecsElapsed(0)
    setDashArrVal(`${FULL_DASH_ARRAY} ${FULL_DASH_ARRAY}`)
    togglePaused(false)
  }, [isOnShortBreak, isOnLongBreak, pomoTime])

  const handleResetProgress = () => {
    document.cookie = "strikeToday=0"
    sessionCount.current = 0
    setTimer([pomoTime, SECONDS])
    setLBTimer([longBreak, SECONDS])
    setSBTimer([shortBreak, SECONDS])
    setSecsElapsed(0)
    setDashArrVal(`${FULL_DASH_ARRAY} ${FULL_DASH_ARRAY}`)
    setCurrImg(DefaultBg)
    setAudioFile(new Audio(LEVI_START))
    togglePaused(true)
    setIsOnPomoSession(false)
    setIsOnLongBreak(false)
    setIsOnShortBreak(false)
    showResetModal(false)
  }

  const [user, setUser] = useState(null)

  // subscribe to the auth change
  const unSubAuth = onAuthStateChanged(auth, (currUser) => {
    if (currUser) {
      setUser(currUser)
      setProfilePic(currUser.photoURL)
      unSubAuth()
    }
  })

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider()

    signInWithPopup(auth, provider)
      .then(async (result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result)
        // const token = credential.accessToken

        // The signed-in user info.
        const photo = result.user.photoURL
        if (photo) setProfilePic(photo)

        await axios
          .post(`/api/users/login`, { result, credential })
          .then((res) => {
            Cookie.set("userId", res.data.userId)
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
        const errorCode = error.code
        const errorMessage = error.message
        // The email of the user's account used.
        const email = error.email
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error)
        // ...
      })
  }

  const handleSignOut = async () => {
    if (window)
      try {
        await signOut(auth)
        setUser(null)
        setProfilePic(null)
        toast.success("Successfully logged out!", {
          autoClose: 1500,
          hideProgressBar: true,
          pauseOnHover: true,
          position: "bottom-right",
        })
      } catch (err) {
        throw new Error(err.message)
      }
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

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="pomodoro" />
        <link rel="icon" href="/ClockfaceIcon.png" />
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
            {/* <MyTextInputWithLabel
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
            /> */}
          </div>
        </div>
        <div className="flex top-right">
          <MyButton
            icon={profilePic ? profilePic : UserIcon.src}
            handleOnClick={() => {
              if (user) {
                showSignOutModal(true)
              } else {
                handleSignIn()
              }
            }}
            styling="circle-button-style bg-secondary"
            iconStyling="circle-icon"
          />
          {
            <MyModal
              isOpen={isSignOutModalOpen}
              showModal={showSignOutModal}
              handleConfirm={handleSignOut}
              message="Are you sure you want to sign out?"
              btnMsg="Yes"
            />
          }
          <MyButton
            icon={SummaryIcon.src}
            handleOnClick={handleShowReport}
            styling="circle-button-style bg-secondary"
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
            icon={SettingsIcon.src}
            handleOnClick={() => toggleSettings(!isSettingsOpen)}
            styling="circle-button-style bg-secondary"
            iconStyling="circle-icon"
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
              windowWidth={windowWidth}
              handleSave={handleSaveSettings}
              goal={goal}
              setGoal={setGoal}
              volume={volume}
              setVolume={setVolume}
              audio={audio}
            />
          )}
        </div>
      </nav>
      <div className="flex justify-center layout-spaces">
        <MyTargetCounter
          goal={goal}
          current={sessionCount.current}
          showModal={showResetModal}
          count={sessionCount.current}
        />
      </div>
      <div className="timerWrapper mid-center">
        <MyTimerAnimation dashArrVal={dashArrVal} />
        <div className="timer">
          <MyTimer
            pomoTime={pomoTime}
            shortBreak={shortBreak}
            longBreak={longBreak}
            interval={longBreakInterval}
            paused={paused}
            count={sessionCount}
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
            if (
              !isOnShortBreak &&
              !isOnShortBreak &&
              sessionCount.current === 0
            ) {
              setIsOnPomoSession(!isOnPomoSession)
            }
          }}
          screenW={windowWidth}
          styling="long-button-style"
          textOnly={true}
        />
        <MyButton
          // isDisabled={sessionCount.current === 0 ? true : false}
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
        />
      )}
      <div className="chatButtonWrapper">
        <MyButton
          icon={ChatBubbleIcon.src}
          styling="circle-button-style bg-secondary"
          iconStyling="circle-icon"
        />
      </div>
      <ToastContainer theme="dark" />
    </>
  )
}
