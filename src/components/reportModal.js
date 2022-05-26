/**
 * File: /src/components/reportModal.js
 * Copyright (c) 2022 - Sooyeon Kim
 */

import React, { useEffect, useState } from "react"
import axios from "axios"
import Cookie from "js-cookie"
import Select from "react-select"
import Modal from "react-modal"
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import "rc-slider/assets/index.css"
import { PERIOD } from "../utils/constant"
import { getYYYYMMDD } from "../utils/date"

const ReportModal = ({ isOpen, showReport }) => {
  Modal.setAppElement("#__next")

  const [selectedOption, setSelectedOption] = useState(null)
  const [reportSummary, setReportSummary] = useState({
    hoursCompleted: 0,
    intervalsCompleted: 0,
  })
  const [reportEach, setReportEach] = useState({
    hoursCompleted: 0,
    intervalsCompleted: 0,
  })
  console.log("re", reportEach)
  useEffect(async () => {
    try {
      if (selectedOption !== null) {
        let endpoint = `/api/users/report?userId=${Cookie.get(
          "userId"
        )}&date=${getYYYYMMDD()}`
        if (selectedOption.value === "Today") {
          endpoint += `&period=${PERIOD.DAY}`
        } else if (selectedOption.value === "This Week") {
          endpoint += `&period=${PERIOD.WEEK}`
        } else if (selectedOption.value === "This Month") {
          endpoint += `&period=${PERIOD.MONTH}`
        }
        await axios.get(endpoint).then((res) => {
          let hoursCompleted = 0
          let intervalsCompleted = 0
          let arr = []
          if (Array.isArray(res.data?.report)) {
            const reports = res.data.report
            reports.forEach((report) => {
              hoursCompleted += report.hoursCompleted
              intervalsCompleted += report.intervalsCompleted
              arr.push(report)
            })
          } else {
            hoursCompleted = res.data.report.hoursCompleted
            intervalsCompleted = res.data.report.intervalsCompleted
            arr.push(res.data.report)
          }
          setReportEach(arr)
          setReportSummary({ hoursCompleted, intervalsCompleted })
        })
      }
    } catch (err) {
      console.log(err)
    }
  }, [selectedOption])

  return (
    <Modal
      className="absolute flex-auto reportModal"
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
          closeMenuOnSelect
        />
      </div>
      <div className="summary">
        <div className="summaryComponent" id="intervalsCompleted">
          <div className="summaryNumVal">
            {reportSummary.intervalsCompleted}
          </div>
          <div>Intervals Completed</div>
        </div>
        <div className="summaryComponent" id="hoursCompleted">
          <div className="summaryNumVal">{reportSummary.hoursCompleted}</div>
          <div>Hours Completed</div>
        </div>
        <div className="summaryComponent" id="daysStreak">
          <div className="summaryNumVal">10</div>
          <div>Day(s) Streak</div>
        </div>
      </div>
      <div className="flex justify-center">
        <BarChart data={reportEach} width={600} height={250}>
          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          <XAxis dataKey="date" stroke="#fff" />
          <YAxis stroke="#fff" />
          <Tooltip />
          <Legend />
          <Bar dataKey="hoursCompleted" fill="#D0CE9E" />
        </BarChart>
      </div>
    </Modal>
  )
}

export default React.memo(ReportModal)
