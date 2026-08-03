// Copyright (c) 2026-present Gonzalo Müller Bravo.
// Licensed under the MIT License (MIT), see LICENSE.txt
const expect = require('node:assert')

const { describe, it } = require('node:test')

const { buildCreateFunction } = require('../../../lib/utils/create-utils.js')

describe('buildCreateFunction tests', () => {
  it('should call checkPatterns with parsed settings when file is not ignored', () => {
    // Arrange
    const node = {}
    const source = 'const a = 1'
    const context = {
      options: [['foo']],
      getFilename: () => 'src/index.js',
      getSourceCode: () => ({ getText: () => source }),
      report: () => {}
    }
    const received = {}
    const checkPatterns = (fileName, sourceCode, patterns, report, programNode) => {
      received.fileName = fileName
      received.sourceCode = sourceCode
      received.patterns = patterns
      received.report = report
      received.programNode = programNode
    }
    const create = buildCreateFunction(checkPatterns)

    // Act
    const handlers = create(context)
    handlers.Program(node)

    // Assert
    expect.equal(received.fileName, 'src/index.js')
    expect.equal(received.sourceCode, source)
    expect.equal(received.patterns.length, 1)
    expect.equal(received.patterns[0].regex.source, 'foo')
    expect.equal(received.patterns[0].regex.flags, 'gm')
    expect.equal(received.report, context.report)
    expect.equal(received.programNode, node)
  })

  it('should not call checkPatterns when file is ignored', () => {
    // Arrange
    const node = {}
    const context = {
      options: [['foo'], '.*\\.js'],
      getFilename: () => 'src/index.js',
      getSourceCode: () => ({ getText: () => '' }),
      report: () => {}
    }
    let calls = 0
    const checkPatterns = () => {
      calls += 1
    }
    const create = buildCreateFunction(checkPatterns)

    // Act
    const handlers = create(context)
    handlers.Program(node)

    // Assert
    expect.equal(calls, 0)
  })
})
