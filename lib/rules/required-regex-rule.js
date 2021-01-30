//  Copyright (c) 2020 Gonzalo Müller Bravo.
//  Licensed under the MIT License (MIT), see LICENSE.txt
const { buildCreateFunction } = require('../utils/create-utils.js')
const { formatReportMessage } = require('../utils/report-utils.js')
const { shouldCheck } = require('../utils/check-utils.js')

function checkPatterns(fileName, source, patterns, report, node) {
  patterns.forEach(pattern => {
    if (shouldCheck(pattern.details, fileName) && !pattern.regex.test(source)) {
      report({
        node,
        message: formatReportMessage(
          pattern,
          from => `Required regular expression ${from} not found in file`
        )
      })
    }
  })
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Required regular expressions to be looked',
      category: 'Stylistic Issues',
      url: 'https://github.com/gmullerb/eslint-plugin-regex/blob/master/docs/rules/required-regex-rule.md'
    },
    schema: [{
      title: 'Required regular expressions',
      description: 'Required regular expressions settings',
      type: 'array',
      items: {
        oneOf: [{
          title: 'Required pattern',
          description: 'Required pattern to be looked',
          type: 'string',
          minLength: 1
        }, {
          title: 'Required detailed pattern',
          description: 'Required pattern to be looked with possible custom message, custom ignored file pattern and custom inspect file pattern',
          type: 'object',
          properties: {
            id: {
              title: 'Invalid pattern Id',
              description: 'Invalid pattern Id to be reported',
              type: 'string',
              minLength: 2
            },
            regex: {
              title: 'Required pattern',
              description: 'Required regular expression to be looked',
              type: 'string',
              minLength: 1
            },
            message: {
              title: 'Required message',
              description: 'Message to be shown when Required pattern is not found',
              type: 'string',
              minLength: 3
            },
            files: {
              type: 'object',
              properties: {
                ignore: {
                  title: 'Ignore file pattern',
                  description: 'Regular expression of the files to be ignored when validating this specific pattern',
                  type: 'string',
                  minLength: 2
                },
                inspect: {
                  title: 'Inspect file pattern',
                  description: 'Regular expression of the files to be inspected when validating this specific pattern',
                  type: 'string',
                  minLength: 2
                }
              },
              minProperties: 1,
              maxProperties: 1
            }
          },
          required: ['regex']
        }]
      },
      minItems: 1
    }, {
      title: 'Ignore file pattern',
      description: 'Regular expressions of the files to be ignored when validating all the defined patterns',
      type: 'string'
    }]
  },
  create: buildCreateFunction(checkPatterns)
}
