//  Copyright (c) 2020 Gonzalo Müller Bravo.
//  Licensed under the MIT License (MIT), see LICENSE.txt

const optionsUtils = require('../utils/options-utils.js')

function checkPatterns(source, patterns, report, node) {
  patterns.some(pattern => {
    if (!pattern.regex.test(source)) {
      report({
        node,
        message: 'Required regular expression /' + pattern.source + '/gm not found in file'
      })
    }
  })
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: '..',
      category: 'Stylistic Issues',
    },
    schema: [{
      title: 'Required regular expressions',
      description: 'Required regular expressions to be looked',
      type: 'array',
      items: {
        type: 'string'
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
