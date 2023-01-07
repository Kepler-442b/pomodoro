/**
 * File: /pages/_app.js
 * Copyright (c) 2022 - Sooyeon Kim
 */

import React from "react"
import "../styles/globals.css"

interface MyAppProps {
  Component: React.FC
  pageProps: any
}

function MyApp(props: MyAppProps) {
  const { Component, pageProps } = props
  return <Component {...pageProps} />
}

export default MyApp
