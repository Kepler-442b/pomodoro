export const getYYYYMMDD = () => {
  let date = new Date()
  date = date.toISOString().split("T")[0]

  return date
}
