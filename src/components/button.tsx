/**
 * File: /src/components/Button.tsx
 * Copyright (c) 2022 - Sooyeon Kim
 */

import React, { MouseEvent } from "react"

interface Props {
  handleOnClick: () => // event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  void
  text?: string
  screenW?: number
  textOnly?: boolean
  toggleText?: string
  showToggle?: boolean
  isDisabled?: boolean
  titleTxt?: string
  styling?: string
  iconStyling?: string
  icon?: string
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
      onClick={() => handleOnClick()}
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
