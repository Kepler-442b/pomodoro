/**
 * File: /src/utils/date.js
 * Copyright (c) 2022 - Sooyeon Kim
 */

export const getYYYYMMDD = () => {
  let date = new Date()
  date = date.toISOString().split("T")[0]

  return date
}
