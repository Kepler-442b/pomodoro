/**
 * File: /src/components/reportModal.js
 * Copyright (c) 2022 - Sooyeon Kim
 */

import axios from "axios"
import Cookie from "js-cookie"
import PropTypes from "prop-types"
import React, { useEffect, useState } from "react"
import Modal from "react-modal"
import Select from "react-select"
import { toast } from "react-toastify"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Label,
  CartesianGrid,
  Tooltip,
} from "recharts"
import CloseButton from "./mobileCloseBtn"
import {
  MODAL_STYLE,
  PERIOD,
  REPORT_OPTIONS,
  MODAL_MOBILE_STYPE,
} from "../utils/constant"
import { getYYYYMMDD } from "../utils/date"
import "rc-slider/assets/index.css"

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
  useEffect(() => {
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
        axios.get(endpoint).then((res) => {
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
            hoursCompleted = res.data.report.hoursCompleted || 0
            intervalsCompleted = res.data.report.intervalsCompleted || 0
            arr.push(res.data.report)
          }
          setReportEach(arr)
          setReportSummary({ hoursCompleted, intervalsCompleted, daysAccessed })
        })
      }
    } catch (err) {
      toast.error("Error occurred while fetching report", { autoClose: false })
    }
  }, [selectedOption])

  return (
    <Modal
      className={`absolute flex-auto ${
        isMobile ? "reportModalMobile" : "reportModal"
      }`}
      isOpen={isOpen}
      onRequestClose={() => showReport(false)}
      shouldCloseOnOverlayClick
      style={{
        overlay: !isMobile ? MODAL_STYLE : MODAL_MOBILE_STYPE,
      }}
    >
      {isMobile && <CloseButton handleClose={showReport} />}
      <div className="modalTitle">ACTIVITY REPORT</div>

      <div>
        <div className="flex justify-center place-items-center">
          <Select
            className="mx-2 font-semibold border-2 border-black border-solid rounded-md w-60"
            onChange={(option) => setSelectedOption(option)}
            defaultValue={REPORT_OPTIONS[0]}
            value={selectedOption}
            options={REPORT_OPTIONS}
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
          {reportSummary.hoursCompleted &&
          reportSummary.intervalsCompleted &&
          reportEach.hoursCompleted !== null ? (
            <BarChart
              data={reportEach}
              width={isMobile ? 350 : 650}
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
                  value="hour(s)"
                />
              </YAxis>
              <Bar dataKey="hoursCompleted" fill="#D0CE9E" />
              <Tooltip />
            </BarChart>
          ) : (
            <div className="text-primary">
              No data for this period exists yet.
            </div>
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
