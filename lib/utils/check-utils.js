//  Copyright (c) 2020 Gonzalo Müller Bravo.
//  Licensed under the MIT License (MIT), see LICENSE.txt

/**
 * @param {{ignore: RegExp, inspect: RegExp} | false} [files] Patterns that indicate which files to inspect and which to ignore.
 * @param {string} fileName Name of the file.
 * @returns {boolean} true if the file should be checked.
 */
module.exports.shouldCheck = function (files, fileName) {
  return !files || (!files.ignore.test(fileName) && files.inspect.test(fileName))
}
