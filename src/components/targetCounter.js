/**
 * File: /src/components/targetCounter.js
 * Copyright (c) 2022 - Sooyeon Kim
 */

import PropTypes from "prop-types"
import React, { useState } from "react"

const MyTargetCounter = ({ goal, current, showModal }) => {
  const [style, setStyle] = useState("cursor-pointer")
  return (
    <div className="z-10 targetCounter">
      <p
        className={style}
        title="Reset Progress"
        onMouseEnter={() =>
          setStyle(
            (prev) => prev + " underline decoration-solid underline-offset-2"
          )
        }
        onMouseLeave={() => setStyle("cursor-pointer")}
        onClick={() => {
          if (current > 0) showModal(true)
        }}
      >
        {`${current} of ${goal}`}
      </p>
    </div>
  )
}

MyTargetCounter.propTypes = {
  goal: PropTypes.number.isRequired,
  current: PropTypes.number.isRequired,
  showModal: PropTypes.func.isRequired,
}
export default MyTargetCounter
