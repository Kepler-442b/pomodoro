/**
 * File: /src/utils/debounce.js
 * Copyright (c) 2022 - Sooyeon Kim
 */

const debounce = (func, delay) => {
  let timer = null
  return (args) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

export default debounce
