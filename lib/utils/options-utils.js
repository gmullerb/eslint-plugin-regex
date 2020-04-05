//  Copyright (c) 2020 Gonzalo Müller Bravo.
//  Licensed under the MIT License (MIT), see LICENSE.txt

function fitIgnoreFilePattern(pattern) {
  return new RegExp(pattern || '^$')
}

function fitDetails(details) {
  const filesPatterns = details.files || {}
  return Object.assign({}, details, {
    ignore: fitIgnoreFilePattern(filesPatterns.ignore),
    inspect: new RegExp(filesPatterns.inspect || '^.*$')
  })
}

function extractPattern(regexSource) {
  return typeof regexSource !== 'string'
    ? {
      source: regexSource.regex,
      regex: new RegExp(regexSource.regex, 'gm'),
      details: fitDetails(regexSource)
    }
    : {
      source: regexSource,
      regex: new RegExp(regexSource, 'gm'),
      details: fitDetails({})
    }
}

module.exports.fromOptions = function (options) {
  return {
    ignoreFilePattern: fitIgnoreFilePattern(options[1]),
    patterns: options[0].map(extractPattern)
  }
}
