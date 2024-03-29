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

* `regex`: A **required** `string` for `regex/required` and `regex/invalid` representing the **Regular expression to look for**. [REQUIRED]
* `flags`: A combination of flags, `i`, `s` and/or `u`, to be used by the Regular Expression. [OPTIONAL]
* `replacement` for `regex/invalid` [1]: [OPTIONAL]
  * An optional `string` used to replace the **invalid** found pattern, or
  * An optional `object` that establish how the **invalid** found pattern will be replaced:
    * `function`: used to replace the **invalid** found pattern.
      * It will receive 3 parameters: `text`, `captured` and `$`, that can be used as desired.
      * It must return a `string` value, if not, return value will be ignored.
      * Its definition must be only the body of the function.
  * One must be defined, either the `string` or `function`.
* `id`: An optional `string` representing the **Pattern Id**. [OPTIONAL]
* `message`: An optional `string` specifying the **Message to be shown when an error happens** (invalid `regex` is found or required `regex` is not found). [OPTIONAL]
* `files`: An optional `object` specifying which files to analyze: [OPTIONAL]
  * `ignore`: A `string` representing **Regular expression of the files to be ignored** when validating this specific pattern.
  * `inspect`:  A `string` representing **Regular expression of the files to be inspected** when validating this specific pattern.

```json
{
  "id": "regexId",
  "regex": "regex",
  "flags": "isu",
  "replacement": "replacementString",
  "message": "errorMessage",
  "files": {
    "ignore": "ignoreFilesRegex",
    "inspect": "inspectFilesRegex"
  }
}
```

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

#### Definition of the Function used to replace the invalid found pattern

Definition of the function must be done as a `string` in 1 line, and the following rules apply:

* It must return a `string` value, if not, return value will be ignored, i.e. it will silently fail.
* Its definition must be **only the body of the function**.
  * For "simple" functions where the `return` is found at the beginning of the body of the function and the **exact** word *return* is not present, `return` can be omitted.
* If the function has invalid Javascript code, the function will be ignored, i.e. it will silently fail.

Function will receive 3 parameters, to be used as desired:

* `text`: a `string` with the value of the invalid text found.
* `captured`: an `array` of strings with the values of the captured groups for the regex.
* `$`: an `array` of strings, with the value of the invalid text found plus the values of the captured groups for the regex.
  * `$[0]` = `text`: a `string` with the value of the invalid text found.
  * `$[1..]` = `captured`: an `array` of strings with the values of the captured groups for the regex.
    * `$[1]` = `captured[0]` and so on.
  * It allows smaller definitions.

**e.g. Using parameter `text`**

`"return text.trim()"` => only the body of the function + returns a `string` value based on `text`

Having the following rule in `.eslintrc.json`:

```json
{
  "id": "regexIdN",
  "regex": "\\serror\\w*\\s",
  "replacement": {
    "function": "return text.trim()"
  }
}
```

or using `$`:

