// Copyright (c) 2026-present Gonzalo Müller Bravo.
// Licensed under the MIT License (MIT), see LICENSE.txt
const expect = require('node:assert')

const { describe, it } = require('node:test')

const { formatReportMessage } = require('../../../lib/utils/report-utils.js')

describe('formatReportMessage tests', () => {
  it('should return pattern.details.message when defined', () => {
    // Arrange
    const pattern = {
      regex: /foo/,
      details: {
        message: 'Custom error message',
        id: 'someId'
      }
    }
    const createMsg = (from) => `Default msg with ${from}`

    // Act
    const result = formatReportMessage(pattern, createMsg)

    // Assert
    expect.equal(result, 'Custom error message')
  })

  it('should format with pattern.details.id when message is undefined but id is defined', () => {
    // Arrange
    const pattern = {
      regex: /foo/,
      details: {
        id: 'someId'
      }
    }
    const createMsg = (from) => `Default msg with ${from}`

    // Act
    const result = formatReportMessage(pattern, createMsg)

    // Assert
    expect.equal(result, 'Default msg with \'someId\'')
  })

  it('should format with pattern.regex when message and id are undefined', () => {
    // Arrange
    const pattern = {
      regex: /foo/gm,
      details: {}
    }
    const createMsg = (from) => `Default msg with ${from}`

    // Act
    const result = formatReportMessage(pattern, createMsg)

    // Assert
    expect.equal(result, 'Default msg with /foo/gm')
  })
})
