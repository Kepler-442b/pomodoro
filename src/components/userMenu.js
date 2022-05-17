/**
 * File: /src/components/userMenu.js
 * Copyright (c) 2022 - Sooyeon Kim
 */

import React from "react"
import Modal from "react-modal"

const UserMenu = ({
  isOpen,
  handleToggle,
  handleSignIn,
  handleSignOut,
  handleShowReport,
  isSignedIn,
}) => {
  Modal.setAppElement("#__next")

  return (
    <Modal
      className="userMenu"
      isOpen={isOpen}
      onRequestClose={() => {
        handleToggle(false)
      }}
      shouldCloseOnOverlayClick
      style={{ overlay: { backgroundColor: "transparent", zIndex: 9999 } }}
    >
      {!isSignedIn ? (
        <div onClick={() => handleSignIn()}>Sign In</div>
      ) : (
        <div onClick={() => handleSignOut()}>Sign Out</div>
      )}
      <div onClick={() => handleShowReport()}>Show Report</div>
    </Modal>
  )
}

export default UserMenu
