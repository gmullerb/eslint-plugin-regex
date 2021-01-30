//  Copyright (c) 2020 Gonzalo Müller Bravo.
//  Licensed under the MIT License (MIT), see LICENSE.txt
/* eslint-disable global-require */

module.exports = {
  rules: {
    invalid: require('./rules/invalid-regex-rule.js'),
    required: require('./rules/required-regex-rule.js')
  }
}
