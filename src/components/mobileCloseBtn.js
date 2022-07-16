/**
 * File: src/components/mobileCloseBtn.js
 * Copyright (c) 2022 - Sooyeon Kim
 */

import PropTypes from "prop-types"
import React from "react"

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
        <img src="/CloseIcon.svg" alt="close" />
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
