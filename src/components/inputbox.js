/**
 * File: src/components/inputbox.js
 * Copyright (c) 2022 - Sooyeon Kim
 */

import React from "react"
import PropTypes from "prop-types"

const MyTextInputWithLabel = ({
  inputId,
  inputStyle,
  labelStyle,
  labelElement,
  placeHolderText,
}) => {
  return (
    <>
      <label className={labelStyle}>{labelElement}</label>
      <input
        id={inputId}
        type="text"
        className={inputStyle}
        placeholder={`${placeHolderText}`}
      />
    </>
  )
}
MyTextInputWithLabel.propTypes = {
  inputId: PropTypes.string.isRequired,
  inputStyle: PropTypes.string.isRequired,
  labelStyle: PropTypes.string.isRequired,
  labelElement: PropTypes.string.isRequired,
  placeHolderText: PropTypes.string.isRequired,
}
export default MyTextInputWithLabel
