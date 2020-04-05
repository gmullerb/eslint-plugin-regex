//  Copyright (c) 2020 Gonzalo Müller Bravo.
//  Licensed under the MIT License (MIT), see LICENSE.txt
const { buildCreateFunction } = require('../utils/create-utils.js')
const { formatReportMessage } = require('../utils/report-utils.js')
const { shouldCheck } = require('../utils/check-utils.js')

function checkRegexInLines(sourceLines, nextLine, nextChar, regex) {
  if (nextLine !== -1) {
    regex.test('')
    let foundDetail = regex.exec(sourceLines[nextLine].slice(nextChar))
    if (foundDetail) {
      return {
        foundColumn: nextChar + foundDetail.index,
        nextLine,
        nextChar: nextChar + regex.lastIndex
      }
    }
    nextLine = sourceLines.findIndex((lin, index) => index > nextLine && (foundDetail = regex.exec(lin)))
    if (foundDetail) {
      return {
        foundColumn: foundDetail.index,
        nextLine,
        nextChar: regex.lastIndex
      }
    }
  }
  return {
    foundColumn: -1,
    nextLine: -1,
    nextChar: -1
  }
}

function checkRegex(source, sourceLines, nextLine, nextChar, pattern, report, node) {
  if (source.length !== 0) {
    const patternIndex = source.search(pattern.regex)
    if (patternIndex !== -1) {
      const remainingSource = source.slice(patternIndex + 1)
      let foundDetail = checkRegexInLines(sourceLines, nextLine, nextChar, pattern.regex)
      if (foundDetail.nextLine !== -1) {
        report({
          loc: {
            start: {
              line: foundDetail.nextLine + 1,
              column: foundDetail.foundColumn
            }
          },
          message: formatReportMessage(
            pattern,
            from => `Invalid regular expression ${from} found`
          )
        })
        checkRegex(remainingSource, sourceLines, foundDetail.nextLine, foundDetail.nextChar, pattern, report, node)
      }
      else {
        report({
          node,
          message: formatReportMessage(
            pattern,
            from => `Invalid regular expression ${from} found in file`
          )
        })
        checkRegex(remainingSource, sourceLines, nextLine, nextChar, pattern, report, node)
      }
    }
  }
}

function checkPatterns(fileName, source, patterns, report, node) {
  const sourceLines = source.split('\n')
  patterns.forEach(pattern => shouldCheck(pattern.details, fileName) && checkRegex(
    source,
    sourceLines,
    0,
    0,
    pattern,
    report,
    node
  ))
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Invalid regular expressions to be reported',
      category: 'Stylistic Issues',
    },
    schema: [{
      title: 'Invalid regular expressions',
      description: 'Invalid regular expressions settings',
      type: 'array',
      items: {
        oneOf: [{
          title: 'Invalid pattern',
          description: 'Invalid pattern to be reported',
          type: 'string',
          minLength: 1
        }, {
          title: 'Invalid detailed pattern',
          description: 'Invalid pattern to be looked with possible custom message, custom ignored file pattern and custom inspect file pattern',
          type: 'object',
          properties: {
            id: {
              title: 'Invalid pattern Id',
              description: 'Invalid pattern Id to be reported',
              type: 'string',
              minLength: 2
            },
            regex: {
              title: 'Invalid pattern',
              description: 'Invalid regular expression to look for',
              type: 'string',
              minLength: 1
            },
            message: {
              title: 'Invalid message',
              description: 'Message to be shown when Invalid pattern is found',
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
      type: 'string',
      minLength: 2
    }]
  },
  create: buildCreateFunction(checkPatterns)
}
