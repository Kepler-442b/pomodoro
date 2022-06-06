/**
 * File: /src/components/reportModal.js
 * Copyright (c) 2022 - Sooyeon Kim
 */

import React, { useEffect, useState } from "react"
import axios from "axios"
import Cookie from "js-cookie"
import Select from "react-select"
import Modal from "react-modal"
import PropTypes from "prop-types"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Label,
  CartesianGrid,
  Tooltip,
} from "recharts"
import "rc-slider/assets/index.css"
import { PERIOD } from "../utils/constant"
import { getYYYYMMDD } from "../utils/date"
import CloseButton from "./mobileCloseBtn"

const ReportModal = ({ isOpen, showReport, windowWidth }) => {
  Modal.setAppElement("#__next")

  const isMobile = windowWidth < 641

  const [selectedOption, setSelectedOption] = useState({
    value: "Today",
    label: "Today",
  })
  const [reportSummary, setReportSummary] = useState({
    hoursCompleted: 0,
    intervalsCompleted: 0,
    daysAccessed: 0,
  })
  const [reportEach, setReportEach] = useState({
    hoursCompleted: null,
    intervalsCompleted: null,
    daysAccessed: null,
  })

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
          let daysAccessed = 1
          let arr = []
          if (Array.isArray(res.data?.report) && res.data?.report.length > 0) {
            const reports = res.data.report
            reports.forEach((report) => {
              hoursCompleted += report.hoursCompleted
              intervalsCompleted += report.intervalsCompleted
              arr.push(report)
            })
            daysAccessed = reports.length
          } else {
            hoursCompleted = res.data.report.hoursCompleted
            intervalsCompleted = res.data.report.intervalsCompleted
            arr.push(res.data.report)
          }
          setReportEach(arr)
          setReportSummary({ hoursCompleted, intervalsCompleted, daysAccessed })
        })
      }
    } catch (err) {
      console.log(err)
    }
  }, [selectedOption])

  const OPTIONS = [
    { value: "Today", label: "Today" },
    { value: "This Week", label: "This Week" },
    { value: "This Month", label: "This Month" },
  ]

  return (
    <Modal
      className={`absolute flex-auto ${
        isMobile ? "reportModalMobile" : "reportModal"
      }`}
      isOpen={isOpen}
      onRequestClose={() => showReport(false)}
      shouldCloseOnOverlayClick
      style={{
        overlay: {
          // position: "fixed",
          // top: "50%",
          // left: "50%",
          // marginTop: "-22rem",
          // marginLeft: "-20rem",
          backgroundColor: "transparent",
          zIndex: 9999,
        },
      }}
    >
      {isMobile && <CloseButton handleClose={showReport} />}
      <div className="modalTitle">ACTIVITY REPORT</div>

      <div>
        <div className="flex justify-center place-items-center">
          <Select
            className="mx-2 font-semibold border-2 border-black border-solid rounded-md w-60"
            onChange={(option) => setSelectedOption(option)}
            defaultValue={OPTIONS[0]}
            value={selectedOption}
            options={OPTIONS}
            closeMenuOnSelect
          />
        </div>
        <div className={isMobile ? "summaryMobile" : "summary"}>
          <div
            className={isMobile ? "summaryComponentMobile" : "summaryComponent"}
            id="intervalsCompleted"
          >
            <div className="summaryNumVal">
              {reportSummary.intervalsCompleted}
            </div>
            <div className="summaryTextVal">Intervals Completed</div>
          </div>
          <div
            className={isMobile ? "summaryComponentMobile" : "summaryComponent"}
            id="hoursCompleted"
          >
            <div className="summaryNumVal">{reportSummary.hoursCompleted}</div>
            <div className="summaryTextVal">Hours Completed</div>
          </div>
          <div
            className={isMobile ? "summaryComponentMobile" : "summaryComponent"}
            id="daysStreak"
          >
            <div className="summaryNumVal">{reportSummary.daysAccessed}</div>
            <div className="summaryTextVal">Day(s) Accessed</div>
          </div>
        </div>
        <div className="flex justify-center -ml-5">
          {reportEach.hoursCompleted !== null ? (
            <BarChart
              data={reportEach}
              width={isMobile ? 350 : 600}
              height={250}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="#fff"></XAxis>
              <YAxis stroke="#fff" allowDecimals={false}>
                <Label
                  style={{
                    textAnchor: "middle",
                    fill: "#f2e78a",
                  }}
                  angle={270}
                  value={"hour(s)"}
                />
              </YAxis>
              <Bar dataKey="hoursCompleted" fill="#D0CE9E" />
              <Tooltip />
            </BarChart>
          ) : (
            <div className="text-primary">No data for this period exists.</div>
          )}
        </div>
      </div>
    </Modal>
  )
}

ReportModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  showReport: PropTypes.func.isRequired,
  windowWidth: PropTypes.number.isRequired,
}

export default React.memo(ReportModal)
