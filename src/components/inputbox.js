/**
 * File: /pages/inputbox.js
 * Copyright (c) 2022 - Sooyeon Kim
 */

import React from "react"

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

export default MyTextInputWithLabel