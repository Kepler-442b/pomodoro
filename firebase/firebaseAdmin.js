/**
 * File: /utils/db/index.js
 * Copyright (c) 2022 - Sooyeon Kim
 */

import * as firebaseAdmin from "firebase-admin/app"
import secrets from "../secrets.json"

if (!secrets) {
  console.log(`Failed to load Firebase credentials. `)
}

if (!firebaseAdmin.apps.length) {
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(secrets),
    databaseURL: "https://pomodoro-d9028.firebaseio.com",
  })
}

export { firebaseAdmin }
