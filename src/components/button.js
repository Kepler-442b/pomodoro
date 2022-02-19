/**
 * File: /src/components/button.js
 * Copyright (c) 2022 - Sooyeon Kim
 */

import React from "react"

const MyButton = ({
  text,
  toggleText,
  showToggle,
  icon,
  styling,
  iconStyling,
  screenW,
  textOnly,
  handleOnClick,
}) => {
  return (
    <button
      className={`button-basic-style ${styling}`}
      onClick={(evt) => handleOnClick(evt)}
    >
      {icon && <img src={icon} alt="icon" className={`${iconStyling}`} />}
      {(text && screenW >= 768) || textOnly ? (
        <p>{showToggle ? toggleText : text}</p>
      ) : null}
    </button>
  )
}

export default React.memo(MyButton)
