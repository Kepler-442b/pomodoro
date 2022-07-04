/**
 * File: /pages/_app.js
 * Copyright (c) 2022 - Sooyeon Kim
 */

import React from "react"
import PropTypes from "prop-types"
import "../styles/globals.css"

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

MyApp.propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.object.isRequired,
}

export default MyApp
