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

* `id`: A `string` representing the **Pattern Id**.
* `regex`: A `string` representing the **Regular expression to look for**.
* `message`: A `string` specifying the **Message to be shown when an error happens** (invalid `regex` is found or required `regex` is not found).
* `files`: An `object` specifying which files to analyze:
  * `ignore`: A `string` representing **Regular expression of the files to be ignored** when validating this specific pattern.
  * `inspect`:  A `string` representing **Regular expression of the files to be inspected** when validating this specific pattern.

> * `regex` is the only Required field. Slashes (`/`) are not required in the string, e.g. To get the following regex `/\bhttp:/` define the following string `"\bhttp:"` when using `.eslintrc.js` or `"\\bhttp:"` when using `.eslintrc.json` (backslash needs to de double in a json file).  
> * When `ignore` and `inspect` are present, `ignore` takes precedence.  
> * Global ignore file pattern, takes precedence over `files` patterns.

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

### String to Regular expression conversion

Internally, each string from the array will be converted into a Regular Expression with `global` and `multiline` options, e.g.:

`"invalidRegex1"` will be transformed into `/invalidRegex1/gm`

When the pattern is found splitting in more the one line the error message will not reflect the location (i.e. `1:1` will be shown), e.g.:

```bash
 1:1  error  Invalid regular expression /invalidRegex1/gm found in file  regex/invalid
```

When the pattern is found inside an specific line the error message will reflect the exact location, e.g.:

```bash
 34:25  error  Invalid regular expression /invalidRegex1/gm found  regex/invalid
```

## Related Rules

* [`regex/required`](docs/rules/required-regex-rule.md).

## More information

[Back](../README.md)
