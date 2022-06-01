/**
 * File: /pages/api/users/report.ts
 * Copyright (c) 2022 - Sooyeon Kim
 */

import firebaseApp from "../../../firebase/clientApp"
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
import { NextApiRequest } from "next"

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
export default async (
  req: NextApiRequest & {
    method: string
  },
  res: any
) => {
  try {
    const { userId } = req.query
    // Initialize db
    const db = getFirestore(firebaseApp)
    const reportsCol = collection(db, "reports")

    if (req.method === "POST") {
      const { intervalsCompleted, hoursCompleted, date } = req.body
      let latestReport: ReportDoc
      let latestReportRef: DocumentReference
      let reports = await getDocs(
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
      try {
        if (latestReport && latestReport.date === date) {
          updateDoc(latestReportRef, {
            intervalsCompleted:
              latestReport.intervalsCompleted + intervalsCompleted,
            hoursCompleted:
              latestReport.hoursCompleted +
              parseFloat(hoursCompleted.toFixed(2)),
            updated_at: new Date().toISOString(),
          })
          // create a new doc for a day
        } else if (!latestReport || latestReport.date !== date) {
          addDoc(reportsCol, {
            intervalsCompleted: intervalsCompleted,
            hoursCompleted: hoursCompleted,
            date: date,
            updated_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
            userId: userId,
          })
        }
      } catch (e) {
        console.log("eeerrrriiiirr", e)
        res.status(500).end()
      }

      res.status(200).end()
    }
    if (req.method === "GET") {
      const { period, date } = req.query

      const reports = await getDocs(
        query(reportsCol, where("userId", "==", userId))
      )

      if (reports.size > 0) {
        const year = date.slice(0, 4)
        const month = date.slice(5, 7) as string
        const today = new Date().toISOString().split("-")[2].slice(0, 2)
        if (period === PERIOD.DAY) {
          let dailyReport: ReportDoc
          let dailyReportRef: DocumentReference
          let reports = await getDocs(
            query(
              reportsCol,
              where("userId", "==", userId),
              where("date", "==", date)
            )
          )
          if (reports.size > 0) {
            reports.forEach((doc) => {
              dailyReportRef = doc.ref
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
          let last7DaysReport: ReportDoc[] = []

          const getTheFirstDate = (
            month: string,
            today: string
          ): { mm: string; dd: string } => {
            let mm = month
            let dd = parseInt(today)

            let defaultDays = 30
            const longMonths = ["01", "03", "05", "07", "08", "10", "12"]
            if (!longMonths.includes(mm)) defaultDays = 31
            if (dd === 7) dd = 1
            else if (dd === 6) dd = defaultDays
            else if (dd === 5) dd = defaultDays - 1
            else if (dd === 4) dd = defaultDays - 2
            else if (dd === 3) dd = defaultDays - 3
            else if (dd === 2) dd = defaultDays - 4
            else if (dd === 1) dd = defaultDays - 5

            if (parseInt(today) < 7) {
              mm = (parseInt(mm) - 1).toString()
              if (parseInt(mm) < 10) mm = "0" + mm
            }

            return { mm: mm, dd: dd.toString() }
          }

          const { mm, dd } = getTheFirstDate(month, today)
          console.log("?", mm, dd)
          // debugger
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
          let reports = await getDocs(
            query(
              reportsCol,
              where("userId", "==", userId),
              where("date", ">=", `${year}-${"05"}-01`),
              where("date", "<=", `${year}-${"05"}-${"31"}`)
            )
          )
          // get all reports in the same year and month
          let monthlyReport: ReportDoc[] = []
          reports.forEach((doc) => {
            monthlyReport.push(doc.data() as ReportDoc)
          })
          res.status(200).json({ report: monthlyReport })
        }
      } else {
        res.status(200).json({
          intervalsCompleted: 0,
          hoursCompleted: 0,
          date: "",
        })
      }
    }
  } catch (err) {
    console.error(err)
    res.status(500).end()
  }
}