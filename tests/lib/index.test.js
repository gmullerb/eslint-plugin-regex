//  Copyright (c) 2022-present Gonzalo Müller Bravo.
//  Licensed under the MIT License (MIT), see LICENSE.txt
const expect = require('node:assert')

const { describe, it } = require('node:test')

const { addRegexRuleName, rules } = require('../../lib')
const invalidRegexRule = require('../../lib/rules/invalid-regex-rule.js')
const requiredRegexRule = require('../../lib/rules/required-regex-rule.js')

describe('addRegexRuleName tests', () => {
  it('should add invalid regex rule name when valid', () => {
    addRegexRuleName('someInvalid')

    expect.equal(Object.keys(rules).find(rule => rule === 'someInvalid'), 'someInvalid')
    expect.equal(rules.someInvalid, invalidRegexRule)
  })

  it('should add invalid disuse regex rule name when valid', () => {
    addRegexRuleName('some-disuse')

    expect.equal(Object.keys(rules).find(rule => rule === 'some-disuse'), 'some-disuse')
    expect.equal(rules['some-disuse'], invalidRegexRule)
  })

  it('should add invalid avoid regex rule name when valid', () => {
    addRegexRuleName('avoid some')

    expect.equal(Object.keys(rules).find(rule => rule === 'avoid some'), 'avoid some')
    expect.equal(rules['avoid some'], invalidRegexRule)
  })

  it('should add required regex rule name when valid', () => {
    addRegexRuleName('someREQUIRED')

    expect.equal(Object.keys(rules).find(rule => rule === 'someREQUIRED'), 'someREQUIRED')
    expect.equal(rules.someREQUIRED, requiredRegexRule)
  })

  it('should add required use regex rule name when valid', () => {
    addRegexRuleName('someUSE')

    expect.equal(Object.keys(rules).find(rule => rule === 'someUSE'), 'someUSE')
    expect.equal(rules.someUSE, requiredRegexRule)
  })

  it('should not add regex rule name when invalid name', () => {
    addRegexRuleName('some')

    expect.equal(Object.keys(rules).find(rule => rule === 'some'), undefined)
  })

  describe('invalid rule names', () => {
    const rulesNames = ['required', 'required-warn', 'required-error', 'another-required', 'other-required', 'invalid', 'invalid-warn', 'invalid-error', 'another-invalid', 'other-invalid']

    for(const ruleName of rulesNames) {
      const testRuleName = ruleName.toUpperCase()
      it(`should not add regex rule name when equal to ${ruleName}`, () => {
        try {
          addRegexRuleName(testRuleName)
          expect.fail(`Should not add "${ruleName}" name`)
        }
        catch(error) {
          expect.equal(error.toString(), `Error: "${testRuleName}" already defined as eslint-plugin-regex rule name`)
        }
      })
    }

    it('should fail adding same rule name more than once', () => {
      addRegexRuleName('Same Required Rule Name')
      try {
        addRegexRuleName('Same Required Rule Name')
        expect.fail('Should not add "Same Required Rule Name" name')
      }
      catch(error) {
        expect.equal(error.toString(), 'Error: "Same Required Rule Name" already defined as eslint-plugin-regex rule name')
      }
    })
  })
})
