//  Copyright (c) 2020 Gonzalo Müller Bravo.
//  Licensed under the MIT License (MIT), see LICENSE.txt
const { fromOptions } = require('../utils/options-utils.js')

module.exports.buildCreateFunction = function (checkPatterns) {
  return (context) => {
    const options = fromOptions(context.options)
    return {
      Program: function (node) {
        const fileName = context.getFilename()
        const unfFileName = fileName.replaceAll('\\', '/')
        const fileNames = [fileName, unfFileName]
        if (!(options.ignoreFilePattern.test(fileName) && options.ignoreFilePattern.test(unfFileName))) {
          checkPatterns(fileNames, context.getSourceCode(node).getText(), options.patterns, context.report, node)
        }
      }
    }
  }
}
