//  Copyright (c) 2020 Gonzalo Müller Bravo.
//  Licensed under the MIT License (MIT), see LICENSE.txt
const { buildCreateFunction } = require('../utils/create-utils.js')
const { formatReportMessage } = require('../utils/report-utils.js')
const { shouldCheck } = require('../utils/check-utils.js')

const { REGEX_FLAGS_FIELD_DEFINITION, FILES_FIELD_DEFINITION } = require('./common-fields-definitions.js')

/**
 * @param {string} source Text that was checked.
 * @param {number} foundAt Start position where the regex was found.
 * @returns {{ line: number, column: number }} Location required to report the error.
 */
function foundStartLocation(source, foundAt) {
  return Array.from(source.substring(0, foundAt))
    .reduce((result, char) => char !== '\n'
      ? { line: result.line, column: result.column + 1 }
      : { line: result.line + 1, column: 0 },
    { line: 1, column: 0 })
}

/**
 * @typedef {{ $: [], matchStart: number, nextChar: number }} MatchDetail
 */

/**
 * @param {string} source Text to inspect
 * @param {{ regex: RegExp, id: string | undefined, message: string | undefined }} pattern Information of the pattern to be use to inspect.
 * @param {*} replace Replacement function
 * @param {Function} report Report function
 */
function checkRegex(source, pattern, replace, report) {
  /**
   * @param {string} source Text to be checked.
   * @param {RegExp} regex Regular Expression use to check.
   * @returns {MatchDetail} Result from the check.
   */
  const checkRegexInSource = () => {
    const foundDetail = pattern.regex.exec(source)
    return !!foundDetail && {
      $: foundDetail,
      matchStart: foundDetail.index,
      nextChar: pattern.regex.lastIndex
    }
  }
  const message = formatReportMessage(
    pattern,
    from => `Invalid regular expression ${from} found`
  )
  pattern.regex.test('')
  let matchDetail = { matchStart: -1 }
  while(matchDetail.matchStart !== matchDetail.nextChar && (matchDetail = checkRegexInSource())) {
    report({
      loc: { start: foundStartLocation(source, matchDetail.matchStart) },
      message,
      fix: replace(0, matchDetail)
    })
  }
}

function buildReplacementFunction(replacement) {
  try {
    const replacementFunction = new Function('text', 'captured', '$', /\breturn\b/.test(replacement) ? replacement : `return ${replacement}`) // eslint-disable-line no-new-func
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
  catch(e) {
    return null
  }
}

/**
 * @callback ReplacementFunction
 * @param {number} from Index of the source where the replacement start
 * @param {MatchDetail} matchDetail Information for replacement
 */

/**
 * @param {string | { function: string } | undefined} replacement Data to create the replacement function.
 * @returns {ReplacementFunction} Replacement function
 */
function createReplacement(replacement) {
  switch (typeof replacement) {
    case 'string':
      return (from, matchDetail) => fixer => fixer.replaceTextRange([from + matchDetail.matchStart, from + matchDetail.nextChar], replacement)
    case 'object':{
      const replacementFunction = buildReplacementFunction(replacement.function)
      if (typeof replacementFunction === 'function') {
        return (from, matchDetail) =>
          fixer => fixer.replaceTextRange(
            [from + matchDetail.matchStart, from + matchDetail.nextChar],
            replacementFunction(Array.from(matchDetail.$))
          )
      }
    }
  }
  return () => undefined
}

function checkPatterns(fileName, source, patterns, report) {
  patterns.forEach(pattern => shouldCheck(pattern.files, fileName) &&
    checkRegex(source, pattern, createReplacement(pattern.details.replacement), report))
}

module.exports = {
  meta: {
    type: 'suggestion',
    fixable: 'code',
    docs: {
      description: 'Invalid regular expressions to be reported',
      category: 'Stylistic Issues',
      url: 'https://eslint-plugin-regex.github.io/docs/rules/invalid-regex-rule.html'
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
            flags: REGEX_FLAGS_FIELD_DEFINITION,
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
            files: FILES_FIELD_DEFINITION
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
