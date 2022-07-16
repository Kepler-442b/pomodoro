/**
 * File: /src/components/targetCounter.js
 * Copyright (c) 2022 - Sooyeon Kim
 */

import PropTypes from "prop-types"
import React from "react"

const MyTargetCounter = ({ goal, current, showModal }) => {
  return (
    <div className="z-10 targetCounter">
      <p> {` ${current} / ${goal}`}</p>
      {current > 0 && (
        <img
          onClick={() => showModal(true)}
          className="resetBtn"
          src="/ResetIcon.png"
          alt="reset"
          title="Reset target"
        />
      )}
    </div>
  )
}

MyTargetCounter.propTypes = {
  goal: PropTypes.number.isRequired,
  current: PropTypes.number.isRequired,
  showModal: PropTypes.func.isRequired,
}
export default MyTargetCounter
