//  Copyright (c) 2026-present Gonzalo Müller Bravo.
//  Licensed under the MIT License (MIT), see LICENSE.txt
const { describe, it } = require('node:test')
const expect = require('node:assert/strict')
const RuleTester = require('eslint').RuleTester

RuleTester.describe = describe
RuleTester.it = it

const ruleTester = new RuleTester({ languageOptions: { ecmaVersion: 2019 }})

const shouldNotFind = {
  name: 'should not find required pattern in file',
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
  name: 'should report required pattern missing in empty file',
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
  name: 'should ignore files matching the global ignore pattern',
  code: 'var z = 1\nvar x = "valid"',
  filename: 'some.test.js',
  options: [
    ['required'],
    '.*test\.js'
  ]
}

const shouldFind = {
  name: 'should find required pattern in file',
  code: 'var z = 1\nvar x = "required"',
  filename: 'some.js',
  options: [
    ['required']
  ]
}

const shouldFindAcrossLines = {
  name: 'should find required pattern across lines',
  code: 'function z() {}\nconst \nrequired = "1"',
  filename: 'some.js',
  options: [
    ['^const\\s*required']
  ]
}

describe('Required Regex Rule - Short definition', () => {
  ruleTester.run(
    'required',
    require('../../lib').rules.required, {
      valid: [
        shouldIgnoreFile,
        shouldFind,
        shouldFindAcrossLines
      ],
      invalid: [
        shouldNotFind,
        shouldHandleEmptyFile
      ]
    }
  )
})

describe('Required Regex Rule - Complemented name', () => {
  ruleTester.run(
    'required_extra',
    require('../../lib').rules.required_extra, {
      valid: [
        shouldIgnoreFile,
        shouldFind,
        shouldFindAcrossLines
      ],
      invalid: [
        shouldNotFind,
        shouldHandleEmptyFile
      ]
    }
  )

  ruleTester.run(
    'required-extra',
    require('../../lib').rules['required-extra'], {
      valid: [
        shouldIgnoreFile,
        shouldFind,
        shouldFindAcrossLines
      ],
      invalid: [
        shouldNotFind,
        shouldHandleEmptyFile
      ]
    }
  )

  it('should return undefined when non valid rule name', () => {
    expect.equal(require('../../lib').rules['no-valid-extra'], undefined)
  })
})
