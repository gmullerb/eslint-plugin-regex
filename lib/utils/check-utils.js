//  Copyright (c) 2020 Gonzalo Müller Bravo.
//  Licensed under the MIT License (MIT), see LICENSE.txt

module.exports.shouldCheck = function (details, fileName) {
  return !details.ignore.test(fileName) && details.inspect.test(fileName)
}
