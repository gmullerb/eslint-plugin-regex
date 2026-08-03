//  Copyright (c) 2026-present Gonzalo Müller Bravo.
//  Licensed under the MIT License (MIT), see LICENSE.txt
const { readFileSync } = require('fs')
const { join } = require('path')
const { describe, it } = require('node:test')
const AnyEslintParser = require('any-eslint-parser')
const RuleTester = require('eslint').RuleTester

RuleTester.describe = describe
RuleTester.it = it

const ruleTester = new RuleTester({
  files: ['**/*.js', '**/*.txt'],
  languageOptions: { ecmaVersion: 2019 }
})

const shouldNotFind = {
  name: 'should not find invalid pattern in valid code',
  code: 'var z = 1\nvar x = "valid"',
  filename: 'some.js',
  options: [
    ['invalid']
  ]
}

const shouldIgnoreFile = {
  name: 'should ignore files matching the global ignore pattern',
  code: 'const z = 1\nvar x = "invalid"',
  filename: 'some.test.js',
  options: [
    ['invalid'],
    '.*test\.js'
  ]
}

const shouldHandleEmptyFile = {
  name: 'should handle empty files without errors',
  code: '',
  filename: 'some.test.js',
  options: [
    ['invalid']
  ]
}

const shouldFind = {
  name: 'should find invalid pattern',
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

const shouldFindSame = {
  name: 'should find same invalid pattern more than once on the same line',
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

const shouldFindOnlyOnce = {
  name: 'should find an overlapping pattern only once',
  code: 'var z = 1\nvar x = "==="',
  filename: 'some-only-once.js',
  options: [
    ['"*==']
  ],
  errors: [{
    message: 'Invalid regular expression /"*==/gm found',
    line: 2,
    column: 9
  }]
}

const shouldFindMultiline = {
  name: 'should find invalid pattern in multiple lines',
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

const shouldFindSameMultiline = {
  name: 'should find same invalid pattern more than once in multiple lines',
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

const shouldFindAcrossLines = {
  name: 'should find invalid pattern across lines',
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

const shouldFindAcrossMultiline = {
  name: 'should find invalid pattern across multiple lines',
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

const shouldFindAcrossMultilineInTheMiddleOfLine = {
  name: 'should find invalid pattern across lines starting in the middle of a line',
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

const shouldFindAcrossMultilineInTheMiddleOfLineMultipleTimes = {
  name: 'should find invalid pattern across lines starting in the middle of a line more than once',
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

const shouldFindFileCase001Minified = {
  name: 'should find invalid patterns in minified file case 001',
  code: readFileSync(join(__dirname, './case-001-minified.js'), 'utf8').toString(),
  filename: 'case-001-minified.js',
  options: [
    ['[^!]={2,3}(?!=)']
  ],
  errors: [{
    message: 'Invalid regular expression /[^!]={2,3}(?!=)/gm found',
    line: 2,
    column: 2305
  },
  {
    message: 'Invalid regular expression /[^!]={2,3}(?!=)/gm found',
    line: 2,
    column: 2308
  },
  {
    message: 'Invalid regular expression /[^!]={2,3}(?!=)/gm found',
    line: 2,
    column: 2930
  },
  {
    message: 'Invalid regular expression /[^!]={2,3}(?!=)/gm found',
    line: 2,
    column: 2940
  },
  {
    message: 'Invalid regular expression /[^!]={2,3}(?!=)/gm found',
    line: 2,
    column: 3120
  },
  {
    message: 'Invalid regular expression /[^!]={2,3}(?!=)/gm found',
    line: 2,
    column: 3131
  },
  {
    message: 'Invalid regular expression /[^!]={2,3}(?!=)/gm found',
    line: 2,
    column: 3141
  },
  {
    message: 'Invalid regular expression /[^!]={2,3}(?!=)/gm found',
    line: 2,
    column: 3151
  },
  {
    message: 'Invalid regular expression /[^!]={2,3}(?!=)/gm found',
    line: 2,
    column: 3386
  },
  {
    message: 'Invalid regular expression /[^!]={2,3}(?!=)/gm found',
    line: 2,
    column: 3528
  },
  {
    message: 'Invalid regular expression /[^!]={2,3}(?!=)/gm found',
    line: 2,
    column: 4462
  },
  {
    message: 'Invalid regular expression /[^!]={2,3}(?!=)/gm found',
    line: 2,
    column: 4487
  },
  {
    message: 'Invalid regular expression /[^!]={2,3}(?!=)/gm found',
    line: 2,
    column: 4593
  },
  {
    message: 'Invalid regular expression /[^!]={2,3}(?!=)/gm found',
    line: 2,
    column: 4666
  },
  {
    message: 'Invalid regular expression /[^!]={2,3}(?!=)/gm found',
    line: 2,
    column: 4688
  },
  {
    message: 'Invalid regular expression /[^!]={2,3}(?!=)/gm found',
    line: 2,
    column: 4728
  },
  {
    message: 'Invalid regular expression /[^!]={2,3}(?!=)/gm found',
    line: 2,
    column: 4842
  },
  {
    message: 'Invalid regular expression /[^!]={2,3}(?!=)/gm found',
    line: 2,
    column: 4979
  }]
}

const shouldFindFileCase002Minified = {
  name: 'should find invalid patterns in minified file case 002',
  code: readFileSync(join(__dirname, './case-002-minified.js'), 'utf8').toString(),
  filename: 'case-002-minified.js',
  options: [
    ['[^!]={2,3}(?!=)']
  ],
  errors: [{
    message: 'Invalid regular expression /[^!]={2,3}(?!=)/gm found',
    line: 2,
    column: 2305
  },
  {
    message: 'Invalid regular expression /[^!]={2,3}(?!=)/gm found',
    line: 2,
    column: 2308
  },
  {
    message: 'Invalid regular expression /[^!]={2,3}(?!=)/gm found',
    line: 2,
    column: 2930
  },
  {
    message: 'Invalid regular expression /[^!]={2,3}(?!=)/gm found',
    line: 2,
    column: 2940
  },
  {
    message: 'Invalid regular expression /[^!]={2,3}(?!=)/gm found',
    line: 2,
    column: 3120
  },
  {
    message: 'Invalid regular expression /[^!]={2,3}(?!=)/gm found',
    line: 2,
    column: 3131
  },
  {
    message: 'Invalid regular expression /[^!]={2,3}(?!=)/gm found',
    line: 2,
    column: 3141
  },
  {
    message: 'Invalid regular expression /[^!]={2,3}(?!=)/gm found',
    line: 2,
    column: 3151
  },
  {
    message: 'Invalid regular expression /[^!]={2,3}(?!=)/gm found',
    line: 2,
    column: 3386
  },
  {
    message: 'Invalid regular expression /[^!]={2,3}(?!=)/gm found',
    line: 2,
    column: 3528
  },
  {
    message: 'Invalid regular expression /[^!]={2,3}(?!=)/gm found',
    line: 2,
    column: 4462
  },
  {
    message: 'Invalid regular expression /[^!]={2,3}(?!=)/gm found',
    line: 2,
    column: 4487
  },
  {
    message: 'Invalid regular expression /[^!]={2,3}(?!=)/gm found',
    line: 2,
    column: 4593
  },
  {
    message: 'Invalid regular expression /[^!]={2,3}(?!=)/gm found',
    line: 2,
    column: 4666
  },
  {
    message: 'Invalid regular expression /[^!]={2,3}(?!=)/gm found',
    line: 2,
    column: 4688
  },
  {
    message: 'Invalid regular expression /[^!]={2,3}(?!=)/gm found',
    line: 2,
    column: 4728
  },
  {
    message: 'Invalid regular expression /[^!]={2,3}(?!=)/gm found',
    line: 2,
    column: 4842
  },
  {
    message: 'Invalid regular expression /[^!]={2,3}(?!=)/gm found',
    line: 2,
    column: 4979
  }]
}

const shouldWorkWhenRangeErrorMaximumCallStackSizeExceededCase003 = {
  name: 'should work when maximum call stack size is exceeded case 003',
  code: readFileSync(join(__dirname, './case-003-stack.txt'), 'utf8').toString(),
  languageOptions: { parser: AnyEslintParser },
  filename: 'some.txt',
  options: [
    ['^(?!(?:(feature|fix|docs|config|refactor|revert|test).*[\\.:]$)|(\\*\\s\\w.*\\.$)|$)']
  ]
}

const shouldWorkWhenRangeErrorMaximumCallStackSizeExceededCase004 = {
  name: 'should work when maximum call stack size is exceeded case 004',
  code: readFileSync(join(__dirname, './case-004-stack.txt'), 'utf8').toString(),
  languageOptions: { parser: AnyEslintParser },
  filename: 'some.txt',
  options: [
    ['^(?!(?:(feature|fix|docs|config|refactor|revert|test).*[\\.:]$)|(\\*\\s\\w.*\\.$)|$)']
  ],
  errors: [{
    message: 'Invalid regular expression /^(?!(?:(feature|fix|docs|config|refactor|revert|test).*[\\.:]$)|(\\*\\s\\w.*\\.$)|$)/gm found',
    line: 3,
    column: 1
  }]
}

const shouldWorkWhenRangeErrorMaximumCallStackSizeExceededWillReportOnlyFirstErrorCase005 = {
  name: 'should report only the first error when maximum call stack size is exceeded case 005',
  code: readFileSync(join(__dirname, './case-005-stack.txt'), 'utf8').toString(),
  languageOptions: { parser: AnyEslintParser },
  filename: 'some.txt',
  options: [
    ['^(?!((feature|fix|docs|config|refactor|revert|test).*[\\.:]$)|(\\*\\s\\w.*\\.$)|$)']
  ],
  errors: [{
    message: 'Invalid regular expression /^(?!((feature|fix|docs|config|refactor|revert|test).*[\\.:]$)|(\\*\\s\\w.*\\.$)|$)/gm found',
    line: 3,
    column: 1
  }]
  // Second Error will not be reported
  // {
  //   message: 'Invalid regular expression /^(?!((feature|fix|docs|config|refactor|revert|test).*[\\.:]$)|(\\*\\s\\w.*\\.$)|$)/gm found',
  //   line: 4,
  //   column: 1
  // }
}

const shouldWorkWhenRangeErrorMaximumCallStackSizeExceededCase006 = {
  name: 'should work when maximum call stack size is exceeded case 006',
  code: readFileSync(join(__dirname, './case-002-minified.js'), 'utf8').toString(),
  filename: 'some.js',
  options: [
    ['^(?!(?:(feature|fix|docs|config|refactor|revert|test).*[\\.:]$)|(\\*\\s\\w.*\\.$)|$)']
  ],
  errors: [{
    message: 'Invalid regular expression /^(?!(?:(feature|fix|docs|config|refactor|revert|test).*[\\.:]$)|(\\*\\s\\w.*\\.$)|$)/gm found',
    line: 2,
    column: 1
  }]
}

describe('Invalid Regex Rule - Short definition', () => {
  ruleTester.run(
    'invalid',
    require('../../lib').rules.invalid, {
      valid: [
        shouldNotFind,
        shouldIgnoreFile,
        shouldHandleEmptyFile,
        shouldWorkWhenRangeErrorMaximumCallStackSizeExceededCase003
      ],
      invalid: [
        shouldFind,
        shouldFindSame,
        shouldFindOnlyOnce,
        shouldFindMultiline,
        shouldFindSameMultiline,
        shouldFindFileCase001Minified,
        shouldFindFileCase002Minified,
        shouldFindAcrossLines,
        shouldFindAcrossMultiline,
        shouldFindAcrossMultilineInTheMiddleOfLine,
        shouldFindAcrossMultilineInTheMiddleOfLineMultipleTimes,
        shouldWorkWhenRangeErrorMaximumCallStackSizeExceededCase004,
        shouldWorkWhenRangeErrorMaximumCallStackSizeExceededWillReportOnlyFirstErrorCase005,
        shouldWorkWhenRangeErrorMaximumCallStackSizeExceededCase006
      ]
    }
  )
})

describe('Invalid Regex Rule - Complemented name', () => {
  ruleTester.run(
    'invalid_extra',
    require('../../lib').rules.invalid_extra, {
      valid: [
        shouldNotFind,
        shouldIgnoreFile,
        shouldHandleEmptyFile,
        shouldWorkWhenRangeErrorMaximumCallStackSizeExceededCase003
      ],
      invalid: [
        shouldFind,
        shouldFindSame,
        shouldFindOnlyOnce,
        shouldFindMultiline,
        shouldFindSameMultiline,
        shouldFindFileCase001Minified,
        shouldFindFileCase002Minified,
        shouldFindAcrossLines,
        shouldFindAcrossMultiline,
        shouldFindAcrossMultilineInTheMiddleOfLine,
        shouldFindAcrossMultilineInTheMiddleOfLineMultipleTimes,
        shouldWorkWhenRangeErrorMaximumCallStackSizeExceededCase004,
        shouldWorkWhenRangeErrorMaximumCallStackSizeExceededWillReportOnlyFirstErrorCase005,
        shouldWorkWhenRangeErrorMaximumCallStackSizeExceededCase006
      ]
    }
  )

  ruleTester.run(
    'invalid-extra',
    require('../../lib').rules['invalid-extra'], {
      valid: [
        shouldNotFind,
        shouldIgnoreFile,
        shouldHandleEmptyFile,
        shouldWorkWhenRangeErrorMaximumCallStackSizeExceededCase003
      ],
      invalid: [
        shouldFind,
        shouldFindSame,
        shouldFindOnlyOnce,
        shouldFindMultiline,
        shouldFindSameMultiline,
        shouldFindFileCase001Minified,
        shouldFindFileCase002Minified,
        shouldFindAcrossLines,
        shouldFindAcrossMultiline,
        shouldFindAcrossMultilineInTheMiddleOfLine,
        shouldFindAcrossMultilineInTheMiddleOfLineMultipleTimes,
        shouldWorkWhenRangeErrorMaximumCallStackSizeExceededCase004,
        shouldWorkWhenRangeErrorMaximumCallStackSizeExceededWillReportOnlyFirstErrorCase005,
        shouldWorkWhenRangeErrorMaximumCallStackSizeExceededCase006
      ]
    }
  )
})

