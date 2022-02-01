import React from "react"

const MyButton = ({ text, icon, styling, iconStyling }) => {
  return <button className={`button-basic-style ${styling}`}>
    {icon && <img src={icon} alt="icon" className={`${iconStyling}`} />}
    {text && <p>{text}</p>}
  </button>
}

export default MyButton
