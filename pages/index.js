import Head from "next/head"
import Image from "next/image"
import levi from "../public/images/levi.jpeg"
import SettingsIcon from "../public/icons/SettingsIcon.svg"
import MyButton from "../src/components/button"
import UserIcon from "../public/icons/UserIcon.svg"
import MyInputBox from "../src/components/inputbox"
import SearchIcon from "../public/icons/SearchIcon.svg"
import ChatBubbleIcon from "../public/icons/ChatBubbleIcon.svg"

export default function Home() {
  return (
    <>
      <Head>
        <title>Space and Anime Themed Pomodoro</title>
        <meta name="description" content="pomodoro" />
        <link rel="icon" href="/icons8-tomato-64.png" />
      </Head>
      <div className="background">
        <div className="bg-img" />
      </div>
      <div className="flex items-start mx-3 my-4 cc">
        <div className="top-left">
          <MyInputBox
            text=" search users.."
            icon={SearchIcon.src}
            styling="bg-secondary rounded-2xl h-10"
            iconStyling="button-icon-spacing ml-2"
          />
        </div>
        <div className="top-center" />
        <div className="flex top-right">
          <MyButton
            text="users"
            icon={UserIcon.src}
            styling="bg-secondary "
            iconStyling="button-icon-spacing"
          />
          <MyButton
            text="settings"
            icon={SettingsIcon.src}
            styling="bg-secondary "
            iconStyling="button-icon-spacing"
          />
        </div>
      </div>
      <div className="mx-3 my-4 centering">
        <div className="top-left" />
        <div className="relative overflow-hidden rounded-full w-timerRadius h-timerRadius ring-2 ring-primary ring-offset-4">
          <Image
            objectFit="cover"
            src={levi}
            alt="Picture of Levi"
            layout="fill"
            priority
          />
        </div>
        <div className="top-right" />
      </div>
      <div className="flex center-bottom">
        <div className="top-left" />
        <div className="top-center">
          <MyButton text="start" styling="long-button-style" />
          <MyButton text="skip" styling="long-button-style" />
        </div>
        <div className="top-right" />
      </div>
      <div className="flex center-end">
        <MyButton
          icon={ChatBubbleIcon.src}
          styling="circle-button-style bg-secondary"
          iconStyling="circle-icon-spacing"
        />
      </div>
    </>
  )
}
