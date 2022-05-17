/**
 * File: /src/components/reportModal.js
 * Copyright (c) 2022 - Sooyeon Kim
 */

import React, { useState } from "react"
import Select from "react-select"
import Modal from "react-modal"
import "rc-slider/assets/index.css"

const ReportModal = ({ isOpen, showReport }) => {
  Modal.setAppElement("#__next")

  const [selectedOption, setSelectedOption] = useState(null)

  return (
    <Modal
      className="reportModal"
      isOpen={isOpen}
      onRequestClose={() => showReport(false)}
      shouldCloseOnOverlayClick
      style={{ overlay: { backgroundColor: "transparent", zIndex: 9999 } }}
    >
      <div className="flex place-items-center">
        <span className="summaryModalSubTitle">Report for</span>
        <Select
          className="w-40 mx-2 font-semibold border-2 border-black border-solid rounded-md"
          onChange={(option) => setSelectedOption(option)}
          value={selectedOption}
          options={[
            { value: "Today", label: "Today" },
            { value: "This Week", label: "This Week" },
            { value: "This Month", label: "This Month" },
          ]}
        />
      </div>
      <div className="summary">
        <div className="summaryComponent" id="intervalsCompleted">
          <div className="summaryNumVal">10</div>
          <div>Intervals Completed</div>
        </div>
        <div className="summaryComponent" id="intervalsSkipped">
          <div className="summaryNumVal">10</div>
          <div>Intervals Skipped</div>
        </div>
        <div className="summaryComponent" id="hoursCompleted">
          <div className="summaryNumVal">10</div>
          <div>Hours Completed</div>
        </div>
        <div className="summaryComponent" id="daysStreak">
          <div className="summaryNumVal">10</div>
          <div>Day(s) Streak</div>
        </div>
      </div>
    </Modal>
  )
}

export default React.memo(ReportModal)
