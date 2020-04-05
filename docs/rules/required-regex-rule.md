# Looks for Required regular expressions that must be present in each file

## Rule Details

This rule looks for **Required regular expressions** that must be present in each file.

Example of **incorrect** code for this rule:

```js
/* eslint regex/required: ["error", ["^// Copyright My Friend"]] */

const text = 'Hello "My Friend"'
```

Example of **correct** code for this rule:

```js
/* eslint regex/required: ["error", ["^// Copyright My Friend"]] */

// Copyright My Friend
const text = 'Hello "My Friend"'
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
    "regex/required": [
      "error", [
        "requiredRegex1",
        "requiredRegexN"
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
    "regex/required": [
      "error", [{
          "id": "regexId1",
          "regex": "requiredRegex1",
          "files": {
            "inspect": "inspectFilesRegex1"
          }
        }, {
          "regex": "requiredRegexN",
          "message": "errorMessageN",
          "files": {
            "ignore": "ignoreFilesRegexN",
            "inspect": "inspectFilesRegexN"
          }
        }
      ]
    ]
  }
}
```

### String to Regular expression conversion

Internally, each string from the array will be converted into a Regular Expression with `global` and `multiline` options, e.g.:

`"requiredRegex1"` will be transformed into `/requiredRegex1/gm`

## Related Rules

* [`regex/invalid`](docs/rules/invalid-regex-rule.md).

## More information

[Back](../README.md)
