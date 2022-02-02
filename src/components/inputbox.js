import React from "react"

const MyInputBox = ({ text, icon, styling, iconStyling }) => {
  return (
    <div className="flex h-full rounded-2xl bg-secondary">
      <label className="flex items-center">
        <img src={icon} alt="icon" className={iconStyling} />
      </label>
      <input
        id="search-user"
        type="text"
        className={`input-basic-style ${styling}`}
        placeholder={`${text}`}
      />
    </div>
  )
}

export default MyInputBox
