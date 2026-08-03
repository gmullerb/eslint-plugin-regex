//  Copyright (c) 2020-present Gonzalo Müller Bravo.
//  Licensed under the MIT License (MIT), see LICENSE.txt

const fitIgnoreFilePattern = (pattern) => new RegExp(pattern || '^$')

/**
 * @typedef {{ ignore: RegExp, inspect: RegExp }} FilesRegex
 */

/**
 * @param {{ ignore: string, inspect: string } | undefined} filesPatterns Information to create Regular Expressions.
 * @returns {FilesRegex | false} Regular Expressions for filtering files.
 */
const filesRegex = (filesPatterns) =>
  !!filesPatterns && {
    ignore: fitIgnoreFilePattern(filesPatterns.ignore),
    inspect: new RegExp(filesPatterns.inspect || '^.*$')
  }

const VALID_FLAGS_REGEX = /[isu]/

/**
 * @param {string | undefined} flagsSource required flags for regex.
 * @returns {string} flags for regex to be used for linting.
 */
const buildRegExpFlags = (flagsSource) => {
  if (!flagsSource)
    return 'gm'
  let flag
  let flags = 'gm'
  const E = flagsSource.length
  for(let e = 0;e !== E;e++)
    if(VALID_FLAGS_REGEX.test(flag = flagsSource.charAt(e).toLowerCase()) && flags.indexOf(flag) === -1)
      flags += flag
  return flags
}

/**
 * @param {string | {regex: string, flags: string}} regexSource source for pattern creation, obtained from rule configuration (e.g. .eslintrc.json).
 * @returns {{regex: RegExp, details: (Object | undefined), files: (FilesRegex | false)}} pattern to be used for linting.
 */
const extractPattern = (regexSource) =>
  typeof regexSource !== 'string'
    ? {
        regex: new RegExp(regexSource.regex, buildRegExpFlags(regexSource.flags)),
        details: regexSource,
        files: filesRegex(regexSource.files)
      }
    : {
        regex: new RegExp(regexSource, 'gm'),
        details: {}
      }

/**
 * @param {*[]} options settings coming from rule configuration (e.g. .eslintrc.json).
 * @returns {Object} internal settings required by eslint-plugin-regex to work properly.
 */
module.exports.fromOptions = (options) => ({
  ignoreFilePattern: fitIgnoreFilePattern(options[1]),
  patterns: options[0].map(extractPattern)
})
