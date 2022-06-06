/**
 * File: /src/components/targetCounter.js
 * Copyright (c) 2022 - Sooyeon Kim
 */

import React from "react"
import ResetIcon from "../../public/icons/ResetIcon.png"
const MyTargetCounter = ({ goal, current, showModal, count }) => {
  return (
    <div className="z-10 targetCounter">
      <p> {` ${current} / ${goal}`}</p>
      {count > 0 && (
        <img
          onClick={() => showModal(true)}
          className="resetBtn"
          src={ResetIcon.src}
          alt="reset"
        />
      )}
    </div>
  )
}

export default MyTargetCounter
