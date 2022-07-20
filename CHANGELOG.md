# ESLint Plugin Regex Change Log

## 1.10.0 - August 2022

* Closes #19, Allows to add additional RegEx flags.
* Fixes bug `RangeError: Maximum call stack size exceeded`.
  * Replaces the recursive approach to a loop one.
* Improves code.
  * Clones `$`.
  * Simplifies code.
    * Improves code performance.
    * Improves code coverage.
  * Adds JSDoc to improve Learnability and Maintainability.
* Improves project configuration.
  * Renames `readme` folder to `.readme` in order to prevent it to be packed.
  * Removes `.npmignore` (It doesn't work when using `files`: https://github.com/npm/npm/issues/4479)
  * Updates CI configuration.
* Updates Documentation.

## 1.9.1 - July 2022

* Fixes duplicate entries bug that happens when adding custom regex rule with same name.
  * Message changed from `Error: "SomeRuleName" can not be used as eslint-plugin-regex rule name` to `Error: "SomeRuleName" already defined as eslint-plugin-regex rule name`.
* Updates documentation.
  * Changes background color to white for images.

## 1.9.0 - April 2022

* Closes #15, Allowing mixing different error level.
  * This bug required that the same rule can be defined with different error levels, that is not possible at the moment on eslint. Error level is not available at plugin level (as indicate by ESLint official documentation: "Keep in mind that the error level is not part of context.options, as the error level cannot be known or modified from inside a rule"). So I came up a different approach, which not only **allows to use "the same" rule with different error levels**, but also **allows Mixing custom set of regex rules**, this is useful for creating package/libraries/plugins with your own set of rules and sharing it with others.
* Fixes #16, Unable to use both "ignore" and "inspect" inside "files" property.
* Fixes an issue with remaining source calculation and minified files.
* Removes `replacement.function === 'string'` validation, it's not necessary, eslint already validates json.
* Improves project configuration.
  * Now uses [`any-eslint-parser`](https://www.npmjs.com/package/any-eslint-parser)
* Improves documentation.
  * Mixing
* Fixes spelling in tests.

## 1.8.0 - August 2021

* Closes #11, Improves the specification of the number of the line of the found error for the final report, Thanks to Maxim-Mazurok for His collaboration.

## 1.7.0 - February 2021

* Closes #6, Removes the requirement of `return` presence for replacement functions for invalid patterns.

## 1.6.0 - February 2021

* Adds additional parameter `$` to replacement function for invalid patterns in order to allow smaller definitions.

## 1.5.0 - February 2021

* Adds capturing groups to replacement functions for invalid patterns.

## 1.4.0 - February 2021

* Adds replacements with functions for invalid patterns.

## 1.3.0 - January 2021

* Adds replacements for invalid patterns.
* Improves code coverage.
* Improves documentation.
* Improves project configuration.

## 1.2.1 - August 2020

* Fixes #4 peerDependencies.
* Updates README file.

## 1.2.0 - August 2020

* Adds the specific line to the report for multiline regex (Big debt, Found some time, Done, Yes!).
* Updates README file.

## 1.1.0 - April 2020

* Adds handling for detailed patterns.
* Updates README file.
* Improves project configuration.
