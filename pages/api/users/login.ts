/**
 * File: /pages/api/users/login.ts
 * Copyright (c) 2022 - Sooyeon Kim
 */

import { NextApiRequest, NextApiResponse } from "next"
import { OAuthCredential, UserCredential } from "firebase/auth"
import {
  getFirestore,
  addDoc,
  collection,
  updateDoc,
  query,
  where,
  DocumentReference,
  getDocs,
} from "firebase/firestore"
import firebaseApp from "../../../firebase/clientApp"
interface UserDoc {
  accessToken: string
  expirationTime: number
  refreshToken: string
  userId: string
  updated: string
}

const login = async (
  req: NextApiRequest & {
    body: { result: UserCredential; credential: OAuthCredential }
    method: string
  },
  res: NextApiResponse
) => {
  // Initialize db
  const db = getFirestore(firebaseApp)

  try {
    const { result, credential } = req.body

    const idToken = credential.idToken

    if (!idToken) {
      throw res.status(401).end()
    }

    if (!credential.accessToken) {
      return res.status(400).end()
    } else {
      if (req.method === "POST") {
        const usersCol = collection(db, "users")
        let userRef: DocumentReference
        let user: UserDoc

        const users = await getDocs(
          query(usersCol, where("userId", "==", result.user.uid))
        )
        users.forEach((doc) => {
          userRef = doc.ref
          user = doc.data() as UserDoc
          return
        })
        let msg = ""
        if (!user) {
          addDoc(usersCol, {
            userId: result.user.uid,
            refreshToken: result.user.stsTokenManager.refreshToken,
            updated: new Date().toISOString(),
          })
          msg = "welcome"
        } else {
          updateDoc(userRef, {
            refreshToken: result.user.stsTokenManager.refreshToken,
            updated: new Date().toISOString(),
          })
          msg = "token updated"
        }
        return res.status(200).json({ msg, userId: result.user.uid })
      }
    }
  } catch (e) {
    if (e instanceof Error) {
      const errorLogsCol = collection(db, "errorLogs")

      addDoc(errorLogsCol, {
        endpoint: "users/login",
        method: req.method,
        name: e.name,
        message: e.message,
        stack: e.stack,
        cause: e.cause.name,
        created: new Date().toISOString(),
      })
      res.status(500).json({ msg: "Unknown error occurred while logging in." })
    }
  }
}

export default login
