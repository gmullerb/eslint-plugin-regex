//  Copyright (c) 2020 Gonzalo Müller Bravo.
//  Licensed under the MIT License (MIT), see LICENSE.txt
const RuleTester = require('eslint').RuleTester

const invalidRegexRule = require('../../../lib/rules/invalid-regex-rule')

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2015 }})

const shouldNotFind = {
  code: 'var z = 1\nvar x = "valid"',
  filename: 'some.js',
  options: [
    [{
      regex: 'invalid'
    }]
  ]
}

const shouldIgnoreFile = {
  code: 'const z = 1\nvar x = "invalid"',
  filename: 'some.test.js',
  options: [
    [{
      regex: 'invalid',
      files: {
        ignore: '.*test\.js'
      }
    }]
  ]
}

const shouldNotInspectedFile = {
  code: 'const z = 1\nvar x = "invalid"',
  filename: 'some.test.js',
  options: [
    [{
      regex: 'invalid',
      files: {
        inspect: '.*spec\.js'
      }
    }]
  ]
}

const shouldFound = {
  code: 'var z = 1\nvar x = "invalid"',
  filename: 'some.js',
  options: [
    [{
      regex: 'invalid'
    }]
  ],
  errors: [{
    message: 'Invalid regular expression /invalid/gm found',
    line: 2,
    column: 10
  }]
}

const shouldFoundWithId = {
  code: 'var z = 1\nvar x = "invalid"',
  filename: 'some.js',
  options: [
    [{
      id: 'SomeInvalid',
      regex: 'invalid'
    }]
  ],
  errors: [{
    message: 'Invalid regular expression \'SomeInvalid\' found',
    line: 2,
    column: 10
  }]
}

const shouldFoundWithMessage = {
  code: 'var z = 1\nvar x = "invalid"',
  filename: 'some.js',
  options: [
    [{
      id: 'SomeInvalid',
      regex: 'invalid',
      message: '\'invalid\' text should never be used'
    }]
  ],
  errors: [{
    message: '\'invalid\' text should never be used',
    line: 2,
    column: 10
  }]
}

const shouldFoundSame = {
  code: 'var z = 1\nvar x = "invalid invalid"',
  filename: 'some.js',
  options: [
    [{
      regex: 'invalid'
    }]
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
    [{
      regex: 'invalid'
    }]
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
    [{
      regex: 'invalid'
    }]
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
    [{
      regex: '^var\\s*invalid'
    }]
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
    [{
      regex: '^var\\s*invalid'
    }]
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

ruleTester.run(
  'invalid',
  invalidRegexRule, {
    valid: [
      shouldNotFind,
      shouldIgnoreFile,
      shouldNotInspectedFile
    ],
    invalid: [
      shouldFound,
      shouldFoundWithId,
      shouldFoundWithMessage,
      shouldFoundSame,
      shouldFoundMultiline,
      shouldFoundSameMultiline,
      shouldFoundAcrossLines,
      shouldFoundAcrossMultiline
    ]
  }
)
