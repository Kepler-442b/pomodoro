/**
 * File: /src/components/button.tsx
 * Copyright (c) 2022 - Sooyeon Kim
 */

import React from "react"

interface Props {
  text: string
  toggleText: string
  showToggle: boolean
  icon: string
  styling: string
  iconStyling: string
  screenW: number
  textOnly: boolean
  handleOnClick: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void
  isDisabled: boolean
  titleTxt: string
}

const MyButton = (props: Props): JSX.Element => {
  const {
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
    titleTxt,
  } = props
  return (
    <button
      className={`button-basic-style ${styling}`}
      onClick={(evt) => handleOnClick(evt)}
      disabled={isDisabled}
      title={titleTxt}
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
