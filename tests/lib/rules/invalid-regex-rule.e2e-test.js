//  Copyright (c) 2020 Gonzalo Müller Bravo.
//  Licensed under the MIT License (MIT), see LICENSE.txt
const { readFileSync } = require('fs')
const { join } = require('path')

const RuleTester = require('eslint').RuleTester

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

const shouldFoundOnlyOnce = {
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

const shouldFoundFileCase001Minified = {
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

const shouldFoundFileCase002Minified = {
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

ruleTester.run(
  'invalid',
  require('../../../lib').rules.invalid, {
    valid: [
      shouldNotFind,
      shouldIgnoreFile,
      shouldHandleEmptyFile
    ],
    invalid: [
      shouldFound,
      shouldFoundSame,
      shouldFoundOnlyOnce,
      shouldFoundMultiline,
      shouldFoundSameMultiline,
      shouldFoundFileCase001Minified,
      shouldFoundFileCase002Minified,
      shouldFoundAcrossLines,
      shouldFoundAcrossMultiline,
      shouldFoundAcrossMultilineInTheMiddleOfLine,
      shouldFoundAcrossMultilineInTheMiddleOfLineMultipleTimes
    ]
  }
)

ruleTester.run(
  'invalid_extra',
  require('../../../lib').rules.invalid_extra, {
    valid: [
      shouldNotFind,
      shouldIgnoreFile,
      shouldHandleEmptyFile
    ],
    invalid: [
      shouldFound,
      shouldFoundSame,
      shouldFoundOnlyOnce,
      shouldFoundMultiline,
      shouldFoundSameMultiline,
      shouldFoundFileCase001Minified,
      shouldFoundFileCase002Minified,
      shouldFoundAcrossLines,
      shouldFoundAcrossMultiline,
      shouldFoundAcrossMultilineInTheMiddleOfLine,
      shouldFoundAcrossMultilineInTheMiddleOfLineMultipleTimes
    ]
  }
)

ruleTester.run(
  'invalid-extra',
  require('../../../lib').rules['invalid-extra'], {
    valid: [
      shouldNotFind,
      shouldIgnoreFile,
      shouldHandleEmptyFile
    ],
    invalid: [
      shouldFound,
      shouldFoundSame,
      shouldFoundOnlyOnce,
      shouldFoundMultiline,
      shouldFoundSameMultiline,
      shouldFoundFileCase001Minified,
      shouldFoundFileCase002Minified,
      shouldFoundAcrossLines,
      shouldFoundAcrossMultiline,
      shouldFoundAcrossMultilineInTheMiddleOfLine,
      shouldFoundAcrossMultilineInTheMiddleOfLineMultipleTimes
    ]
  }
)
