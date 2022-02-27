//  Copyright (c) 2020 Gonzalo Müller Bravo.
//  Licensed under the MIT License (MIT), see LICENSE.txt
const RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2015 }})

const shouldNotFind = {
  code: 'var z = 1\nvar x = "valid"',
  filename: 'some.js',
  options: [
    ['required']
  ],
  errors: [{
    message: 'Required regular expression /required/gm not found in file',
    line: 1,
    column: 1
  }]
}

const shouldHandleEmptyFile = {
  code: '',
  filename: 'some.test.js',
  options: [
    ['required']
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
    ['required'],
    '.*test\.js'
  ]
}

const shouldFound = {
  code: 'var z = 1\nvar x = "required"',
  filename: 'some.js',
  options: [
    ['required']
  ]
}

const shouldFoundAcrossLines = {
  code: 'function z() {}\nconst \nrequired = "1"',
  filename: 'some.js',
  options: [
    ['^const\\s*required']
  ]
}

ruleTester.run(
  'required',
  require('../../../lib').rules.required, {
    valid: [
      shouldIgnoreFile,
      shouldFound,
      shouldFoundAcrossLines
    ],
    invalid: [
      shouldNotFind,
      shouldHandleEmptyFile
    ]
  }
)

ruleTester.run(
  'required_extra',
  require('../../../lib').rules.required_extra, {
    valid: [
      shouldIgnoreFile,
      shouldFound,
      shouldFoundAcrossLines
    ],
    invalid: [
      shouldNotFind,
      shouldHandleEmptyFile
    ]
  }
)

ruleTester.run(
  'required-extra',
  require('../../../lib').rules['required-extra'], {
    valid: [
      shouldIgnoreFile,
      shouldFound,
      shouldFoundAcrossLines
    ],
    invalid: [
      shouldNotFind,
      shouldHandleEmptyFile
    ]
  }
)

if(require('../../../lib').rules['no-valid-extra'] !== undefined) {
  throw 'non valid rule should be undefined'
}
