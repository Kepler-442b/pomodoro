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
  isDisabled,
}) => {
  return (
    <button
      className={`button-basic-style ${styling}`}
      style={icon?.includes("google") ? { padding: 0 } : {}}
      onClick={(evt) => handleOnClick(evt)}
      disabled={isDisabled}
    >
      {icon && (
        <img
          src={icon}
          alt="icon"
          className={`${iconStyling}`}
          style={icon.includes("google") ? { borderRadius: "50%" } : {}}
        />
      )}
      {(text && screenW >= 768) || textOnly ? (
        <p>{showToggle ? toggleText : text}</p>
      ) : null}
    </button>
  )
}

export default React.memo(MyButton)
