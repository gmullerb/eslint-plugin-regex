// Copyright (c) 2026-present Gonzalo Müller Bravo.
// Licensed under the MIT License (MIT), see LICENSE.txt
const expect = require('node:assert')

const { describe, it } = require('node:test')
const { Linter } = require('eslint')

const requiredRegexRule = require('../../../lib/rules/required-regex-rule.js')

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
            required: requiredRegexRule
          }
        }
      },
      rules: {
        'regex/required': ['error'].concat(options)
      }
    }],
    { filename }
  )
}

describe('required-regex-rule tests', () => {
  it('should define the rule meta', () => {
    // Arrange
    const expectedSchemaSize = 2

    // Act
    const meta = requiredRegexRule.meta

    // Assert
    expect.equal(meta.type, 'suggestion')
    expect.equal(meta.fixable, undefined)
    expect.equal(meta.docs.description, 'Required regular expressions to be looked')
    expect.equal(meta.docs.category, 'Stylistic Issues')
    expect.equal(meta.docs.url, 'https://eslint-plugin-regex.github.io/docs/rules/required-regex-rule.html')
    expect.equal(meta.schema.length, expectedSchemaSize)
    expect.equal(typeof requiredRegexRule.create, 'function')
  })

  it('should not report when the required pattern is found', () => {
    // Arrange
    const source = 'var x = "foo"'

    // Act
    const result = verify(source, [['foo']], 'some.js')

    // Assert
    expect.equal(result.length, 0)
  })

  it('should report when the required pattern is not found', () => {
    // Arrange
    const source = 'var x = 1'

    // Act
    const result = verify(source, [['foo']], 'some.js')

    // Assert
    expect.equal(result.length, 1)
    expect.equal(result[0].message, 'Required regular expression /foo/gm not found in file')
    expect.equal(result[0].line, 1)
    expect.equal(result[0].column, 1)
  })

  it('should report using the id when the detailed pattern has one', () => {
    // Arrange
    const source = 'var x = 1'

    // Act
    const result = verify(source, [[{
      regex: 'foo',
      id: 'someId'
    }]], 'some.js')

    // Assert
    expect.equal(result.length, 1)
    expect.equal(result[0].message, 'Required regular expression \'someId\' not found in file')
  })

  it('should report the custom message when the detailed pattern has one', () => {
    // Arrange
    const source = 'var x = 1'

    // Act
    const result = verify(source, [[{
      regex: 'foo',
      message: 'Custom message'
    }]], 'some.js')

    // Assert
    expect.equal(result.length, 1)
    expect.equal(result[0].message, 'Custom message')
  })

  it('should use the configured flags', () => {
    // Arrange
    const source = 'var x = "FOO"'

    // Act
    const result = verify(source, [[{
      regex: 'foo',
      flags: 'i'
    }]], 'some.js')

    // Assert
    expect.equal(result.length, 0)
  })

  it('should ignore files matching the files ignore pattern', () => {
    // Arrange
    const source = 'var x = 1'

    // Act
    const result = verify(source, [[{
      regex: 'foo',
      files: {
        ignore: '.*\\.test\\.js'
      }
    }]], 'some.test.js')

    // Assert
    expect.equal(result.length, 0)
  })

  it('should only inspect files matching the files inspect pattern', () => {
    // Arrange
    const source = 'var x = 1'

    // Act
    const result = verify(source, [[{
      regex: 'foo',
      files: {
        inspect: '.*\\.js'
      }
    }]], 'some.css')

    // Assert
    console.log(result)
    expect.equal(result.length, 0)
  })

  it('should inspect files matching the files inspect pattern', () => {
    // Arrange
    const source = 'var x = 1'

    // Act
    const result = verify(source, [[{
      regex: 'foo',
      files: {
        inspect: '.*\\.js'
      }
    }]], 'some.js')

    // Assert
    expect.equal(result.length, 1)
  })

  it('should ignore files matching the global ignore pattern', () => {
    // Arrange
    const source = 'var x = 1'

    // Act
    const result = verify(source, [['foo'], '.*\\.test\\.js'], 'some.test.js')

    // Assert
    expect.equal(result.length, 0)
  })
})
