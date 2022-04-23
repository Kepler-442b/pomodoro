/**
 * File: /src/components/modal.js
 * Copyright (c) 2022 - Sooyeon Kim
 */

import React from "react"
import Modal from "react-modal"
import MyButton from "./button"

const MyModal = ({
  isOpen,
  handleConfirm,
  showModal,
  pauseTimer,
  message,
  btnMsg,
}) => {
  Modal.setAppElement("#__next")

  return (
    <Modal
      className="confirmModal"
      isOpen={isOpen}
      style={{ overlay: { backgroundColor: "transparent", zIndex: 9999 } }}
    >
      <div className="mx-2">{message}</div>
      <div className="flex ">
        <MyButton
          handleOnClick={() => handleConfirm()}
          text={btnMsg}
          styling="bg-secondary"
          textOnly={true}
        />
        <MyButton
          text="Cancel"
          styling="bg-secondary"
          handleOnClick={() => {
            showModal(false)
            pauseTimer(false)
          }}
          textOnly={true}
        />
      </div>
    </Modal>
  )
}

export default MyModal
