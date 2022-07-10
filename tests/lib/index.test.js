//  Copyright (c) 2022 Gonzalo Müller Bravo.
//  Licensed under the MIT License (MIT), see LICENSE.txt
const { addRegexRuleName, rules } = require('../../lib')
const invalidRegexRule = require('../../lib/rules/invalid-regex-rule.js')
const requiredRegexRule = require('../../lib/rules/required-regex-rule.js')

describe('index tests', () => {
  it('should add invalid regex rule name when valid', () => {
    addRegexRuleName('someInvalid')

    expect(Object.keys(rules).find(rule => rule === 'someInvalid')).toBe('someInvalid')
    expect(rules.someInvalid).toBe(invalidRegexRule)
  })

  it('should add invalid disuse regex rule name when valid', () => {
    addRegexRuleName('some-disuse')

    expect(Object.keys(rules).find(rule => rule === 'some-disuse')).toBe('some-disuse')
    expect(rules['some-disuse']).toBe(invalidRegexRule)
  })

  it('should add invalid avoid regex rule name when valid', () => {
    addRegexRuleName('avoid some')

    expect(Object.keys(rules).find(rule => rule === 'avoid some')).toBe('avoid some')
    expect(rules['avoid some']).toBe(invalidRegexRule)
  })

  it('should add required regex rule name when valid', () => {
    addRegexRuleName('someREQUIRED')

    expect(Object.keys(rules).find(rule => rule === 'someREQUIRED')).toBe('someREQUIRED')
    expect(rules.someREQUIRED).toBe(requiredRegexRule)
  })

  it('should add required use regex rule name when valid', () => {
    addRegexRuleName('someUSE')

    expect(Object.keys(rules).find(rule => rule === 'someUSE')).toBe('someUSE')
    expect(rules.someUSE).toBe(requiredRegexRule)
  })

  it('should not add regex rule name when invalid name', () => {
    addRegexRuleName('some')

    expect(Object.keys(rules).find(rule => rule === 'some')).toBeUndefined()
  })

  describe('invalid rule names', () => {
    const rulesNames = ['required', 'required-warn', 'required-error', 'another-required', 'other-required', 'invalid', 'invalid-warn', 'invalid-error', 'another-invalid', 'other-invalid']

    for(const ruleName of rulesNames) {
      const testRuleName = ruleName.toUpperCase()
      it(`should not add regex rule name when equal to ${ruleName}`, () => {
        try {
          addRegexRuleName(testRuleName)
          fail(`Should not add "${ruleName}" name`)
        }
        catch(error) {
          expect(error.toString()).toBe(`Error: "${testRuleName}" already defined as eslint-plugin-regex rule name`)
        }
      })
    }

    it('should fail adding same rule name more than once', () => {
      addRegexRuleName('Same Required Rule Name')
      try {
        addRegexRuleName('Same Required Rule Name')
        fail('Should not add "Same Required Rule Name" name')
      }
      catch(error) {
        expect(error.toString()).toBe('Error: "Same Required Rule Name" already defined as eslint-plugin-regex rule name')
      }
    })
  })
})
