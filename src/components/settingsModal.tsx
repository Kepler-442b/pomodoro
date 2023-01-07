/**
 * File: /src/components/settingsModal.tsx
 * Copyright (c) 2022 - Sooyeon Kim
 */

import Slider from "rc-slider"
import React, { Dispatch, SetStateAction } from "react"
import { Modal } from "react-daisyui"
// import Select from "react-select"
import CloseButton from "./MobileCloseBtn"
import "rc-slider/assets/index.css"

interface Props {
  isOpen: boolean
  handleToggle: Dispatch<SetStateAction<boolean>>
  pomoTime: string
  setPomoTime: Dispatch<SetStateAction<string>>
  shortBreak: string
  setShortBreak: Dispatch<SetStateAction<string>>
  longBreak: string
  setLongBreak: Dispatch<SetStateAction<string>>
  longBreakInterval: number
  setLongBreakInterval: Dispatch<SetStateAction<number>>
  handleSave: () => void
  goal: number
  setGoal: Dispatch<SetStateAction<number>>
  audio: HTMLAudioElement
  volume: number
  setVolume: Dispatch<SetStateAction<number>>
  windowWidth: number
  // selectedAlarm: any
  // options: any
}

const SettingsModal = (props: Props): JSX.Element => {
  const {
    isOpen,
    handleToggle,
    pomoTime,
    setPomoTime,
    shortBreak,
    setShortBreak,
    longBreak,
    setLongBreak,
    longBreakInterval,
    setLongBreakInterval,
    handleSave,
    goal,
    setGoal,
    audio,
    volume,
    setVolume,
    windowWidth,
    // selectedAlarm,
    // options,
  } = props

  const isMobile = windowWidth < 641

  return (
    <Modal
      className={isMobile ? "settingsModalMobile" : "settingsModal"}
      open={isOpen}
      onClickBackdrop={() => {
        handleSave()
        console.log("clicked")
        handleToggle(false)
      }}
      // style={{
      //   overlay: !isMobile ? MODAL_STYLE : MODAL_MOBILE_STYPE,
      // }}
    >
      <Modal.Body>
        {isMobile && (
          <CloseButton handleClose={handleToggle} handleSave={handleSave} />
        )}
        <div className="modalTitle">SETTINGS</div>
        <div id="mainTimerSetting" className="settingGroup">
          <div className="modalSubtitle">Time(minutes)</div>
          <div className="px-3">
            <label className="modalLabel" htmlFor="pomodoroInput">
              pomodoro
            </label>
            <label className="modalLabel" htmlFor="shortBreakInput">
              short break
            </label>
            <label className="modalLabel" htmlFor="longBreakInput">
              long break
            </label>
            <input
              className="modalInput"
              id="pomodoroInput"
              type="number"
              min={1}
              max={60}
              step={1}
              value={pomoTime}
              onChange={(evt) => setPomoTime(evt.currentTarget.value)}
            />
            <input
              className="modalInput"
              id="shortBreakInput"
              type="number"
              min={1}
              max={10}
              step={1}
              value={shortBreak}
              onChange={(evt) => setShortBreak(evt.currentTarget.value)}
            />
            <input
              className="modalInput"
              id="longBreakInput"
              type="number"
              min={1}
              max={60}
              step={1}
              value={longBreak}
              onChange={(evt) => setLongBreak(evt.currentTarget.value)}
            />
          </div>
        </div>
        <div id="intervalSetting" className="settingGroup">
          <div className="modalSubtitle">Long break every..</div>
          <div className="px-3">
            <input
              className="modalInput"
              id="longBreakIntervalInput"
              type="number"
              min={1}
              max={10}
              step={1}
              value={longBreakInterval}
              onChange={(evt) =>
                setLongBreakInterval(parseInt(evt.currentTarget.value))
              }
            />
            <label className="modalLabel" htmlFor="pomodoroInput">
              pomodoro(s)
            </label>
          </div>
        </div>
        <div id="targetSetting" className="settingGroup">
          <div className="modalSubtitle">Target per day</div>
          <div className="px-3 ">
            <input
              className="modalInput"
              id="targetIntervalInput"
              type="number"
              min={1}
              max={50}
              step={1}
              value={goal}
              onChange={(evt) => setGoal(parseInt(evt.currentTarget.value))}
            />
            <label className="modalLabel" htmlFor="pomodoroInput">
              pomodoro(s)
            </label>
          </div>
        </div>
        <div id="soundSetting" className="settingGroup">
          {/* <div className="modalSubtitle">Theme</div>
        <div className="px-4">
          <Select
            className="font-semibold border-2 border-black border-solid rounded-md w-64mx-2"
            // onChange={(option) => selectAlarm(option)}
            value={selectedAlarm}
            options={options}
            defaultValue={options[0]}
          />
        </div> */}
          <div className="flex items-center justify-between px-4 mt-3 text-xl text-white settingGroup ">
            <p className="px-2">{volume}</p>
            <Slider
              style={{ width: "80%" }}
              handleStyle={{
                borderWidth: "3px",
                borderColor: "#05334d",
                backgroundColor: "#F2E78A",
                height: "23px",
                width: "23px",
                marginTop: "-.5rem",
                opacity: 1,
              }}
              railStyle={{
                height: "5px",
              }}
              value={volume}
              onChange={(value) => {
                setVolume(value[0])
                if (audio) audio.play()
              }}
              range={true}
              step={1}
              defaultValue={50}
            />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default React.memo(SettingsModal)
