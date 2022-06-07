/**
 * File: /pages/api/users/login.ts
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
  onSnapshot,
  DocumentReference,
  getDoc,
  getDocs,
} from "firebase/firestore"
import { OAuthCredential, UserCredential } from "firebase/auth"
import { NextApiRequest } from "next"

interface UserDoc {
  accessToken: string
  expirationTime: number
  refreshToken: string
  userId: string
  updated: string
}

export default async (
  req: NextApiRequest & {
    body: { result: UserCredential; credential: OAuthCredential }
    method: string
  },
  res: any
) => {
  try {
    const { result, credential } = req.body
    // Initialize db
    const db = getFirestore(firebaseApp)

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

        let users = await getDocs(
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
            accessToken: credential.accessToken,
            refreshToken: result.user.stsTokenManager.refreshToken,
            expirationTime: result.user.stsTokenManager.expirationTime,
            updated: new Date().toISOString(),
          })
          msg = "welcome"
        } else {
          updateDoc(userRef, {
            accessToken: credential.accessToken,
            refreshToken: result.user.stsTokenManager.refreshToken,
            expirationTime: result.user.stsTokenManager.expirationTime,
            updated: new Date().toISOString(),
          })
          msg = "token updated"
        }
        return res.status(200).json({ msg, userId: result.user.uid })
      }
    }
  } catch (e) {
    console.log("eeerrrriiiirr", e)
    res.status(400).end()
  }
}
