//  Copyright (c) 2020-present Gonzalo Müller Bravo.
//  Licensed under the MIT License (MIT), see LICENSE.txt
const { fromOptions } = require('../utils/options-utils.js')

module.exports.buildCreateFunction = (checkPatterns) =>
  (context) => {
    const options = fromOptions(context.options)
    return {
      Program: function (node) {
        const fileName = typeof context.filename === 'string' ? context.filename : context.getFilename()
        if (!options.ignoreFilePattern.test(fileName))
          checkPatterns(fileName, (context.sourceCode || context.getSourceCode()).getText(), options.patterns, context.report, node)
      }
    }
  }
