import React from "react"

const MyInputBox = ({ text, icon, styling }) => {
  return <input
    type={'text'}
    className={`input-basic-style ${styling}`}
    placeholder={`${text}`}
  />
}

export default MyInputBox
