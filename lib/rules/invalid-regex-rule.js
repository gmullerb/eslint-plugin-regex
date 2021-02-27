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

function checkRegexInSource(source, regex) {
  regex.test('')
  const foundDetail = regex.exec(source)
  return !!foundDetail
    ? {
        $: foundDetail,
        patternIndex: foundDetail.index,
        nextChar: regex.lastIndex
      }
    : {
        patternIndex: -1,
        nextChar: -1
      }
}

function foundStart(source, nextLine, foundAt) {
  return Array.from(source.substring(0, foundAt))
    .reduce((result, char) => char === '\n'
      ? { line: result.line + 1, column: 0 }
      : { line: result.line, column: result.column + 1 },
    { line: nextLine, column: 0 })
}

function checkRegex(source, sourceLines, nextLine, nextChar, rootChar, pattern, replace, report) {
  if (source.length !== 0) {
    const sourceDetail = checkRegexInSource(source, pattern.regex)
    if (sourceDetail.patternIndex !== -1) {
      const remainingSourceStart = sourceDetail.patternIndex + 1
      const remainingSource = source.slice(remainingSourceStart)
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
          ),
          fix: replace(rootChar, sourceDetail)
        })
        checkRegex(remainingSource, sourceLines, foundDetail.nextLine, foundDetail.nextChar, rootChar + remainingSourceStart,
          pattern, replace, report)
      }
      else {
        report({
          loc: { start: foundStart(source, nextLine + 1, sourceDetail.patternIndex) },
          message: formatReportMessage(
            pattern,
            from => `Invalid regular expression ${from} found`
          ),
          fix: replace(rootChar, sourceDetail)
        })
        checkRegex(remainingSource, sourceLines, nextLine + 1, nextChar, rootChar + remainingSourceStart, pattern, replace, report)
      }
    }
  }
}

function buildReplacementFunction(replacement) {
  if (/\breturn\b/.test(replacement)) {
    try {
      const replacementFunction = new Function('text', 'captured', '$', replacement) // eslint-disable-line no-new-func
      return $ => {
        try {
          const replacement = replacementFunction($[0], $.slice(1), $)
          if (typeof replacement === 'string') {
            return replacement
          }
        }
        catch(e) {}
        return $[0]
      }
    }
    catch(e) {}
  }
  return null
}

function createReplacement(replacement) {
  switch (typeof replacement) {
    case 'string':
      return (from, found) => fixer => fixer.replaceTextRange([from + found.patternIndex, from + found.nextChar], replacement)
    case 'object':
      if (typeof replacement.function === 'string') {
        const replacementFunction = buildReplacementFunction(replacement.function)
        if (typeof replacementFunction === 'function') {
          return (from, found) =>
            fixer => fixer.replaceTextRange(
              [from + found.patternIndex, from + found.nextChar],
              replacementFunction(found.$)
            )
        }
      }
  }
  return () => undefined
}

function checkPatterns(fileName, source, patterns, report) {
  const sourceLines = source.split('\n')
  patterns.forEach(pattern => shouldCheck(pattern.details, fileName) && checkRegex(
    source,
    sourceLines,
    0,
    0,
    0,
    pattern,
    createReplacement(pattern.details.replacement),
    report
  ))
}

module.exports = {
  meta: {
    type: 'suggestion',
    fixable: 'code',
    docs: {
      description: 'Invalid regular expressions to be reported',
      category: 'Stylistic Issues',
      url: 'https://github.com/gmullerb/eslint-plugin-regex/blob/master/docs/rules/invalid-regex-rule.md'
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
            replacement: {
              oneOf:[{
                title: 'Replacement',
                description: 'Replacement for invalid pattern',
                type: 'string'
              }, {
                title: 'Detailed replacement',
                description: 'Detailed replacements for invalid patterns',
                type: 'object',
                properties: {
                  function: {
                    title: 'Replacement function',
                    description: 'Function used to replace the found pattern. It receives the found text and must return the replacement text',
                    type: 'string',
                    minLength: 1
                  }
                },
                minProperties: 1,
                maxProperties: 1
              }]
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
