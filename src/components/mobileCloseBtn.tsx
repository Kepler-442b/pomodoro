/**
 * File: src/components/mobileCloseBtn.tsx
 * Copyright (c) 2022 - Sooyeon Kim
 */

import React from "react"

interface Props {
  handleClose: (show: boolean) => void
  handleSave?: () => void
}

const CloseButton = (props: Props): JSX.Element => {
  const { handleClose, handleSave } = props
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

export default CloseButton
