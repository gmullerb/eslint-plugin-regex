//  Copyright (c) 2020 Gonzalo Müller Bravo.
//  Licensed under the MIT License (MIT), see LICENSE.txt
/* eslint-disable max-lines */
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

const shouldNotFindWithoutFlags = {
  code: 'var z = 1\nvar x = "inValid"',
  filename: 'some.js',
  options: [
    [{
      regex: 'invalid'
    }]
  ]
}

const shouldNotFindWithInvalidFlags = {
  code: 'var z = 1\nvar x = "inValid"',
  filename: 'some.js',
  options: [
    [{
      regex: 'invalid',
      flags: 'ER'
    }]
  ]
}

const shouldNotFindWithInvalidFlagsTooMany = {
  code: 'var z = 1\nvar x = "inValid"',
  filename: 'some.js',
  options: [
    [{
      regex: 'invalid',
      flags: 'IsuI'
    }]
  ]
}

const shouldNotFindWithInvalidFlagsMixedWithValid = {
  code: 'var z = 1\nvar x = "invalid"',
  filename: 'some.js',
  options: [
    [{
      regex: '1.var',
      flags: 'Es'
    }]
  ],
  errors: [{
    message: 'Invalid regular expression /1.var/gms found',
    line: 1,
    column: 9
  }]
}