```json
{
  "id": "regexIdN",
  "regex": "\\serror\\w*\\s",
  "replacement": {
    "function": "return $[0].trim()"
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

As the body of the function is "simple", i.e. the `return` is found at the beginning of the body of the function, and besides, the word *return* is not present, then the definition could be done as:

```json
{
  "id": "regexIdN",
  "regex": "\\serror\\w*\\s",
  "replacement": {
    "function": "text.trim()"
  }
}
```

or

```json
{
  "id": "regexIdN",
  "regex": "\\serror\\w*\\s",
  "replacement": {
    "function": "$[0].trim()"
  }
}
```

**e.g. Using parameter `captured`**

`"return captured[0]"` => only the body of the function + returns a `string` value based on `captured`

Having the following rule in `.eslintrc.json`:

```json
{
  "id": "regexIdN",
  "regex": "\\serror(\\w*)\\s",
  "replacement": {
    "function": "return captured[0]"
  }
}
```

or using `$`:

```json
{
  "id": "regexIdN",
  "regex": "\\serror(\\w*)\\s",
  "replacement": {
    "function": "return $[1]"
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
const exception = "19"
```

As the body of the function is "simple", i.e. the `return` is found at the beginning of the body of the function, and besides, the word *return* is not present, then the definition could be done as:

```json
{
  "id": "regexIdN",
  "regex": "\\serror(\\w*)\\s",
  "replacement": {
    "function": "captured[0]"
  }
}
```

or

```json
{
  "id": "regexIdN",
  "regex": "\\serror(\\w*)\\s",
  "replacement": {
    "function": "$[1]"
  }
}
```

**e.g. Using parameters `text` and `captured`**

`"return text + ' = ' + captured[0]  + ' + ' + captured[1] + ' = ' + (parseInt(captured[0]) + parseInt(captured[1]))"` => only the body of the function + returns a `string` value based on `text` and `captured`

Having the following rule in `.eslintrc.json`:

```json
{
  "id": "regexIdN",
  "regex": "(\\d+)\\+(\\d+)",
  "replacement": {
    "function": "return text + ' = ' + captured[0]  + ' + ' + captured[1] + ' = ' + (parseInt(captured[0]) + parseInt(captured[1]))"
  }
}
```

or using `$`:

```json
{
  "id": "regexIdN",
  "regex": "(\\d+)\\+(\\d+)",
  "replacement": {
    "function": "return $[0] + ' = ' + $[1]  + ' + ' + $[2] + ' = ' + (parseInt($[1]) + parseInt($[2]))"
  }
}
```

or :

```json
{
  "id": "regexIdN",
  "regex": "(\\d+)\\+(\\d+)",
  "replacement": {
    "function": "return text + ' = ' + $[1]  + ' + ' + $[2] + ' = ' + (parseInt($[1]) + parseInt($[2]))"
  }
}
```

or :

```json
{
  "id": "regexIdN",
  "regex": "(\\d+)\\+(\\d+)",
  "replacement": {
    "function": "return `${text} = ${captured[0]} + ${captured[1]} = ${parseInt($[1]) + parseInt($[2])}`"
  }
}
```

then, given:

`example.js`

```js
const sum = "4+5"
```

when linting with fix, the result will be:

```js
const sum = "4+5 = 4 + 5 = 9"
```

As the body of the function is "simple", i.e. the `return` is found at the beginning of the body of the function, and besides, the word *return* is not present, then the definition could be done as:

```json
{
  "id": "regexIdN",
  "regex": "(\\d+)\\+(\\d+)",
  "replacement": {
    "function": "text + ' = ' + $[1]  + ' + ' + $[2] + ' = ' + (parseInt($[1]) + parseInt($[2]))"
  }
}
```

or :

```json
{
  "id": "regexIdN",
  "regex": "(\\d+)\\+(\\d+)",
  "replacement": {
    "function": "`${text} = ${captured[0]} + ${captured[1]} = ${parseInt($[1]) + parseInt($[2])}`"
  }
}
```

**e.g. `return` required**

e.g. `const result = text === 'superb' ? 'Superb' : text; return result` => only the body of the function + returns a `string` value based on `text`.

Since the `return` is not found at the beginning of the body of the function, `return` cannot be omitted, then rule definition will be as usual:

```json
{
  "id": "regexIdN",
  "regex": "\\w+",
  "replacement": {
    "function": "const result = text === 'superb' ? 'Superb' : text; return result"
  }
}
```

> Some cases may use Comma operator, e.g. `"function": "result = text === 'superb' ? 'Superb' : text, result"`

e.g. `return text === 'return' ? 'Return' : text` => only the body of the function + returns a `string` value based on `text`.

Since the *exact* word *return* is present, this will **required** `return`, then rule definition will be as usual:

```json
{
  "id": "regexIdN",
  "regex": "\\w+",
  "replacement": {
    "function": "return text === 'return' ? 'Return' : text"
  }
}
```

Following case does not required `return`:

e.g. `return text === 'Return' ? 'RETURN' : text` => only the body of the function + returns a `string` value based on `text`.

Since the **exact** word *return* is not present, this will allow the following rule definition to be:

```json
{
  "id": "regexIdN",
  "regex": "\\w+",
  "replacement": {
    "function": "text === 'Return' ? 'RETURN' : text"
  }
}
```

##### Debugging of the Replacement Function for invalid found pattern

* It is possible to add `console` statements to print some information in the Replacement Function.

```json
{
      regex: '\\serror(\\w*)\\s',
      replacement: {
        function: 'const extract = captured[0]; console.log(extract); return extract'
      }
    }
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
