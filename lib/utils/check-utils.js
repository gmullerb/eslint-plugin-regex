//  Copyright (c) 2020 Gonzalo Müller Bravo.
//  Licensed under the MIT License (MIT), see LICENSE.txt

/**
 * @param {{ignore: RegExp, inspect: RegExp} | false} [files] Patterns that indicate which files to inspect and which to ignore.
 * @param {[string, string]} fileNames Name of the file in array, the original path followed by a separator unified path.
 * @returns {boolean} true if the file should be checked.
 */
module.exports.shouldCheck = function (files, fileNames) {
    const [fileName, unfFileName] = fileNames
    return !files ||
        (!(files.ignore.test(fileName) || files.ignore.test(unfFileName)) &&
            (files.inspect.test(fileName) || files.inspect.test(unfFileName)))
}
