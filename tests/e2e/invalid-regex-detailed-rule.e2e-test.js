//  Copyright (c) 2026-present Gonzalo Müller Bravo.
//  Licensed under the MIT License (MIT), see LICENSE.txt
const { describe, it } = require('node:test')
const expect = require('node:assert/strict')
const RuleTester = require('eslint').RuleTester

const invalidRegexRule = require('../../lib/rules/invalid-regex-rule')

const shouldNotFind = {
  name: 'should not find invalid pattern in valid code',
  code: 'var z = 1\nvar x = "valid"',
  filename: 'some.js',
  options: [
    [{
      regex: 'invalid'
    }]
  ]
}

const shouldNotFindWithoutFlags = {
  name: 'should not find invalid pattern without flags',
  code: 'var z = 1\nvar x = "inValid"',
  filename: 'some.js',
  options: [
    [{
      regex: 'invalid'
    }]
  ]
}

const shouldNotFindWithInvalidFlags = {
  name: 'should not validate with invalid flags',
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
  name: 'should not validate with too many flags',
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
  name: 'should not validate with flags mixed with valid ones',
  code: 'var z = 1\nvar x = "invalid"',
  filename: 'some.js',
  options: [
    [{
      regex: '1.var',
      flags: 'Es'
    }]
  ],
}

const shouldNotFindWithoutFlags2 = {
  name: 'should not find wildcard pattern without flags',
  code: 'var z = 1\nvar x = "inValid"',
  filename: 'some.js',
  options: [
    [{
      regex: '1.var'
    }]
  ]
}

const shouldIgnoreFile = {
  name: 'should ignore files matching the files ignore pattern',
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
  name: 'should not inspect files not matching the inspect pattern',
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
  name: 'should handle files matching both ignore and inspect patterns',
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
  name: 'should find invalid pattern',
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
  name: 'should find invalid pattern with case insensitive flag',
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
  name: 'should find wildcard pattern with dot all flag',
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
  name: 'should find invalid pattern with multiple flags',
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
  name: 'should find invalid pattern with duplicated flags',
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
  name: 'should find invalid pattern with duplicated flags in other order',
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
  name: 'should find invalid pattern with alternate paths and line counter overflow',
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
  name: 'should find invalid pattern with uppercase flag',
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
  name: 'should find invalid pattern reporting its id',
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
  name: 'should find invalid pattern reporting custom message',
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
  name: 'should find same invalid pattern more than once on the same line',
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
  name: 'should find invalid pattern in multiple lines',
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
  name: 'should find same invalid pattern more than once in multiple lines',
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
  name: 'should find invalid pattern across lines',
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
  name: 'should find invalid pattern across lines with dot all flag',
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
  name: 'should find invalid pattern across multiple lines',
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
  name: 'should replace invalid pattern with replacement text',
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
  name: 'should replace multiple invalid patterns',
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
  name: 'should replace invalid pattern using replacement function',
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
  name: 'should replace invalid pattern using replacement function with processing',
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
  name: 'should replace invalid pattern using expression replacement',
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
  name: 'should replace invalid pattern using expression that contains the word return',
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
  name: 'should not replace with invalid function returning undefined variable',
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
}

const shouldNotReplaceWithInvalidFunctionCase02 = {
  name: 'should not replace with invalid function throwing an exception',
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
}

const shouldNotReplaceWithInvalidFunctionCase03 = {
  name: 'should not replace with invalid function with syntax error',
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
}

const shouldNotReplaceWithInvalidFunctionCase04 = {
  name: 'should not replace with invalid function throwing exception in conditional',
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
}

const shouldNotReplaceWithInvalidFunctionCase05 = {
  name: 'should not replace with invalid function returning non string result',
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
}

const shouldNotReplaceWithInvalidFunctionCase06 = {
  name: 'should not replace with invalid expression returning non string result',
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
}

const shouldNotReplaceWithInvalidFunctionCase07 = {
  name: 'should not replace with invalid function returning a number',
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
}

const shouldNotReplaceWithInvalidFunctionCase08InvalidReturnDetected = {
  name: 'should not replace when return statement is detected in expression',
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
}

const shouldNotReplaceWithInvalidFunctionCase09NoStringFunction = {
  name: 'should not validate when replacement function is not a string',
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
  name: 'should replace invalid pattern with capturing groups but no captured values',
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
  name: 'should replace invalid pattern using function with captured values',
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
  name: 'should replace invalid pattern using function with captured values and logging',
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
  name: 'should replace invalid pattern using function with dollar match',
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
  name: 'should replace invalid pattern using expression with dollar match',
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
  name: 'should replace invalid pattern using function with dollar captured values',
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
  name: 'should replace invalid pattern using comma operator expression with dollar captured values',
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


describe('Invalid Regex Rule - Detailed definition', () => {
  const ruleTester = new RuleTester({ languageOptions: { ecmaVersion: 2019 }})

  RuleTester.describe = describe
  RuleTester.it = it

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
})

describe('Invalid Regex Rule - Invalid detailed definition', () => {
  const ruleTester = new RuleTester({ languageOptions: { ecmaVersion: 2019 }})

  RuleTester.describe = null
  RuleTester.it = null

  const expectSchemaError = (name, expectedMessage, { validCase, invalidCase }) => {
    it(name, () => {
      expect.throws(
        () => {
          ruleTester.run('invalid-schema', invalidRegexRule, {
            valid: validCase ? [validCase] : [ shouldNotFind ],
            invalid: invalidCase ? [invalidCase] : [shouldFind],
          })
        },
        (error) => {
          expect.match(error.message, expectedMessage)
          return true
        }
      )
    })
  }

  expectSchemaError(
    'should reject replacement.function not containing a string',
    /Value \{"function":2\} should be string/,
    { invalidCase: shouldNotReplaceWithInvalidFunctionCase09NoStringFunction }
  )

  expectSchemaError(
    'should reject invalid flags in schema',
    /Value "ER" should match pattern "\^\[isuISU\]\{1,3\}\$"/,
    { validCase: shouldNotFindWithInvalidFlags }
  )

  expectSchemaError(
    'should reject flags longer than three characters',
    /Value "IsuI" should match pattern "\^\[isuISU\]\{1,3\}\$"/,
    { validCase: shouldNotFindWithInvalidFlagsTooMany }
  )

  expectSchemaError(
    'should reject flags containing invalid characters',
    /Value "Es" should match pattern "\^\[isuISU\]\{1,3\}\$"/,
    { validCase: shouldNotFindWithInvalidFlagsMixedWithValid }
  )
})

