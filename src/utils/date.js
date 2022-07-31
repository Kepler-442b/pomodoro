/**
 * File: /src/utils/date.js
 * Copyright (c) 2022 - Sooyeon Kim
 */

export const getYYYYMMDD = () => {
  let date = new Date().toLocaleDateString()
  date = date.split("/")

  date = `${date[2]}-${date[0]}-${date[1]}`

  return date
}
