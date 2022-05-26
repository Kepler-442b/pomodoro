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
  orderBy,
  limit,
  DocumentReference,
} from "firebase/firestore"
import { NextApiRequest } from "next"

export const PERIOD = {
  DAY: "DAY",
  WEEK: "WEEK",
  MONTH: "MONTH",
}

interface ReportDoc {
  updated_at: string
  created_at: string
  userId: string
  date: string
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
            hoursCompleted: latestReport.hoursCompleted + hoursCompleted,
            date: date,
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
        const month = date.slice(5, 7)
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

          reports.forEach((doc) => {
            dailyReportRef = doc.ref
            dailyReport = doc.data() as ReportDoc
            return
          })
          res.status(200).json({ report: dailyReport })
        } else if (period === PERIOD.WEEK) {
          // get the last seven day's report
          let last7DaysReport: ReportDoc[] = []
          const reports = await getDocs(
            query(
              reportsCol,
              where("userId", "==", userId),
              where("date", "<", `${year}-${month}-${today}`),
              where("date", ">=", `${year}-${month}-${parseInt(today) - 7}`)
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
              where("date", ">=", `${year}-${month}-01`),
              where("date", "<", `${year}-${month}-${today}`)
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
