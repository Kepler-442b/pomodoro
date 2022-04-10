/**
 * File: /src/components/timerAnimation.js
 * Copyright (c) 2022 - Sooyeon Kim
 * @see https://css-tricks.com/how-to-create-an-animated-countdown-timer-with-html-css-and-javascript/
 *
 */

import React from "react"

const MyTimerAnimation = ({ dashArrVal }) => {
  return (
    <svg
      className="timerRingWrapper"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g className="timerRing">
        <circle className="timerRingElapsed" cx="50" cy="50" r="45" />
        <path
          id="base-timer-path-remaining"
          strokeDasharray={dashArrVal} // length of the arc; 2πr = 2 * π * 45 = 282.6
          className={`base-timer__path-remaining`}
          d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
        ></path>
      </g>
    </svg>
  )
}

export default React.memo(MyTimerAnimation)
