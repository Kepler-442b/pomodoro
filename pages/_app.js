/**
 * File: /pages/_app.js
 * Copyright (c) 2022 - Sooyeon Kim
 */

import React from "react"
import "../styles/globals.css"
import PropTypes from "prop-types"

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

MyApp.propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.shape({ profilePic: PropTypes.string }),
}
MyApp.defaultProps = {
  pageProps: { profilePic: "" },
}

export default MyApp
