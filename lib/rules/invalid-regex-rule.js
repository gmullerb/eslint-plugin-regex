//  Copyright (c) 2020 Gonzalo Müller Bravo.
//  Licensed under the MIT License (MIT), see LICENSE.txt

const optionsUtils = require('../utils/options-utils.js')

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

function checkRegex(source, sourceLines, nextLine, nextChar, regex, report, regexSource, node) {
  if (source.length !== 0) {
    const patternIndex = source.search(regex)
    if (patternIndex !== -1) {
      const remainingSource = source.slice(patternIndex + 1)
      let foundDetail = checkRegexInLines(sourceLines, nextLine, nextChar, regex)
      if (foundDetail.nextLine !== -1) {
        report({
          loc: {
            start: {
              line: foundDetail.nextLine + 1,
              column: foundDetail.foundColumn
            }
          },
          message: 'Invalid regular expression /' + regexSource + '/gm found',
        })
        checkRegex(remainingSource, sourceLines, foundDetail.nextLine, foundDetail.nextChar, regex, report, regexSource, node)
      }
      else {
        report({
          node,
          message: 'Invalid regular expression /' + regexSource + '/gm found in file',
        })
        checkRegex(remainingSource, sourceLines, nextLine, nextChar, regex, report, regexSource, node)
      }
    }
  }
}

function checkPatterns(source, patterns, report, node) {
  const sourceLines = source.split('\n')
  patterns.some(pattern => checkRegex(
    source,
    sourceLines,
    0,
    0,
    pattern.regex,
    report,
    pattern.source,
    node
  ))
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: '..',
      category: 'Stylistic Issues',
    },
    schema: [{
      title: 'Invalid regular expressions',
      description: 'Invalid regular expressions to be reported',
      type: 'array',
      items: {
        type: 'string',
        minLength: 1
      },
      minItems: 1
    }, {
      title: 'Ignore file pattern',
      description: 'Pattern',
      type: 'string'
    }]
  },
  create: function (context) {
    const options = optionsUtils.fromOptions(context.options)
    return {
      Program: function (node) {
        if (!options.ignoreFilePattern.test(context.getFilename())) {
          checkPatterns(context.getSourceCode(node).getText(), options.patterns, context.report, node)
        }
      }
    }
  }
}
