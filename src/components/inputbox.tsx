/**
 * File: src/components/inputbox.tsx
 * Copyright (c) 2022 - Sooyeon Kim
 */

import React from "react"

interface Props {
  inputId: string
  inputStyle: string
  labelStyle: string
  labelElement: any
  placeHolderText: string
}
const MyTextInputWithLabel = (props: Props): JSX.Element => {
  const { inputId, inputStyle, labelStyle, labelElement, placeHolderText } =
    props
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
