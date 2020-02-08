//  Copyright (c) 2020 Gonzalo Müller Bravo.
//  Licensed under the MIT License (MIT), see LICENSE.txt

module.exports = {
  fromOptions: function (options) {
    return {
      ignoreFilePattern: new RegExp(options[1] || '^$'),
      patterns: options[0].map(regexSource => ({
        source: regexSource,
        regex: new RegExp(regexSource, 'gm')
      }))
    }
  }
}
