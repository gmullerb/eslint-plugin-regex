// Copyright (c) 2026-present Gonzalo Müller Bravo.
// Licensed under the MIT License (MIT), see LICENSE.txt
const expect = require('node:assert')

const { describe, it } = require('node:test')
const { Linter } = require('eslint')

const invalidRegexRule = require('../../../lib/rules/invalid-regex-rule.js')

const linter = new Linter()

function verify(source, options, filename) {
  return linter.verify(
    source,
    [{
      files: ['**/*', '*.*'],
      languageOptions: {
        ecmaVersion: 2019
      },
      plugins: {
        regex: {
          rules: {
            invalid: invalidRegexRule
          }
        }
      },
      rules: {
        'regex/invalid': ['error'].concat(options)
      }
    }],
    { filename }
  )
}

function verifyAndFix(source, options, filename) {
  return linter.verifyAndFix(
    source,
    [{
      languageOptions: {
        ecmaVersion: 2019
      },
      plugins: {
        regex: {
          rules: {
            invalid: invalidRegexRule
          }
        }
      },
      rules: {
        'regex/invalid': ['error'].concat(options)
      }
    }],
    { filename }
  )
}

describe('invalid-regex-rule tests', () => {
  it('should define the rule meta', () => {
    // Arrange
    const expectedSchemaSize = 2

    // Act
    const meta = invalidRegexRule.meta

    // Assert
    expect.equal(meta.type, 'suggestion')
    expect.equal(meta.fixable, 'code')
    expect.equal(meta.docs.description, 'Invalid regular expressions to be reported')
    expect.equal(meta.docs.category, 'Stylistic Issues')
    expect.equal(meta.docs.url, 'https://eslint-plugin-regex.github.io/docs/rules/invalid-regex-rule.html')
    expect.equal(meta.schema.length, expectedSchemaSize)
    expect.equal(typeof invalidRegexRule.create, 'function')
  })

  it('should not report when pattern is not found', () => {
    // Arrange
    const source = 'var x = "valid"'

    // Act
    const result = verify(source, [['invalid']], 'some.js')

    // Assert
    expect.equal(result.length, 0)
  })

  it('should report pattern found', () => {
    // Arrange
    const source = 'var x = "invalid"'

    // Act
    const result = verify(source, [['invalid']], 'some.js')

    // Assert
    expect.equal(result.length, 1)
    expect.equal(result[0].message, 'Invalid regular expression /invalid/gm found')
    expect.equal(result[0].line, 1)
    expect.equal(result[0].column, 10)
  })

  it('should report each occurrence of the pattern', () => {
    // Arrange
    const source = 'var x = "invalid invalid"'

    // Act
    const result = verify(source, [['invalid']], 'some.js')

    // Assert
    expect.equal(result.length, 2)
    expect.equal(result[1].column, 18)
  })

  it('should report using the id when the detailed pattern has one', () => {
    // Arrange
    const source = 'var x = "invalid"'

    // Act
    const result = verify(source, [[{
      regex: 'invalid',
      id: 'someId'
    }]], 'some.js')

    // Assert
    expect.equal(result.length, 1)
    expect.equal(result[0].message, 'Invalid regular expression \'someId\' found')
  })

  it('should report the custom message when the detailed pattern has one', () => {
    // Arrange
    const source = 'var x = "invalid"'

    // Act
    const result = verify(source, [[{
      regex: 'invalid',
      message: 'Custom message'
    }]], 'some.js')

    // Assert
    expect.equal(result.length, 1)
    expect.equal(result[0].message, 'Custom message')
  })

  it('should use the configured flags', () => {
    // Arrange
    const source = 'var x = "INVALID"'

    // Act
    const result = verify(source, [[{
      regex: 'invalid',
      flags: 'i'
    }]], 'some.js')

    // Assert
    expect.equal(result.length, 1)
    expect.equal(result[0].message, 'Invalid regular expression /invalid/gim found')
  })

  it('should ignore files matching the files ignore pattern', () => {
    // Arrange
    const source = 'var x = "invalid"'

    // Act
    const result = verify(source, [[{
      regex: 'invalid',
      files: {
        ignore: '.*\\.test\\.js'
      }
    }]], 'some.test.js')

    // Assert
    expect.equal(result.length, 0)
  })

  it('should only inspect files matching the files inspect pattern', () => {
    // Arrange
    const source = 'var x = "invalid"'

    // Act
    const result = verify(source, [[{
      regex: 'invalid',
      files: {
        inspect: '.*\\.js'
      }
    }]], 'some.css')

    // Assert
    expect.equal(result.length, 0)
  })

  it('should ignore files matching the global ignore pattern', () => {
    // Arrange
    const source = 'var x = "invalid"'

    // Act
    const result = verify(source, [['invalid'], '.*\\.test\\.js'], 'some.test.js')

    // Assert
    expect.equal(result.length, 0)
  })

  it('should fix with a string replacement', () => {
    // Arrange
    const source = 'var x = "invalid"'

    // Act
    const result = verifyAndFix(source, [[{
      regex: 'invalid',
      replacement: 'valid'
    }]], 'some.js')

    // Assert
    expect.equal(result.fixed, true)
    expect.equal(result.output, 'var x = "valid"')
  })

  it('should fix with a function replacement', () => {
    // Arrange
    const source = 'var x = "invalid"'

    // Act
    const result = verifyAndFix(source, [[{
      regex: 'invalid',
      replacement: {
        function: 'text.toUpperCase()'
      }
    }]], 'some.js')

    // Assert
    expect.equal(result.fixed, true)
    expect.equal(result.output, 'var x = "INVALID"')
  })

  it('should not fix when the function replacement is invalid', () => {
    // Arrange
    const source = 'var x = "invalid"'

    // Act
    const result = verifyAndFix(source, [[{
      regex: 'invalid',
      replacement: {
        function: 'unknownFunction(text)'
      }
    }]], 'some.js')

    // Assert
    expect.equal(result.fixed, true)
    expect.equal(result.output, source)
  })
})
