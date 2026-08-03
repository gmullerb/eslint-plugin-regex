// Copyright (c) 2026-present Gonzalo Müller Bravo.
// Licensed under the MIT License (MIT), see LICENSE.txt
const expect = require('node:assert')

const { describe, it } = require('node:test')

const { REGEX_FLAGS_FIELD_DEFINITION, FILES_FIELD_DEFINITION } = require('../../../lib/rules/common-fields-definitions.js')

describe('common-fields-definitions tests', () => {
  it('should define the regex flags field', () => {
    // Arrange
    const flagsField = REGEX_FLAGS_FIELD_DEFINITION

    // Act
    const result = {
      title: flagsField.title,
      description: flagsField.description,
      type: flagsField.type,
      pattern: flagsField.pattern
    }

    // Assert
    expect.deepEqual(result, {
      title: 'Regular expression allowed flags',
      description: 'A combination of "i", "s" and "u" regular expression flags',
      type: 'string',
      pattern: '^[isuISU]{1,3}$'
    })
  })

  it('should define the files field', () => {
    // Arrange
    const filesField = FILES_FIELD_DEFINITION

    // Act
    const result = {
      type: filesField.type,
      ignore: filesField.properties.ignore,
      inspect: filesField.properties.inspect,
      minProperties: filesField.minProperties,
      maxProperties: filesField.maxProperties
    }

    // Assert
    expect.deepEqual(result, {
      type: 'object',
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
      },
      minProperties: 1,
      maxProperties: 2
    })
  })
})