const shouldNotFindWithoutFlags2 = {
  code: 'var z = 1\nvar x = "inValid"',
  filename: 'some.js',
  options: [
    [{
      regex: '1.var'
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

const shouldNotInspectFile = {
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

const shouldHandleBothIgnoreInspectFile = {
  code: 'const z = 1\nvar x = "invalid"',
  filename: 'some.test.js',
  options: [
    [{
      regex: 'invalid',
      files: {
        ignore: '.*test\.js',
        inspect: '.*spec\.js'
      }
    }]
  ]
}

const shouldFind = {
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

const shouldFindWithFlag = {
  code: 'var z = 1\nvar x = "inValid"',
  filename: 'some.js',
  options: [
    [{
      regex: 'invalid',
      flags: 'i'
    }]
  ],
  errors: [{
    message: 'Invalid regular expression /invalid/gim found',
    line: 2,
    column: 10
  }]
}

const shouldFindWithFlag2 = {
  code: 'var z = 1\nvar x = "invalid"',
  filename: 'some.js',
  options: [
    [{
      regex: '1.var',
      flags: 's'
    }]
  ],
  errors: [{
    message: 'Invalid regular expression /1.var/gms found',
    line: 1,
    column: 9
  }]
}

const shouldFindWithMultipleFlags = {
  code: 'const A = 5;var z = A\nvar x = "invalid"',
  filename: 'some.js',
  options: [
    [{
      regex: 'a.var',
      flags: 'sI'
    }]
  ],
  errors: [{
    message: 'Invalid regular expression /a.var/gims found',
    line: 1,
    column: 21
  }]
}

const shouldFindWithDuplicatedFlags = {
  code: 'const A = 5;var z = A\nvar x = "invalid"',
  filename: 'some.js',
  options: [
    [{
      regex: 'a.var',
      flags: 'sIi'
    }]
  ],
  errors: [{
    message: 'Invalid regular expression /a.var/gims found',
    line: 1,
    column: 21
  }]
}

const shouldFindWithDuplicatedFlags2 = {
  code: 'const A = 5;var z = A\nvar x = "invalid"',
  filename: 'some.js',
  options: [
    [{
      regex: 'a.var',
      flags: 'siI'
    }]
  ],
  errors: [{
    message: 'Invalid regular expression /a.var/gims found',
    line: 1,
    column: 21
  }]
}

const shouldFindWithAlternatePathsNextLineCounterOverflow = {
  code: 'const A = 5;var z = A\nvar x = "invalid"\nconst C = 5;var r = A;var q = "invalid"\nconst B = 5;var y = A\nvar w = "invalid";var a = A',
  filename: 'some.js',
  options: [
    [{
      regex: '..var',
      flags: 'sI'
    }]
  ],
  errors: [{
    message: 'Invalid regular expression /..var/gims found',
    line: 1,
    column: 11
  }, {
    message: 'Invalid regular expression /..var/gims found',
    line: 1,
    column: 21
  }, {
    message: 'Invalid regular expression /..var/gims found',
    line: 3,
    column: 11
  }, {
    message: 'Invalid regular expression /..var/gims found',
    line: 3,
    column: 21
  }, {
    message: 'Invalid regular expression /..var/gims found',
    line: 4,
    column: 11
  }, {
    message: 'Invalid regular expression /..var/gims found',
    line: 4,
    column: 21
  }, {
    message: 'Invalid regular expression /..var/gims found',
    line: 5,
    column: 17
  }]
}

const shouldFindWithUppercaseFlag = {
  code: 'var z = 1\nvar x = "inValid"',
  filename: 'some.js',
  options: [
    [{
      regex: 'invalid',
      flags: 'I'
    }]
  ],
  errors: [{
    message: 'Invalid regular expression /invalid/gim found',
    line: 2,
    column: 10
  }]
}

const shouldFindWithId = {
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

const shouldFindWithMessage = {
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

const shouldFindSame = {
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

const shouldFindMultiline = {
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

const shouldFindSameMultiline = {
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

const shouldFindAcrossLines = {
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

const shouldFindAcrossLinesWithFlag = {
  code: 'function z() {}\nvar \ninvalid = `1\n2`',
  filename: 'some.js',
  options: [
    [{
      regex: '^var.*invalid',
      flags: 'S'
    }]
  ],
  errors: [{
    message: 'Invalid regular expression /^var.*invalid/gms found',
    line: 2,
    column: 1
  }]
}

const shouldFindAcrossMultiline = {
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

const shouldReplace = {
  code: 'var z = 1\nvar x = "invalid"',
  filename: 'some.js',
  options: [
    [{
      regex: 'invalid',
      replacement: 'valid'
    }]
  ],
  errors: [{
    message: 'Invalid regular expression /invalid/gm found',
    line: 2,
    column: 10
  }],
  output: 'var z = 1\nvar x = "valid"'
}

const shouldReplaceSeveralRegex = {
  code: 'var x = "invalid"\nvar z = 1',
  filename: 'some.js',
  options: [
    [{
      regex: 'invalid',
      replacement: 'valid'
    }, {
      regex: 'var',
      replacement: 'const'
    }]
  ],
  errors: [{
    message: 'Invalid regular expression /var/gm found',
    line: 1,
    column: 1
  }, {
    message: 'Invalid regular expression /invalid/gm found',
    line: 1,
    column: 10
  }, {
    message: 'Invalid regular expression /var/gm found',
    line: 2,
    column: 1
  }],
  output: 'const x = "valid"\nconst z = 1'
}

const shouldReplaceWithFunction = {
  code: 'var z = 1\nvar x = "invalid"',
  filename: 'some.js',
  options: [
    [{
      regex: 'invalid',
      replacement: {
        function: 'return "valid"'
      }
    }]
  ],
  errors: [{
    message: 'Invalid regular expression /invalid/gm found',
    line: 2,
    column: 10
  }],
  output: 'var z = 1\nvar x = "valid"'
}

const shouldReplaceWithFunctionWithSomeProcessing = {
  code: 'var z = 1\nvar x = "invalid"',
  filename: 'some.js',
  options: [
    [{
      regex: 'invalid',
      replacement: {
        function: 'const result = text + "-"; return result'
      }
    }]
  ],
  errors: [{
    message: 'Invalid regular expression /invalid/gm found',
    line: 2,
    column: 10
  }],
  output: 'var z = 1\nvar x = "invalid-"'
}

const shouldReplaceWithoutReturnFunction = {
  code: 'var z = 1\nvar x = "invalid"',
  filename: 'some.js',
  options: [
    [{
      regex: 'invalid',
      replacement: {
        function: 'text !== "text" ? "valid" : new Date()'
      }
    }]
  ],
  errors: [{
    message: 'Invalid regular expression /invalid/gm found',
    line: 2,
    column: 10
  }],
  output: 'var z = 1\nvar x = "valid"'
}

const shouldReplaceWithoutReturnFunctionAndReturnPresent = {
  code: 'var z = 1\nvar x = "invalid"',
  filename: 'some.js',
  options: [
    [{
      regex: 'invalid',
      replacement: {
        function: 'text === "Return" ? "invalid" : "valid"'
      }
    }]
  ],
  errors: [{
    message: 'Invalid regular expression /invalid/gm found',
    line: 2,
    column: 10
  }],
  output: 'var z = 1\nvar x = "valid"'
}

const shouldNotReplaceWithInvalidFunctionCase01 = {
  code: 'var z = 1\nvar x = "invalid"',
  filename: 'some.js',
  options: [
    [{
      regex: 'invalid',
      replacement: {
        function: 'return valid'
      }
    }]
  ],
  errors: [{
    message: 'Invalid regular expression /invalid/gm found',
    line: 2,
    column: 10
  }],
  output: 'var z = 1\nvar x = "invalid"'
}

const shouldNotReplaceWithInvalidFunctionCase02 = {
  code: 'var z = 1\nvar x = "invalid"',
  filename: 'some.js',
  options: [
    [{
      regex: 'invalid',
      replacement: {
        function: 'throw new Exception("valid"); return "valid"'
      }
    }]
  ],
  errors: [{
    message: 'Invalid regular expression /invalid/gm found',
    line: 2,
    column: 10
  }],
  output: 'var z = 1\nvar x = "invalid"'
}

const shouldNotReplaceWithInvalidFunctionCase03 = {
  code: 'var z = 1\nvar x = "invalid"',
  filename: 'some.js',
  options: [
    [{
      regex: 'invalid',
      replacement: {
        function: 'if text === "text") return "valid"'
      }
    }]
  ],
  errors: [{
    message: 'Invalid regular expression /invalid/gm found',
    line: 2,
    column: 10
  }],
  output: 'var z = 1\nvar x = "invalid"'
}

const shouldNotReplaceWithInvalidFunctionCase04 = {
  code: 'var z = 1\nvar x = "invalid"',
  filename: 'some.js',
  options: [
    [{
      regex: 'invalid',
      replacement: {
        function: 'if (text === "text") return "valid"; else throw new Exception("valid")'
      }
    }]
  ],
  errors: [{
    message: 'Invalid regular expression /invalid/gm found',
    line: 2,
    column: 10
  }],
  output: 'var z = 1\nvar x = "invalid"'
}

const shouldNotReplaceWithInvalidFunctionCase05 = {
  code: 'var z = 1\nvar x = "invalid"',
  filename: 'some.js',
  options: [
    [{
      regex: 'invalid',
      replacement: {
        function: 'return text === "text" ? "valid" : new Date()'
      }
    }]
  ],
  errors: [{
    message: 'Invalid regular expression /invalid/gm found',
    line: 2,
    column: 10
  }],
  output: 'var z = 1\nvar x = "invalid"'
}

const shouldNotReplaceWithInvalidFunctionCase06 = {
  code: 'var z = 1\nvar x = "invalid"',
  filename: 'some.js',
  options: [
    [{
      regex: 'invalid',
      replacement: {
        function: 'text === "text" ? "valid" : new Date()'
      }
    }]
  ],
  errors: [{
    message: 'Invalid regular expression /invalid/gm found',
    line: 2,
    column: 10
  }],
  output: 'var z = 1\nvar x = "invalid"'
}

const shouldNotReplaceWithInvalidFunctionCase07 = {
  code: 'var z = 1\nvar x = "invalid"',
  filename: 'some.js',
  options: [
    [{
      regex: 'invalid',
      replacement: {
        function: 'return 2021'
      }
    }]
  ],
  errors: [{
    message: 'Invalid regular expression /invalid/gm found',
    line: 2,
    column: 10
  }],
  output: 'var z = 1\nvar x = "invalid"'
}

const shouldNotReplaceWithInvalidFunctionCase08InvalidReturnDetected = {
  code: 'var z = 1\nvar x = "invalid"',
  filename: 'some.js',
  options: [
    [{
      regex: 'invalid',
      replacement: {
        function: 'text === "return" ? "valid" : "no"'
      }
    }]
  ],
  errors: [{
    message: 'Invalid regular expression /invalid/gm found',
    line: 2,
    column: 10
  }],
  output: 'var z = 1\nvar x = "invalid"'
}

const shouldNotReplaceWithInvalidFunctionCase09NoStringFunction = {
  code: 'var z = 1\nvar x = "invalid"',
  filename: 'some.js',
  options: [
    [{
      regex: 'invalid',
      replacement: {
        function: 2
      }
    }]
  ],
  errors: [{
    message: 'Invalid regular expression /invalid/gm found',
    line: 2,
    column: 10
  }]
}

const shouldReplaceWithCapturingGroupsWithoutCaptured = {
  code: 'var z = 1\nvar x = "invalid"',
  filename: 'some.js',
  options: [
    [{
      regex: 'inval(\\w+)',
      replacement: 'valid'
    }]
  ],
  errors: [{
    message: 'Invalid regular expression /inval(\\w+)/gm found',
    line: 2,
    column: 10
  }],
  output: 'var z = 1\nvar x = "valid"'
}

const shouldReplaceWithFunctionWithCaptured = {
  code: 'var z = 1\nvar x = "invalid"',
  filename: 'some.js',
  options: [
    [{
      regex: 'inval(\\w*)',
      message: 'don`t use inval',
      replacement: {
        function: 'return captured[0]'
      }
    }]
  ],
  errors: [{
    message: 'don`t use inval',
    line: 2,
    column: 10
  }],
  output: 'var z = 1\nvar x = "id"'
}

const shouldReplaceWithFunctionWithCapturedWithLog = {
  code: 'var z = 1\nvar x = "invalid"',
  filename: 'some.js',
  options: [
    [{
      regex: 'inval(\\w*)',
      message: 'don`t use inval',
      replacement: {
        /**
         * This will generate a output to the console when testing
         */
        function: 'console.log(text); console.log(captured[0]); return captured[0]'
      }
    }]
  ],
  errors: [{
    message: 'don`t use inval',
    line: 2,
    column: 10
  }],
  output: 'var z = 1\nvar x = "id"'
}

const shouldReplaceWithFunctionWith$Text = {
  code: 'var z = 1\nvar x = "invalid"',
  filename: 'some.js',
  options: [
    [{
      regex: 'invalid',
      replacement: {
        function: 'const result = $[0] + "-"; return result'
      }
    }]
  ],
  errors: [{
    message: 'Invalid regular expression /invalid/gm found',
    line: 2,
    column: 10
  }],
  output: 'var z = 1\nvar x = "invalid-"'
}

const shouldReplaceWithFunctionWith$TextWithoutReturn = {
  code: 'var z = 1\nvar x = "invalid"',
  filename: 'some.js',
  options: [
    [{
      regex: 'invalid',
      replacement: {
        function: '`${$[0]}-`'
      }
    }]
  ],
  errors: [{
    message: 'Invalid regular expression /invalid/gm found',
    line: 2,
    column: 10
  }],
  output: 'var z = 1\nvar x = "invalid-"'
}

const shouldReplaceWithFunctionWith$Captured = {
  code: 'var z = 1\nvar x = "invalid"',
  filename: 'some.js',
  options: [
    [{
      regex: 'inval(\\w*)',
      message: 'don`t use inval',
      replacement: {
        function: 'return $[1]'
      }
    }]
  ],
  errors: [{
    message: 'don`t use inval',
    line: 2,
    column: 10
  }],
  output: 'var z = 1\nvar x = "id"'
}

const shouldReplaceWithFunctionWith$CapturedWithoutReturnUsingCommaOperator = {
  code: 'var z = 1\nvar x = "invalid"',
  filename: 'some.js',
  options: [
    [{
      regex: 'inval(\\w*)',
      message: 'don`t use inval',
      replacement: {
        function: 'result = $[1] === "id" ? "di" : $[1], result'
      }
    }]
  ],
  errors: [{
    message: 'don`t use inval',
    line: 2,
    column: 10
  }],
  output: 'var z = 1\nvar x = "di"'
}

ruleTester.run(
  'invalid',
  invalidRegexRule, {
    valid: [
      shouldNotFind,
      shouldNotFindWithoutFlags,
      shouldNotFindWithoutFlags2,
      shouldIgnoreFile,
      shouldNotInspectFile,
      shouldHandleBothIgnoreInspectFile
    ],
    invalid: [
      shouldFind,
      shouldFindWithFlag,
      shouldFindWithFlag2,
      shouldFindWithMultipleFlags,
      shouldFindWithDuplicatedFlags,
      shouldFindWithDuplicatedFlags2,
      shouldFindWithUppercaseFlag,
      shouldFindWithAlternatePathsNextLineCounterOverflow,
      shouldFindWithId,
      shouldFindWithMessage,
      shouldFindSame,
      shouldFindMultiline,
      shouldFindSameMultiline,
      shouldFindAcrossLines,
      shouldFindAcrossLinesWithFlag,
      shouldFindAcrossMultiline,
      shouldReplace,
      shouldReplaceSeveralRegex,
      shouldReplaceWithFunction,
      shouldReplaceWithFunctionWithSomeProcessing,
      shouldReplaceWithoutReturnFunction,
      shouldReplaceWithoutReturnFunctionAndReturnPresent,
      shouldNotReplaceWithInvalidFunctionCase01,
      shouldNotReplaceWithInvalidFunctionCase02,
      shouldNotReplaceWithInvalidFunctionCase03,
      shouldNotReplaceWithInvalidFunctionCase04,
      shouldNotReplaceWithInvalidFunctionCase05,
      shouldNotReplaceWithInvalidFunctionCase06,
      shouldNotReplaceWithInvalidFunctionCase07,
      shouldNotReplaceWithInvalidFunctionCase08InvalidReturnDetected,
      shouldReplaceWithCapturingGroupsWithoutCaptured,
      shouldReplaceWithFunctionWithCaptured,
      shouldReplaceWithFunctionWithCapturedWithLog,
      shouldReplaceWithFunctionWith$Text,
      shouldReplaceWithFunctionWith$TextWithoutReturn,
      shouldReplaceWithFunctionWith$Captured,
      shouldReplaceWithFunctionWith$CapturedWithoutReturnUsingCommaOperator
    ]
  }
)

try {
  ruleTester.run(
    'invalid-schema',
    invalidRegexRule, {
      valid: [
        shouldNotFind
      ],
      invalid: [
        shouldNotReplaceWithInvalidFunctionCase09NoStringFunction
      ]
    }
  )
  throw 'non valid schema'
}
catch(error) {
  if(error.toString().indexOf('Value {"function":2} should be string') === -1) {
    throw 'non valid schema for replacement.function'
  }
}

try {
  ruleTester.run(
    'invalid-schema',
    invalidRegexRule, {
      valid: [
        shouldNotFindWithInvalidFlags
      ],
      invalid: [
        shouldFind
      ]
    }
  )
  throw 'non valid schema'
}
catch(error) {
  if(error.toString().indexOf('Value "ER" should match pattern "^[isuISU]{1,3}$"') === -1) {
    throw 'non valid schema for flags'
  }
}

try {
  ruleTester.run(
    'invalid-schema',
    invalidRegexRule, {
      valid: [
        shouldNotFindWithInvalidFlagsTooMany
      ],
      invalid: [
        shouldFind
      ]
    }
  )
  throw 'non valid schema'
}
catch(error) {
  if(error.toString().indexOf('Value "IsuI" should match pattern "^[isuISU]{1,3}$"') === -1) {
    throw 'non valid schema for flags'
  }
}

try {
  ruleTester.run(
    'invalid-schema',
    invalidRegexRule, {
      valid: [
        shouldNotFindWithInvalidFlagsMixedWithValid
      ],
      invalid: [
        shouldFind
      ]
    }
  )
  throw 'non valid schema'
}
catch(error) {
  if(error.toString().indexOf('Value "Es" should match pattern "^[isuISU]{1,3}$"') === -1) {
    throw 'non valid schema for flags'
  }
}
