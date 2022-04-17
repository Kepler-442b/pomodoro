/**
 * File: /src/components/settingsModal.js
 * Copyright (c) 2022 - Sooyeon Kim
 */

import React, { useState } from "react"
import Select from "react-select"
import Modal from "react-modal"
import Slider from "rc-slider"
import "rc-slider/assets/index.css"

const SettingsModal = ({
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
  volume,
  setVolume,
  audio,
}) => {
  Modal.setAppElement("#__next")

  const [selectedOption, setSelectedOption] = useState(null)

  return (
    <Modal
      className="border-2 border-gray-900 border-solid settingsModal "
      isOpen={isOpen}
      onRequestClose={() => {
        handleSave()
        handleToggle(false)
      }}
      shouldCloseOnOverlayClick
      style={{ overlay: { backgroundColor: "transparent", zIndex: 9999 } }}
    >
      <div className="modalTitle">TIMER SETTINGS</div>
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
            onChange={(evt) => setLongBreakInterval(evt.currentTarget.value)}
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
            onChange={(evt) => setGoal(evt.currentTarget.value)}
          />
          <label className="modalLabel" htmlFor="pomodoroInput">
            pomodoro(s)
          </label>
        </div>
      </div>
      <div id="soundSetting" className="settingGroup">
        <div className="modalSubtitle">Alarm Sound</div>
        <div className="px-4">
          <Select
            className="font-semibold border-2 border-black border-solid rounded-md w-64mx-2"
            onChange={(option) => setSelectedOption(option)}
            value={selectedOption}
            options={[
              { value: "Levi Ackerman", label: "Levi Ackerman" },
              { value: "Eren Jaeger", label: "Eren Jaeger" },
            ]}
          />
        </div>
        <div className="flex items-center justify-between px-4 mt-3 text-xl text-white settingGroup ">
          <p className="px-2">{volume}</p>
          <Slider
            style={{ width: "80%" }}
            handleStyle={{
              borderWidth: "3px",
              borderColor: "#0D354B",
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
    </Modal>
  )
}

export default React.memo(SettingsModal)
