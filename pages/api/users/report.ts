/**
 * File: /pages/api/users/report.ts
 * Copyright (c) 2022 - Sooyeon Kim
 */

import { NextApiRequest, NextApiResponse } from "next"
import {
  getFirestore,
  addDoc,
  collection,
  updateDoc,
  query,
  where,
  getDocs,
  DocumentReference,
} from "firebase/firestore"
import firebaseApp from "../../../firebase/clientApp"

export const PERIOD = {
  DAY: "DAY",
  WEEK: "WEEK",
  MONTH: "MONTH",
}

interface ReportDoc {
  updated_at?: string
  created_at?: string
  userId?: string
  date?: string
  hoursCompleted: number
  intervalsCompleted: number
}
const report = async (
  req: NextApiRequest & {
    method: string
  },
  res: NextApiResponse
) => {
  // Initialize db
  const db = getFirestore(firebaseApp)
  try {
    const { userId } = req.query

    const reportsCol = collection(db, "reports")

    if (req.method === "POST") {
      const { intervalsCompleted, hoursCompleted, date } = req.body
      let latestReport: ReportDoc
      let latestReportRef: DocumentReference
      const reports = await getDocs(
        query(
          reportsCol,
          where("userId", "==", userId),
          where("date", "==", date)
        )
      )
      reports.forEach((doc) => {
        latestReportRef = doc.ref
        latestReport = doc.data() as ReportDoc
        return
      })

      // overwrite the existing doc
      if (latestReport && latestReport.date === date) {
        updateDoc(latestReportRef, {
          intervalsCompleted:
            latestReport.intervalsCompleted + intervalsCompleted,
          hoursCompleted:
            latestReport.hoursCompleted + hoursCompleted.toFixed(2),
          updated_at: new Date().toISOString(),
        })

        // create a new doc for a day
      } else if (!latestReport || latestReport.date !== date) {
        addDoc(reportsCol, {
          intervalsCompleted: intervalsCompleted,
          hoursCompleted: hoursCompleted.toFixed(2),
          date: date,
          updated_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          userId: userId,
        })
      }

      res.status(200).end()
    }
    if (req.method === "GET") {
      const { period, date } = req.query

      const reports = await getDocs(
        query(reportsCol, where("userId", "==", userId))
      )

      if (reports.size > 0) {
        const dateArr = (date as string).split("-")
        const [year, month, today] = dateArr
        if (period === PERIOD.DAY) {
          let dailyReport: ReportDoc
          const reports = await getDocs(
            query(
              reportsCol,
              where("userId", "==", userId),
              where("date", "==", date)
            )
          )
          if (reports.size > 0) {
            reports.forEach((doc) => {
              dailyReport = doc.data() as ReportDoc
              return
            })
          } else {
            dailyReport = {
              hoursCompleted: 0,
              intervalsCompleted: 0,
            }
          }

          res.status(200).json({ report: dailyReport })
        } else if (period === PERIOD.WEEK) {
          // get the last seven day's report
          const last7DaysReport: ReportDoc[] = []

          const getTheFirstDate = (
            month: string,
            today: string
          ): { mm: string; dd: string } => {
            let mm = month
            let dd = parseInt(today)

            let defaultDays = 30
            const longMonths = ["1", "3", "5", "7", "8", "10", "12"]
            if (!longMonths.includes(mm)) defaultDays = 31
            if (dd === 7) dd = 1
            else if (dd === 6) dd = defaultDays
            else if (dd === 5) dd = defaultDays - 1
            else if (dd === 4) dd = defaultDays - 2
            else if (dd === 3) dd = defaultDays - 3
            else if (dd === 2) dd = defaultDays - 4
            else if (dd === 1) dd = defaultDays - 5
            else dd -= 6

            if (parseInt(today) < 7) {
              mm = (parseInt(mm) - 1).toString()
            }

            return { mm, dd: dd.toString() }
          }

          const { mm, dd } = getTheFirstDate(month, today)
          const reports = await getDocs(
            query(
              reportsCol,
              where("userId", "==", userId),
              where("date", "<=", `${year}-${month}-${today}`),
              where("date", ">=", `${year}-${mm}-${dd}`)
            )
          )
          reports.forEach((doc) => {
            last7DaysReport.push(doc.data() as ReportDoc)
          })

          res.status(200).json({ report: last7DaysReport })
        } else {
          const reports = await getDocs(
            query(
              reportsCol,
              where("userId", "==", userId),
              where("date", ">=", `${year}-${month}-01`),
              where("date", "<=", `${year}-${month}-${today}`)
            )
          )
          // get all reports in the same year and month
          const monthlyReport: ReportDoc[] = []
          reports.forEach((doc) => {
            monthlyReport.push(doc.data() as ReportDoc)
          })
          res.status(200).json({ report: monthlyReport })
        }
      } else {
        res.status(200).json({
          report: {
            intervalsCompleted: 0,
            hoursCompleted: 0,
            date: "",
          },
        })
      }
    }
  } catch (e) {
    if (e instanceof Error) {
      const errorLogsCol = collection(db, "errorLogs")

      addDoc(errorLogsCol, {
        endpoint: "users/reports",
        method: req.method,
        name: e.name,
        message: e.message,
        stack: e.stack,
        // cause: e.cause.name,
        created: new Date().toISOString(),
      })
      res
        .status(500)
        .json({ msg: "Unknown error occurred while getting report(s)." })
    }
  }
}

export default report
