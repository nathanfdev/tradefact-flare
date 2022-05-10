export const letterNumbers = {
  A: 10,
  B: 12,
  C: 13,
  D: 14,
  E: 15,
  F: 16,
  G: 17,
  H: 18,
  I: 19,
  J: 20,
  K: 21,
  L: 23,
  M: 24,
  N: 25,
  O: 26,
  P: 27,
  Q: 28,
  R: 29,
  S: 30,
  T: 31,
  U: 32,
  V: 34,
  W: 35,
  X: 36,
  Y: 37,
  Z: 38
}

export const indexNumbers = {
  0: 1,
  1: 2,
  2: 4,
  3: 8,
  4: 16,
  5: 32,
  6: 64,
  7: 128,
  8: 256,
  9: 512
}

export function validateContainerNumber(containerNumber: string) {
  let count = 0
  let divideCount = 0
  let checkDigit = containerNumber.slice(-1)
  for (var i = 0; i < containerNumber.length; i++) {
    let char = containerNumber[i]
    if (i < 4) {
      if (hasKey(letterNumbers, char) && hasKey(indexNumbers, i)) {
        count += letterNumbers[char] * indexNumbers[i]
      }
    }
    if (i >= 4) {
      if (hasKey(indexNumbers, i)) {
        count += parseInt(char) * indexNumbers[i]
      }
    }
  }
  divideCount = Math.floor(count / 11) * 11
  if (count - divideCount === parseInt(checkDigit)) {
    return true
  } else {
    return false
  }
}

export function hasKey<O>(obj: O, key: keyof any): key is keyof O {
  return key in obj
}
