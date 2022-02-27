//  Copyright (c) 2020 Gonzalo Müller Bravo.
//  Licensed under the MIT License (MIT), see LICENSE.txt
/* eslint-disable global-require */

module.exports = {
  rules: new Proxy({}, {
    get(rules, ruleName) {
      return /invalid.*/.test(ruleName)
        ? require('./rules/invalid-regex-rule.js')
        : /required.*/.test(ruleName)
          ? require('./rules/required-regex-rule.js')
          : undefined
    }
  })
}
