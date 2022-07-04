/**
 * File: /pages/_document.js
 * Copyright (c) 2022 - Sooyeon Kim
 */

import React from "react"
import Document, { Html, Head, Main, NextScript } from "next/document"
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
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
