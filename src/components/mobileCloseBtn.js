/**
 * File: src/components/mobileCloseBtn.js
 * Copyright (c) 2022 - Sooyeon Kim
 */

import React from "react"
import CloseIcon from "../../public/icons/CloseIcon.svg"
import PropTypes from "prop-types"

const CloseButton = ({ handleClose, handleSave }) => {
  return (
    <div className="flex justify-end m-3">
      <button
        className="closeBtn"
        onClick={() => {
          handleClose(false)
          if (handleSave) handleSave()
        }}
      >
        <img src={CloseIcon.src} />
      </button>
    </div>
  )
}

CloseButton.propTypes = {
  handleClose: PropTypes.func.isRequired,
  handleSave: PropTypes.func,
}
CloseButton.defaultProps = {
  handleSave: null,
}
export default CloseButton
