import CloseIcon from "../../public/icons/CloseIcon.svg"

const CloseButton = ({ handleClose, handleSave }) => {
  return (
    <div className="flex justify-end m-3">
      <button
        className="closeBtn"
        onClick={() => {
          handleClose(false)
          if (handleSave) handleSave()
        }}
      >
        <img src={CloseIcon.src} />
      </button>
    </div>
  )
}

export default CloseButton
