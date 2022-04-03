/**
 * File: /src/components/settingsModal.js
 * Copyright (c) 2022 - Sooyeon Kim
 */

import React, { useState } from "react"
import Select from "react-select"
import Modal from "react-modal"
import MyButton from "../components/button"

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
  screenW,
  handleSave,
}) => {
  Modal.setAppElement("#__next")

  const [selectedOption, setSelectedOption] = useState(null)

  return (
    <Modal
      className="settingsModal"
      isOpen={isOpen}
      onRequestClose={() => handleToggle(false)}
      style={{ overlay: { backgroundColor: "transparent", zIndex: 9999 } }}
      contentLabel="Example Modal"
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
            min={0}
            max={60}
            step={1}
            value={pomoTime}
            onChange={(evt) => setPomoTime(evt.currentTarget.value)}
          />
          <input
            className="modalInput"
            id="shortBreakInput"
            type="number"
            min={0}
            max={10}
            step={1}
            value={shortBreak}
            onChange={(evt) => setShortBreak(evt.currentTarget.value)}
          />
          <input
            className="modalInput"
            id="longBreakInput"
            type="number"
            min={0}
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
            id="intervalInput"
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
      <div id="soundSetting" className="settingGroup">
        <div className="modalSubtitle">Alarm Sound</div>
        <div className="px-3 ">
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
      </div>
      <div className="flex justify-center">
        <MyButton
          text="Save"
          textOnly={true}
          screenW={screenW}
          styling="bg-secondary border-black border-2 border-solid"
          handleOnClick={() => handleSave()}
        />
      </div>
    </Modal>
  )
}

export default React.memo(SettingsModal)
