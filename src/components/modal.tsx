/**
 * File: /src/components/modal.js
 * Copyright (c) 2022 - Sooyeon Kim
 */

import React from "react"
import { Modal } from "react-daisyui"
import MyButton from "./Button"

interface Props {
  isOpen: boolean
  handleConfirm: () => void
  showModal: (show: boolean) => void
  message: string
  btnMsg: string
  btnClr: string
  pauseTimer?: (pause: boolean) => void
}

const MyModal = (props: Props): JSX.Element => {
  const {
    isOpen,
    handleConfirm,
    showModal,
    message,
    btnMsg,
    btnClr,
    pauseTimer,
  } = props

  return (
    <Modal
      className="confirmModal"
      open={isOpen}
      // style={{ overlay: { backgroundColor: "transparent", zIndex: 9999 } }}
    >
      <div className="mx-2">{message}</div>
      <div className="flex ">
        <MyButton
          handleOnClick={() => {
            showModal(false)
            handleConfirm()
          }}
          text={btnMsg}
          styling={btnClr}
          textOnly={true}
        />
        <MyButton
          text="Cancel"
          styling={btnClr}
          handleOnClick={() => {
            showModal(false)
            if (pauseTimer) pauseTimer(false)
          }}
          textOnly={true}
        />
      </div>
    </Modal>
  )
}

export default MyModal
