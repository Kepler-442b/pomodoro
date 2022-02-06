import { useEffect, useState } from "react"
import Head from "next/head"
import Image from "next/image"
import levi from "../public/images/levi.jpeg"
import SettingsIcon from "../public/icons/SettingsIcon.svg"
import MyButton from "../src/components/button"
import MyTimer from "../src/components/timer"
import UserIcon from "../public/icons/UserIcon.svg"
import MyInputBox from "../src/components/inputbox"
import SearchIcon from "../public/icons/SearchIcon.svg"
import ChatBubbleIcon from "../public/icons/ChatBubbleIcon.svg"
import debounce from "../src/utils/debounce"

export default function Home() {
  const [windowWidth, setWindowWidth] = useState(0)
  const [paused, togglePaused] = useState(false)
  console.log("paused", paused)
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
      <nav className="navWrapper">
        <div className="top-left">
          <MyInputBox
            text=" search users.."
            icon={SearchIcon.src}
            styling="bg-secondary rounded-2xl h-10 md:w-full w-36"
            iconStyling="button-icon ml-2"
          />
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
            styling="bg-secondary "
            iconStyling="button-icon"
          />
        </div>
      </nav>
      <div className="timerWrapper mid-center">
        <div className="timer">
          <MyTimer target={{ minutes: 1, seconds: 0 }} paused={paused} />
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
