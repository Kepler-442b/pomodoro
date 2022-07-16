/**
 * File: /utils/db/index.js
 * Copyright (c) 2022 - Sooyeon Kim
 */

import * as firebaseAdmin from "firebase-admin/app"
import {
  type,
  project_id,
  private_key_id,
  private_key,
  client_email,
  client_id,
  auth_uri,
  token_uri,
  auth_provider_x509_cert_url,
  client_x509_cert_url,
} from "../prjConfig"

if (
  !type ||
  !project_id ||
  !private_key_id ||
  !private_key ||
  !client_email ||
  !client_id ||
  !auth_uri ||
  !token_uri ||
  !auth_provider_x509_cert_url ||
  !client_x509_cert_url
) {
  console.log(`Failed to load Firebase credentials. `)
}

if (!firebaseAdmin.apps.length) {
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert({
      type: type,
      project_id: project_id,
      private_key_id: private_key_id,
      private_key: private_key,
      client_email: client_email,
      client_id: client_id,
      auth_uri: auth_uri,
      token_uri: token_uri,
      auth_provider_x509_cert_url: auth_provider_x509_cert_url,
      client_x509_cert_url: client_x509_cert_url,
    }),
    databaseURL: "https://pomodoro-d9028.firebaseio.com",
  })
}

export { firebaseAdmin }
