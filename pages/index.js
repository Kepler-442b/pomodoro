/**
 * File: /pages/index.js
 * Copyright (c) 2022 - Sooyeon Kim
 */
//TODO: reduce the time of loading the page (especially the image)
//TODO: improve the mobile version
import React, { useCallback, useEffect, useMemo, useState } from "react"
import axios from "axios"
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth"
import { ref, getDownloadURL } from "firebase/storage"
import Head from "next/head"
import Image from "next/image"
import Script from "next/script"
import Cookie from "js-cookie"
import { createApi } from "unsplash-js"
import Confetti from "react-confetti"
import { unstable_batchedUpdates } from "react-dom"
import { ToastContainer, toast } from "react-toastify"
import { auth, storage } from "../firebase/clientApp"
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

export default function Home(props) {
  const { options } = props

  const [title, setTitle] = useState("Pomodoro")
  const [windowWidth, setWindowWidth] = useState(0)
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
  const [selectedAlarm /*selectAlarm*/] = useState(options[0])
  const [user, setUser] = useState()
  const [profilePic, setProfilePic] = useState(
    Cookie.get("profilePic") || "/UserIcon.svg"
  )
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

      setPomoTime(window.localStorage.getItem("pomoTime"))
      setShortBreak(window.localStorage.getItem("shortBreak"))
      setLongBreak(window.localStorage.getItem("longBreak"))
      setLongBreakInterval(window.localStorage.getItem("longBreakInterval"))
      setGoal(window.localStorage.getItem("goal"))
      setVolume(window.localStorage.getItem("volume"))
      setSessionCount(parseInt(Cookie.get("strikeToday") || sessionCount))
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
      audio.play()
    } else if (isOnPomoSession && sessionCount > 0) {
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

  const storageRef = ref(storage, "anya-bg.png")

  // Create a reference from a Google Cloud Storage URI
  // const gsReference = ref(
  //   storage,
  //   `gs://${storageRef.bucket}/${storageRef.fullPath}`
  // )
  // console.log("??", gsReference)

  getDownloadURL(storageRef)
    .then((url) => console.log("I am", url))
    .catch((error) => {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case "storage/object-not-found":
          // File doesn't exist
          break
        case "storage/unauthorized":
          // User doesn't have permission to access the object
          break
        case "storage/canceled":
          // User canceled the upload
          break

        // ...

        case "storage/unknown":
          // Unknown error occurred, inspect the server response
          break
      }
    })

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
          setProfilePic(result.user.photoURL)
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
          setProfilePic("/UserIcon.svg")
          handleResetProgress()
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
      setAudioFile(new Audio(selectedAlarm.value.audioStart))
    } else {
      setTimer([pomoTime, SECONDS])
      setIsOnShortBreak(true)
      setIsOnLongBreak(false)
      setIsOnPomoSession(false)
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

  const handleResetProgress = (resetCount = true) => {
    if (resetCount) setSessionCount(0)
    Cookie.set("strikeToday", 0)
    setTimer([pomoTime, SECONDS])
    setLBTimer([longBreak, SECONDS])
    setSBTimer([shortBreak, SECONDS])
    setSecsElapsed(0)
    setDashArrVal(`${FULL_DASH_ARRAY} ${FULL_DASH_ARRAY}`)
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
      <div className="fixed flex items-center justify-center w-full h-full">
        <Image
          alt={selectedAlarm?.value?.altText || "background"}
          src={selectedAlarm.value.theme}
          objectFit="cover"
          layout="fill"
          quality={100}
        />
      </div>
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
            icon={profilePic}
            handleOnClick={() => {
              if (user) {
                showSignOutModal(true)
              } else {
                handleResetProgress(false)
                handleSignIn()
              }
            }}
            styling={`circle-button-style ${selectedAlarm.value.btnClr} ${
              profilePic !== "/UserIcon.svg" ? "p-0" : ""
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
              windowWidth={windowWidth}
              options={options}
            />
          )}
        </div>
      </nav>
      <div className="flex justify-center layout-spaces">
        <MyTargetCounter
          goal={parseInt(goal)}
          current={sessionCount}
          showModal={showResetModal}
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
          {selectedAlarm.label !== "Nature" && (
            <Image
              objectFit="cover"
              src={currImg}
              alt="timer background"
              layout="fill"
              priority
            />
          )}
        </div>
      </div>
      <div className="buttonsWrapper">
        <MyButton
          text="START"
          toggleText="pause"
          showToggle={!paused}
          handleOnClick={() => {
            togglePaused(!paused)
            if (!isOnShortBreak && !isOnShortBreak && sessionCount === 0) {
              setIsOnPomoSession(!isOnPomoSession)
            }
          }}
          screenW={windowWidth}
          styling={`long-button-style ${selectedAlarm.value.btnClr}`}
          textOnly={true}
        />
        <MyButton
          text="SKIP"
          screenW={windowWidth}
          styling={`long-button-style ${selectedAlarm.value.btnClr}`}
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
      {selectedAlarm.value?.credit && (
        <div className="fixed z-50 grid px-3 mt-12 font-mono text-sm text-white ">
          Photo by:
          <a
            href={selectedAlarm.value?.creditLink}
            target="_blank"
            rel="noreferrer"
          >
            {selectedAlarm.value.credit}
          </a>
          {selectedAlarm.value?.location && (
            <div>{selectedAlarm.value.location}</div>
          )}
        </div>
      )}
      {/* <div className="chatButtonWrapper">
        <MyButton
          icon="/SummaryIcon.svg"
          styling={`circle-button-style `}
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

export const getServerSideProps = async () => {
  const unsplash = createApi({
    accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
  })

  let randomPhoto

  await unsplash.photos
    .getRandom({
      query: "lake",
      orientation: "landscape",
    })
    .then((res) => (randomPhoto = res.response))
  return {
    props: {
      options: [
        {
          value: {
            audioStart: "/game-start.mp3",
            audioBreak: "/game-break.mp3",
            charImg:
              "https://drive.google.com/uc?id=1rbTwRGp4S4EbMCp1umYhHKkZJBbHvw-F",
            bgImg:
              "https://drive.google.com/uc?id=1N2eWKjm4-52XTOHB9-G8HarghdvxF1Oi",
            btnClr: "bg-nature",
            theme: randomPhoto.urls.full,
            credit: randomPhoto.user.name,
            creditLink:
              randomPhoto.user.portfolio_url || randomPhoto.links.html || "",
            location: randomPhoto.location.name,
            altText: randomPhoto.alt_description,
          },
          label: "Nature",
        },
      ],
    },
  }
}
