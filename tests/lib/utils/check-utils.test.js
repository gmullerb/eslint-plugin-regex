// Copyright (c) 2026-present Gonzalo Müller Bravo.
// Licensed under the MIT License (MIT), see LICENSE.txt
const expect = require('node:assert')

const { describe, it } = require('node:test')

const { shouldCheck } = require('../../../lib/utils/check-utils.js')

describe('shouldCheck tests', () => {
  it('should return true when files parameter is falsy', () => {
    // Arrange
    const files = undefined
    const fileName = 'src/index.js'

    // Act
    const result = shouldCheck(files, fileName)

    // Assert
    expect.equal(result, true)
  })

  it('should return true when filename matches inspect and not ignore', () => {
    // Arrange
    const files = {
      ignore: /test\.js$/,
      inspect: /\.js$/
    }
    const fileName = 'src/index.js'

    // Act
    const result = shouldCheck(files, fileName)

    // Assert
    expect.equal(result, true)
  })

  it('should return false when filename matches ignore', () => {
    // Arrange
    const files = {
      ignore: /test\.js$/,
      inspect: /\.js$/
    }
    const fileName = 'src/index.test.js'

    // Act
    const result = shouldCheck(files, fileName)

    // Assert
    expect.equal(result, false)
  })

  it('should return false when filename does not match inspect', () => {
    // Arrange
    const files = {
      ignore: /test\.js$/,
      inspect: /\.js$/
    }
    const fileName = 'src/index.css'

    // Act
    const result = shouldCheck(files, fileName)

    // Assert
    expect.equal(result, false)
  })
})
