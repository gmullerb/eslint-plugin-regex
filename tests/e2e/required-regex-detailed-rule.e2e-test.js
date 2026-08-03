//  Copyright (c) 2026-present Gonzalo Müller Bravo.
//  Licensed under the MIT License (MIT), see LICENSE.txt
const { describe, it } = require('node:test')
const RuleTester = require('eslint').RuleTester

RuleTester.describe = describe
RuleTester.it = it

const requiredRegexRule = require('../../lib/rules/required-regex-rule')

const ruleTester = new RuleTester({ languageOptions: { ecmaVersion: 2019 }})

const shouldNotFind = {
  name: 'should not find required pattern in file',
  code: 'var z = 1\nvar x = "valid"',
  filename: 'some.js',
  options: [
    [{
      regex: 'required'
    }]
  ],
  errors: [{
    message: 'Required regular expression /required/gm not found in file',
    line: 1,
    column: 1
  }]
}

const shouldIgnoreFile = {
  name: 'should ignore files matching the files ignore pattern',
  code: 'var z = 1\nvar x = "valid"',
  filename: 'some.test.js',
  options: [
    [{
      regex: 'required',
      files: {
        ignore: '.*test\.js'
      }
    }],
  ]
}

const shouldNotInspectFile = {
  name: 'should not inspect files not matching the inspect pattern',
  code: 'var z = 1\nvar x = "valid"',
  filename: 'some.test.js',
  options: [
    [{
      regex: 'required',
      files: {
        inspect: '.*spec\.js'
      }
    }],
  ]
}

const shouldHandleBothIgnoreInspectFile = {
  name: 'should handle files matching both ignore and inspect patterns',
  code: 'var z = 1\nvar x = "valid"',
  filename: 'some.test.js',
  options: [
    [{
      regex: 'required',
      files: {
        ignore: '.*test\.js',
        inspect: '.*spec\.js'
      }
    }],
  ]
}

const shouldFind = {
  name: 'should find required pattern in file',
  code: 'var z = 1\nvar x = "required"',
  filename: 'some.js',
  options: [
    [{
      regex: 'required'
    }]
  ]
}

const shouldFindAcrossLines = {
  name: 'should find required pattern across lines',
  code: 'function z() {}\nconst \nrequired = "1"',
  filename: 'some.js',
  options: [
    [{
      regex: '^const\\s*required'
    }]
  ]
}

describe('Required Regex Rule - Detailed definition', () => {
  ruleTester.run(
    'required',
    requiredRegexRule, {
      valid: [
        shouldIgnoreFile,
        shouldFind,
        shouldFindAcrossLines,
        shouldNotInspectFile,
        shouldHandleBothIgnoreInspectFile
      ],
      invalid: [
        shouldNotFind
      ]
    }
  )
})
