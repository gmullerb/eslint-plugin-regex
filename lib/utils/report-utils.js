//  Copyright (c) 2020 Gonzalo Müller Bravo.
//  Licensed under the MIT License (MIT), see LICENSE.txt

module.exports.formatReportMessage = function (pattern, createMsg) {
  return !!pattern.details.message
    ? pattern.details.message
    : !!pattern.details.id
      ? createMsg(`'${pattern.details.id}'`)
      : createMsg(`/${pattern.source}/gm`)
}
