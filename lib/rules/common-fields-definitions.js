//  Copyright (c) 2022 Gonzalo Müller Bravo.
//  Licensed under the MIT License (MIT), see LICENSE.txt

module.exports = {
  REGEX_FLAGS_FIELD_DEFINITION: {
    title: 'Regular expression allowed flags',
    description: 'A combination of "i", "s" and "u" regular expression flags',
    type: 'string',
    pattern: '^[isuISU]{1,3}$'
  },
  FILES_FIELD_DEFINITION: {
    type: 'object',
    properties: {
      ignore: {
        title: 'Ignore file pattern',
        description: 'Regular expression of the files to be ignored when validating this specific pattern',
        type: 'string',
        minLength: 2
      },
      inspect: {
        title: 'Inspect file pattern',
        description: 'Regular expression of the files to be inspected when validating this specific pattern',
        type: 'string',
        minLength: 2
      }
    },
    minProperties: 1,
    maxProperties: 2
  }
}
