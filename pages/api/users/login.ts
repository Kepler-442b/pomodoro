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
} from "firebase/firestore"
import { OAuthCredential, UserCredential } from "firebase/auth"
import { NextApiRequest } from "next"

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
        const usersRef = collection(db, "users")

        // queries
        const q = query(usersRef, where("userId", "==", result.user.uid))
        let userDoc: DocumentReference
        const unsubscribe = onSnapshot(q, (snapshot) => {
          userDoc = snapshot.docs[0].ref
        })

        let msg = ""
        if (!userDoc) {
          addDoc(usersRef, {
            userId: result.user.uid,
            accessToken: credential.accessToken,
            refreshToken: result.user.stsTokenManager.refreshToken,
            expirationTime: result.user.stsTokenManager.expirationTime,
            updated: new Date().toISOString(),
          })
          msg = "welcome"
        } else {
          updateDoc(userDoc, {
            accessToken: credential.accessToken,
            refreshToken: result.user.stsTokenManager.refreshToken,
            expirationTime: result.user.stsTokenManager.expirationTime,
            updated: new Date().toISOString(),
          })
          msg = "token updated"
        }

        unsubscribe()
        return res.status(200).json({ msg, userId: result.user.uid })
      }
    }
  } catch (e) {
    console.log("eeerrrriiiirr", e)
    res.status(400).end()
  }
}
