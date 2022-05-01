/**
 * File: /pages/api/users/login.ts
 * Copyright (c) 2022 - Sooyeon Kim
 */

import firebaseApp from "../../../firebase/clientApp"
import {
  getFirestore,
  getDocs,
  getDoc,
  doc,
  addDoc,
  collection,
  updateDoc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore"
import { OAuthCredential, UserCredential } from "firebase/auth"
import { NextApiRequest } from "next"
import {} from "next-iron-session"

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
        const collectionRef = collection(db, "users")

        // queries
        const q = query(collectionRef, where("userId", "==", result.user.uid))
        let userDoc
        onSnapshot(q, (snapshot) => {
          userDoc = snapshot.docs[0].ref
        })

        const docRef = doc(db, "users", result.user.uid)
        // const docs = (await getDocs(collectionRef)).docs

        const docSnapshot = (await getDoc(docRef)).data()

        console.log(docSnapshot)

        if (!userDoc) {
          addDoc(collectionRef, {
            userId: result.user.uid,
            accessToken: credential.accessToken,
            refreshToken: result.user.stsTokenManager.refreshToken,
            expirationTime: result.user.stsTokenManager.expirationTime,
            updated: new Date().toISOString(),
          })
          res.status(200).json({ msg: "user signed in for the first time" })
        } else {
          updateDoc(userDoc, {
            accessToken: credential.accessToken,
            refreshToken: result.user.stsTokenManager.refreshToken,
            expirationTime: result.user.stsTokenManager.expirationTime,
            updated: new Date().toISOString(),
          })
          res.status(200).json({ msg: "token updated" })
        }
      }
    }
  } catch (e) {
    console.log("eeerrrriiiirr", e)
    res.status(400).end()
  }
}
