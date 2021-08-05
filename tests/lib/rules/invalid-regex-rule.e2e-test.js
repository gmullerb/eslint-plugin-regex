//  Copyright (c) 2020 Gonzalo Müller Bravo.
//  Licensed under the MIT License (MIT), see LICENSE.txt
const RuleTester = require('eslint').RuleTester

const invalidRegexRule = require('../../../lib/rules/invalid-regex-rule')

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2015 }})

const shouldNotFind = {
  code: 'var z = 1\nvar x = "valid"',
  filename: 'some.js',
  options: [
    ['invalid']
  ]
}

const shouldIgnoreFile = {
  code: 'const z = 1\nvar x = "invalid"',
  filename: 'some.test.js',
  options: [
    ['invalid'],
    '.*test\.js'
  ]
}

const shouldHandleEmptyFile = {
  code: '',
  filename: 'some.test.js',
  options: [
    ['invalid']
  ]
}

const shouldFound = {
  code: 'var z = 1\nvar x = "invalid"',
  filename: 'some.js',
  options: [
    ['invalid']
  ],
  errors: [{
    message: 'Invalid regular expression /invalid/gm found',
    line: 2,
    column: 10
  }]
}

const shouldFoundSame = {
  code: 'var z = 1\nvar x = "invalid invalid"',
  filename: 'some.js',
  options: [
    ['invalid']
  ],
  errors: [{
    message: 'Invalid regular expression /invalid/gm found',
    line: 2,
    column: 10
  }, {
    message: 'Invalid regular expression /invalid/gm found',
    line: 2,
    column: 18
  }]
}

const shouldFoundMultiline = {
  code: 'var z = 1\nvar x = "invalid"\n  var y = "invalid"',
  filename: 'some.js',
  options: [
    ['invalid']
  ],
  errors: [{
    message: 'Invalid regular expression /invalid/gm found',
    line: 2,
    column: 10
  }, {
    message: 'Invalid regular expression /invalid/gm found',
    line: 3,
    column: 12
  }]
}

const shouldFoundSameMultiline = {
  code: 'var z = 1\nvar x = "invalid invalid"\n  var z = "invalid"',
  filename: 'some.js',
  options: [
    ['invalid']
  ],
  errors: [{
    message: 'Invalid regular expression /invalid/gm found',
    line: 2,
    column: 10
  }, {
    message: 'Invalid regular expression /invalid/gm found',
    line: 2,
    column: 18
  }, {
    message: 'Invalid regular expression /invalid/gm found',
    line: 3,
    column: 12
  }]
}

const shouldFoundAcrossLines = {
  code: 'function z() {}\nvar \ninvalid = `1\n2`',
  filename: 'some.js',
  options: [
    ['^var\\s*invalid']
  ],
  errors: [{
    message: 'Invalid regular expression /^var\\s*invalid/gm found',
    line: 2,
    column: 1
  }]
}

const shouldFoundAcrossMultiline = {
  code: 'function z() {}\nvar \ninvalid = `1\n2`\n\nvar \ninvalid2 = 1',
  filename: 'some.js',
  options: [
    ['^var\\s*invalid']
  ],
  errors: [{
    message: 'Invalid regular expression /^var\\s*invalid/gm found',
    line: 2,
    column: 1
  }, {
    message: 'Invalid regular expression /^var\\s*invalid/gm found',
    line: 6,
    column: 1
  }]
}

const shouldFoundAcrossMultilineInTheMiddleOfLine = {
  code: 'function z() {}\n   var \ninvalid = `1\n2`\n\n     var \ninvalid2 = 1',
  filename: 'some.js',
  options: [
    ['var\\s*invalid']
  ],
  errors: [{
    message: 'Invalid regular expression /var\\s*invalid/gm found',
    line: 2,
    column: 4
  }, {
    message: 'Invalid regular expression /var\\s*invalid/gm found',
    line: 6,
    column: 6
  }]
}

const shouldFoundAcrossMultilineInTheMiddleOfLineMultipleTimes = {
  code: [
    'const one = `{',
    '    "TotalItems":5,',
    '}`;',
    'const two = `{',
    '    "TotalItems":5,',
    '}`;',
    'const three = `{',
    '    "TotalItems":5,',
    '}`;'
  ].join('\n'),
  filename: 'some.js',
  options: [
    ['[`\'"][\\s\\n]*\\{[\\s\\n]*"']
  ],
  errors: [{
    message: 'Invalid regular expression /[`\'"][\\s\\n]*\\{[\\s\\n]*"/gm found',
    line: 1,
    column: 13
  }, {
    message: 'Invalid regular expression /[`\'"][\\s\\n]*\\{[\\s\\n]*"/gm found',
    line: 4,
    column: 13
  }, {
    message: 'Invalid regular expression /[`\'"][\\s\\n]*\\{[\\s\\n]*"/gm found',
    line: 7,
    column: 15
  }]
}

ruleTester.run(
  'invalid',
  invalidRegexRule, {
    valid: [
      shouldNotFind,
      shouldIgnoreFile,
      shouldHandleEmptyFile
    ],
    invalid: [
      shouldFound,
      shouldFoundSame,
      shouldFoundMultiline,
      shouldFoundSameMultiline,
      shouldFoundAcrossLines,
      shouldFoundAcrossMultiline,
      shouldFoundAcrossMultilineInTheMiddleOfLine,
      shouldFoundAcrossMultilineInTheMiddleOfLineMultipleTimes
    ]
  }
)
