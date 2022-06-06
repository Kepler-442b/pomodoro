/**
 * File: /src/components/button.js
 * Copyright (c) 2022 - Sooyeon Kim
 */

import React from "react"
import PropTypes from "prop-types"

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

MyButton.propTypes = {
  icon: PropTypes.string,
  handleOnClick: PropTypes.func.isRequired,
  styling: PropTypes.string,
  iconStyling: PropTypes.string,
  text: PropTypes.string,
  toggleText: PropTypes.string,
  isDisabled: PropTypes.bool,
  showToggle: PropTypes.bool,
  screenW: PropTypes.number,
  textOnly: PropTypes.bool,
}
MyButton.defaultProps = {
  icon: "",
  styling: "",
  iconStyling: "",
  text: "",
  toggleText: "",
  isDisabled: false,
  showToggle: false,
  screenW: 0,
  textOnly: false,
}
export default React.memo(MyButton)
