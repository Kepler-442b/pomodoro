/**
 * File: /src/utils/date.ts
 * Copyright (c) 2022 - Sooyeon Kim
 */

export const getYYYYMMDD = (received?: Date) => {
  let date = new Date().toLocaleDateString()

  if (received) date = received.toLocaleDateString()

  let d = date.split("/")

  return `${d[2]}-${d[0]}-${d[1]}`
}
