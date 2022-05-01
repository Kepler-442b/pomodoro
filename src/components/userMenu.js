/**
 * File: /src/components/userMenu.js
 * Copyright (c) 2022 - Sooyeon Kim
 */

import React, { useState } from "react"
import Modal from "react-modal"

const UserMenu = ({ isOpen, handleToggle, handleSignIn, isSignedIn }) => {
  Modal.setAppElement("#__next")

  return (
    <Modal
      className=" userMenu"
      isOpen={isOpen}
      onRequestClose={() => {
        handleToggle(false)
      }}
      shouldCloseOnOverlayClick
      style={{ overlay: { backgroundColor: "transparent", zIndex: 9999 } }}
    >
      {!isSignedIn ? (
        <div onClick={() => handleSignIn()}>Google Sign In</div>
      ) : (
        <div>Sign Out</div>
      )}
    </Modal>
  )
}

export default UserMenu
