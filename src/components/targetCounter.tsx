/**
 * File: /src/components/targetCounter.tsx
 * Copyright (c) 2022 - Sooyeon Kim
 */

import React, { Dispatch, SetStateAction, useState } from "react"

interface Props {
  goal: number
  current: number
  showModal: Dispatch<SetStateAction<boolean>>
}

const MyTargetCounter = (props: Props): JSX.Element => {
  const { goal, current, showModal } = props

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

export default MyTargetCounter
