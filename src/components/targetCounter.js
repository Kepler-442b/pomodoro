/**
 * File: /src/components/targetCounter.js
 * Copyright (c) 2022 - Sooyeon Kim
 */

import React, { useCallback, useEffect } from "react"

const MyTargetCounter = ({ goal, current }) => {
  return <div className="targetCounter">{` ${current} / ${goal}`}</div>
}

export default MyTargetCounter
