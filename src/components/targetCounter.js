/**
 * File: /src/components/targetCounter.js
 * Copyright (c) 2022 - Sooyeon Kim
 */

import React from "react"
import ResetIcon from "../../public/icons/icons8-reset-48.png"
const MyTargetCounter = ({ goal, current, showModal, count }) => {
  console.log("ser", ResetIcon)
  return (
    <div className="targetCounter">
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
