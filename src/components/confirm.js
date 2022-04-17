/**
 * File: /src/components/confirm.js
 * Copyright (c) 2022 - Sooyeon Kim
 */

import React from "react"
import Modal from "react-modal"
import MyButton from "./button"

const MyConfirmModal = ({
  isOpen,
  handleConfirm,
  showSkipModal,
  pauseTimer,
}) => {
  Modal.setAppElement("#__next")

  return (
    <Modal
      className="confirmModal"
      isOpen={isOpen}
      style={{ overlay: { backgroundColor: "transparent", zIndex: 9999 } }}
    >
      <div className="mx-2">
        Are you sure you want to skip the current session?
      </div>
      <div className="flex ">
        <MyButton
          handleOnClick={() => handleConfirm()}
          text="Skip"
          styling="bg-secondary"
          textOnly={true}
        />
        <MyButton
          text="Cancel"
          styling="bg-secondary"
          handleOnClick={() => {
            showSkipModal(false)
            pauseTimer(false)
          }}
          textOnly={true}
        />
      </div>
    </Modal>
  )
}

export default MyConfirmModal
