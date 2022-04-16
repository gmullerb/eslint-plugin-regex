//  Copyright (c) 2020 Gonzalo Müller Bravo.
//  Licensed under the MIT License (MIT), see LICENSE.txt
const RuleTester = require('eslint').RuleTester

const requiredRegexRule = require('../../../lib/rules/required-regex-rule')

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2015 }})

const shouldNotFind = {
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

const shouldFound = {
  code: 'var z = 1\nvar x = "required"',
  filename: 'some.js',
  options: [
    [{
      regex: 'required'
    }]
  ]
}

const shouldFoundAcrossLines = {
  code: 'function z() {}\nconst \nrequired = "1"',
  filename: 'some.js',
  options: [
    [{
      regex: '^const\\s*required'
    }]
  ]
}

ruleTester.run(
  'required',
  requiredRegexRule, {
    valid: [
      shouldIgnoreFile,
      shouldFound,
      shouldFoundAcrossLines,
      shouldNotInspectFile,
      shouldHandleBothIgnoreInspectFile
    ],
    invalid: [
      shouldNotFind,
    ]
  }
)
