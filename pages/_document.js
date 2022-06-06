import Document, { Html, Head, Main, NextScript } from "next/document"
import Script from "next/script"

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta name="description" content="pomodoro" />
          <link
            href="https://fonts.googleapis.com/css2?family=Allerta+Stencil&display=swap"
            rel="stylesheet"
          />
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
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
