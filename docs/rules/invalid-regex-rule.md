# Looks for Invalid regular expressions to be reported for each file

## Rule Details

This rule looks for **Invalid regular expressions** to be reported for each file.

Example of **incorrect** code for this rule:

```js
/* eslint regex/invalid: ['error', ['"']] */

const text = 'Hello "My Friend"'
```

Example of **correct** code for this rule:

```js
/* eslint regex/invalid: ['error', ['"']] */

const text = 'Hello \'My Friend\''
```

## Options

* **array** of patterns definitions to analyze. [REQUIRED]
  * Each pattern definition can be 'Short' or 'Detailed'.
* a **string** representing the regular expression for ignoring files for all patterns. [OPTIONAL]
  * Slashes (`/`) are not required in the string, e.g. To get the following regex `/.*test\.js/` define the following string `".*test\.js"` when using `.eslintrc.js` or `".*test\\.js"` when using `.eslintrc.json` (backslash needs to de double in a json file).

### Short pattern definition

It is specified by just a regular expression `string`, i.e. `"regex"`

* Slashes (`/`) are not required in the string, e.g. To get the following regex `/\bhttp:/` define the following string `"\bhttp:"` when using `.eslintrc.js` or `"\\bhttp:"` when using `.eslintrc.json` (backslash needs to de double in a json file).

`.eslintrc.json`:

```json
{
  "plugins": [
    "regex"
  ],
  "rules": {
    "regex/invalid": [
      "error", [
        "invalidRegex1",
        "invalidRegexN"
      ],
      ".*test\\.js"
    ]
  }
}
```

### Detailed pattern definition

It is specified by an `object`, with the following fields:

* `regex`: A **required** `string` representing the **Regular expression to look for**.
* `replacement` [1]:
  * An optional `string` used to replace the invalid found pattern, or
  * An optional `object` that establish how the invalid found pattern will be replaced:
    * `function`: used to replace the invalid found pattern.
      * It will receive only 1 parameter with the name `text`.
      * It must return a `string` value, if not, return value will be ignored.
      * Its definition must be only the body of the function.
      * [More Information](#definition-of-the-function-used-to-replace-invalid-found-pattern).
* `id`: An optional `string` representing the **Pattern Id**.
* `message`: An optional `string` specifying the **Message to be shown when an invalid `regex` is found**.
* `files`: An optional `object` specifying which files to analyze:
  * `ignore`: A `string` representing **Regular expression of the files to be ignored** when validating this specific pattern.
  * `inspect`:  A `string` representing **Regular expression of the files to be inspected** when validating this specific pattern.

> * `regex` is the only Required field. Slashes (`/`) are not required in the string, e.g. To get the following regex `/\bhttp:/`:
>   * when using `.eslintrc.js`, define the following string `"\bhttp:"`, or
>   * when using `.eslintrc.json`, define `"\\bhttp:"` (backslash needs to de double in a json file).
> * When `ignore` and `inspect` are present, `ignore` takes precedence.
> * Global ignore file pattern, takes precedence over `files` patterns.

> [1] In order to fix issue eslint must be run with `--fix` option.

`.eslintrc.json`:

```json
{
  "plugins": [
    "regex"
  ],
  "rules": {
    "regex/invalid": [
      "error", [{
          "regex": "invalidRegex1",
          "message": "errorMessage1",
          "replacement": "newValue"
        }, {
          "id": "regexIdN",
          "regex": "invalidRegexN",
          "files": {
            "ignore": "ignoreFilesRegexN"
          }
        }
      ]
    ]
  }
}
```

#### Definition of the Function used to replace **invalid** found pattern

Definition of the function must be done as a `string` in 1 line, and the following rules apply:

* It must return a `string` value, if not, return value will be ignored, i.e. it will silently fail.
* Its definition must be only the body of the function.
* If the function has invalid Javascript code, the function will be ignored, i.e. it will silently fail.

Function will receive only 1 parameter with the name `text`, with the value of the invalid text found.

e.g.

`"return text.trim()"` => only the body of the function + return a `string` value

`.eslintrc.json`:`

```json
{
  "id": "regexIdN",
  "regex": "\\serror\\w*\\s",
  "replacement": {
    "function": "return text.trim()"
  }
}
```

then, given:

`example.js`

```js
const exception = " error19 "
```

when linting with fix, the result will be:

```js
const exception = "error19"
```

### String to Regular expression conversion

Internally, each string from the array will be converted into a Regular Expression with `global` and `multiline` options, e.g.:

`"invalidRegex1"` will be transformed into `/invalidRegex1/gm`

When the pattern is found, the error message will reflect the exact location, e.g.:

```bash
 34:25  error  Invalid regular expression /invalidRegex1/gm found  regex/invalid
```

### Examples

Check:

* [invalid-regex Basic rule tests](tests/lib/rules/invalid-regex-rule.e2e-test.js)
* [invalid-regex Detailed rule tests](tests/lib/rules/invalid-regex-detailed-rule.e2e-test.js)
* [The set of Regex Rules of `eslint-plugin-base-style-config`](https://github.com/gmullerb/base-style-config/tree/master/js#regex-rules)

## Related Rules

* [`regex/required`](docs/rules/required-regex-rule.md).

## More information

* [`eslint-plugin-regex`](../README.md)
* [For a set of Regex Rules examples check `eslint-plugin-base-style-config`](https://github.com/gmullerb/base-style-config/tree/master/js#regex-rules)
