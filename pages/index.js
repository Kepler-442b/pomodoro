import Head from 'next/head'
import Image from 'next/image'
import levi from "../public/images/levi.jpeg"

export default function Home() {
  return (
    <>
      <Head>
        <title>Space and Anime Themed Pomodoro</title>
        <meta name="description" content="pomodoro" />
        <link rel="icon" href="/icons8-tomato-64.png" />
      </Head>
      <div className="flex flex-col items-center justify-center w-full h-screen">
        <h1 className="text-3xl">Pomodoro</h1>
      </div>
      <div className="relative w-32 h-32 overflow-hidden rounded-full ring-2 ring-pink-300 ring-offset-4 ">
        {/* <Image
          objectFit='cover'
          src={levi}
          alt='Picture of Cat1'
          layout='fill'
          priority
        /> */}
      </div>
    </>
  )
}
