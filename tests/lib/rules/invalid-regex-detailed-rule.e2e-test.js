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
      shouldFoundAcrossMultiline,
      shouldReplace,
      shouldReplaceSeveralRegex,
      shouldReplaceWithFunction,
      shouldReplaceWithFunctionWithSomeProcessing,
      shouldNotReplaceWithInvalidFunctionCase01,
      shouldNotReplaceWithInvalidFunctionCase02,
      shouldNotReplaceWithInvalidFunctionCase03,
      shouldNotReplaceWithInvalidFunctionCase04,
      shouldNotReplaceWithInvalidFunctionCase05,
      shouldNotReplaceWithInvalidFunctionCase06,
      shouldNotReplaceWithInvalidFunctionCase07,
      shouldReplaceWithCapturingGroupsWithoutCaptured,
      shouldReplaceWithFunctionWithCaptured,
      shouldReplaceWithFunctionWithCapturedWithLog
    ]
  }
)
