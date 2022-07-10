//  Copyright (c) 2020 Gonzalo Müller Bravo.
//  Licensed under the MIT License (MIT), see LICENSE.txt
/* eslint-disable global-require */

const rulesNames = ['required', 'use', 'required-warn', 'required-error', 'another-required', 'other-required', 'invalid', 'disuse', 'avoid', 'invalid-warn', 'invalid-error', 'another-invalid', 'other-invalid']

module.exports = {
  addRegexRuleName: (ruleName) => {
    if (/use|avoid|disuse|invalid|required/i.test(ruleName)) {
      const candidate = ruleName.toUpperCase()
      if (rulesNames.findIndex(ruleName => ruleName.toUpperCase() === candidate) !== -1) {
        throw new Error(`"${ruleName}" already defined as eslint-plugin-regex rule name`)
      }
      rulesNames.push(ruleName)
    }
  },
  rules: new Proxy({}, {
    ownKeys: () => rulesNames,
    getOwnPropertyDescriptor: () => ({ configurable: true, enumerable: true }),
    get(rules, ruleName) {
      return /avoid|disuse|invalid/i.test(ruleName)
        ? require('./rules/invalid-regex-rule.js')
        : /use|required/i.test(ruleName)
          ? require('./rules/required-regex-rule.js')
          : undefined
    }
  })
}
