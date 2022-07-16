/**
 * File: /src/components/modal.js
 * Copyright (c) 2022 - Sooyeon Kim
 */

import PropTypes from "prop-types"
import React from "react"
import Modal from "react-modal"
import MyButton from "./button"

const MyModal = ({
  isOpen,
  handleConfirm,
  showModal,
  message,
  btnMsg,
  btnClr,
  pauseTimer,
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

MyModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  handleConfirm: PropTypes.func.isRequired,
  showModal: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  btnMsg: PropTypes.string.isRequired,
  btnClr: PropTypes.string.isRequired,
  pauseTimer: PropTypes.func,
}
MyModal.defaultProps = {
  pauseTimer: null,
}
export default MyModal
