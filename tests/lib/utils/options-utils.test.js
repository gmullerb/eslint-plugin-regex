// Copyright (c) 2026-present Gonzalo Müller Bravo.
// Licensed under the MIT License (MIT), see LICENSE.txt
const expect = require('node:assert')

const { describe, it } = require('node:test')

const { fromOptions } = require('../../../lib/utils/options-utils.js')

describe('fromOptions tests', () => {
  it('should convert string patterns to regex with gm flags', () => {
    // Arrange
    const options = [['foo', 'bar']]

    // Act
    const result = fromOptions(options)

    // Assert
    expect.equal(result.ignoreFilePattern.source, '^$')
    expect.equal(result.ignoreFilePattern.flags, '')
    expect.equal(result.patterns.length, 2)
    expect.equal(result.patterns[0].regex.source, 'foo')
    expect.equal(result.patterns[0].regex.flags, 'gm')
    expect.deepEqual(result.patterns[0].details, {})
    expect.equal(result.patterns[1].regex.source, 'bar')
    expect.equal(result.patterns[1].regex.flags, 'gm')
  })

  it('should build regex flags with g, m and the provided valid flags', () => {
    // Arrange
    const options = [[{
      id: 'someId',
      regex: 'foo',
      flags: 'UISU'
    }]]

    // Act
    const result = fromOptions(options)

    // Assert
    expect.equal(result.patterns[0].regex.source, 'foo')
    expect.equal(result.patterns[0].regex.flags, 'gimsu')
    expect.equal(result.patterns[0].details.id, 'someId')
    expect.equal(result.patterns[0].files, false)
  })

  it('should default flags to gm when flags is not defined', () => {
    // Arrange
    const options = [[{
      regex: 'foo'
    }]]

    // Act
    const result = fromOptions(options)

    // Assert
    expect.equal(result.patterns[0].regex.source, 'foo')
    expect.equal(result.patterns[0].regex.flags, 'gm')
  })

  it('should default flags to gm when flags is empty', () => {
    // Arrange
    const options = [[{
      regex: 'foo',
      flags: ''
    }]]

    // Act
    const result = fromOptions(options)

    // Assert
    expect.equal(result.patterns[0].regex.source, 'foo')
    expect.equal(result.patterns[0].regex.flags, 'gm')
  })

  it('should use options[1] as the ignore file pattern', () => {
    // Arrange
    const options = [['foo'], '.*test\\.js']

    // Act
    const result = fromOptions(options)

    // Assert
    expect.equal(result.ignoreFilePattern.source, '.*test\\.js')
    expect.equal(result.ignoreFilePattern.flags, '')
  })

  it('should convert files ignore and inspect patterns to regexes', () => {
    // Arrange
    const options = [[{
      regex: 'foo',
      files: {
        ignore: '.*test\\.js',
        inspect: '.*\\.js'
      }
    }]]

    // Act
    const result = fromOptions(options)

    // Assert
    expect.equal(result.patterns[0].files.ignore.source, '.*test\\.js')
    expect.equal(result.patterns[0].files.ignore.flags, '')
    expect.equal(result.patterns[0].files.inspect.source, '.*\\.js')
    expect.equal(result.patterns[0].files.inspect.flags, '')
  })

  it('should default inspect pattern when files only has ignore', () => {
    // Arrange
    const options = [[{
      regex: 'foo',
      files: {
        ignore: '.*test\\.js'
      }
    }]]

    // Act
    const result = fromOptions(options)

    // Assert
    expect.equal(result.patterns[0].files.ignore.source, '.*test\\.js')
    expect.equal(result.patterns[0].files.inspect.source, '^.*$')
  })

  it('should default ignore pattern when files only has inspect', () => {
    // Arrange
    const options = [[{
      regex: 'foo',
      files: {
        inspect: '.*\\.js'
      }
    }]]

    // Act
    const result = fromOptions(options)

    // Assert
    expect.equal(result.patterns[0].files.ignore.source, '^$')
    expect.equal(result.patterns[0].files.inspect.source, '.*\\.js')
  })
})
