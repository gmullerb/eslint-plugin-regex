//  Copyright (c) 2020 Gonzalo Müller Bravo.
//  Licensed under the MIT License (MIT), see LICENSE.txt

/**
 * @param {{ regex: RegExp, id: string | undefined, message: string | undefined }} pattern Information of the pattern used to inspect.
 * @param {Function} createMsg This function will create the message for Invalid or Required pattern.
 * @returns {string} Message to report an error.
 */
module.exports.formatReportMessage = function (pattern, createMsg) {
  return !!pattern.details.message
    ? pattern.details.message
    : !!pattern.details.id
        ? createMsg(`'${pattern.details.id}'`)
        : createMsg(`${pattern.regex.toString()}`)
}
