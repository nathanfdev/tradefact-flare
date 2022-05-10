import '@testing-library/jest-dom'
const crypto = require('crypto')

beforeAll(() => {
  Object.assign(window, {
    scrollTo: jest.fn()
  })
})

Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: (arr: any) => crypto.randomBytes(arr.length)
  }
})
