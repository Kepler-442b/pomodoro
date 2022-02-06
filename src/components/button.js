import React from "react"

const MyButton = ({
  text,
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
      {(text && screenW >= 768) || textOnly ? <p>{text}</p> : null}
    </button>
  )
}

export default React.memo(MyButton)
