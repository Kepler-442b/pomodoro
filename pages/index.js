import Head from 'next/head'
import Image from 'next/image'
import levi from "../public/images/levi.jpeg"
import SettingsIcon from "../public/icons/SettingsIcon.svg"
import MyButton from '../src/components/button'
import UserIcon from "../public/icons/UserIcon.svg"
import MyInputBox from '../src/components/inputbox'
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
      <div className='grid grid-cols-12 gap-4'>
        <MyInputBox text="search users.." icon={SearchIcon.src} styling="basis-2/12 top-2" />
        <MyButton text="settings" icon={SettingsIcon.src} styling="top-2 bg-secondary basis-2/12" iconStyling="button-icon-spacing" />
        <MyButton text="users" icon={UserIcon.src} styling="top-2 bg-secondary basis-2/12" iconStyling="button-icon-spacing" />
      </div>
      <div className='flex flex-row'>
        <div className="relative w-32 h-32 overflow-hidden rounded-full ring-2 ring-pink-300 ring-offset-4 ">
          <Image
            objectFit='cover'
            src={levi}
            alt='Picture of Cat1'
            layout='fill'
            priority
          />
        </div>
      </div>
      <div className='flex flex-row'>
        <MyButton text="start" styling="top-10 long-button-style" />
        <MyButton text="skip" styling="top-30 long-button-style" />
      </div>
      <div className='flex flex-row'>
        <MyButton icon={ChatBubbleIcon.src} styling="top-10 circle-button-style bg-secondary" iconStyling="circle-icon-spacing" />
      </div>

    </>
  )
}
