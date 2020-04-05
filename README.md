<p align="center">
  <br/>
  <img src="https://assets.gitlab-static.net/uploads/-/system/project/avatar/16770425/eslint-plugin-regex.png" alt=" "/>
</p>

<h1 align="center">ESLint rules using Regular Expressions</h1>

[![eslint-plugin-regex](https://badgen.net/badge/npm%20pack/eslint%20plugin%20regex/blue)](https://www.npmjs.com/package/eslint-plugin-regex)
[![ ](https://badgen.net/npm/v/eslint-plugin-regex)](https://www.npmjs.com/package/eslint-plugin-regex)
[![License](https://img.shields.io/github/license/mashape/apistatus.svg)](LICENSE.txt)
[![ ](https://gitlab.com/gmullerb/eslint-plugin-regex/badges/master/coverage.svg)](https://gitlab.com/gmullerb/eslint-plugin-regex/pipelines)
[![Github repo](https://badgen.net/badge/icon/github?icon=github&label)](https://github.com/gmullerb/eslint-plugin-regex)
[![Gitlab repo](https://badgen.net/badge/icon/gitlab?icon=gitlab&label)](https://gitlab.com/gmullerb/eslint-plugin-regex)
__________________

## Quick Start

1 . Add dependencies:

`package.json`:

```json
  ..
  "devDependencies": {
    "eslint": "^4.0.0",
    "eslint-plugin-regex": "1.1.0",
    ..
```

2 . Configure eslint:

Short configuration:

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
      ]
    ],
    "regex/required": [
      "error", [
        "requiredRegex1",
        "requiredRegexN"
      ],
      "ignoreFilesRegex"
    ]
  }
}
```

Detailed configuration:

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
    ],
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

__________________

## Goals

The idea is to allow to create different eslint rules based on Regular Expressions in order to have some "freedom" to create quick ESLint custom rules.

## Rules

Two rules are defined:

* [`regex/invalid`](docs/rules/invalid-regex-rule.md).
* [`regex/required`](docs/rules/required-regex-rule.md).

### `regex/invalid`

This rule checks that specified patterns are not found in files, i.e. **Invalid patterns**.

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

When the pattern is found splitting in more the one line the error message will not reflect the location (i.e. `1:1` will be shown), e.g.:

```bash
 1:1  error  Invalid regular expression /invalidRegex1/gm found in file  regex/invalid
```

When the pattern is found inside an specific line the error message will reflect the exact location, e.g.:

```bash
 34:25  error  Invalid regular expression /invalidRegex1/gm found  regex/invalid
```

### `regex/required`

This rule looks for specific patterns that must be present in each file, i.e. **Required patterns**.

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

### Options

Both rule has two options:

* **array** of patterns definitions to analyze. [REQUIRED]
  * Each pattern definition can be 'Short' or 'Detailed'.
* a **string** representing the regular expression for ignoring files for all patterns. [OPTIONAL]
  * Slashes (`/`) are not required in the string, e.g. To get the following regex `/.*test\.js/` define the following string `".*test\.js"` when using `.eslintrc.js` or `".*test\\.js"` when using `.eslintrc.json` (backslash needs to de double in a json file).

#### Short pattern definition

It is specified by just a regular expression `string`, i.e. `"regex"`

* Slashes (`/`) are not required in the string, e.g. To get the following regex `/\bhttp:/` define the following string `"\bhttp:"` when using `.eslintrc.js` or `"\\bhttp:"` when using `.eslintrc.json` (backslash needs to de double in a json file).

#### Detailed pattern definition

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

#### Mixing definitions

It is possible to use both type of definitions, 'Short pattern definition' with 'Detailed pattern definition', in the array of patterns.

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
        "invalidRegex2", {
          "regex": "invalidRegex3",
          "message": "errorMessage1",
          "files": {
            "inspect": "inspectFilesRegex1"
          }
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

* `invalidRegex1` and `invalidRegex2` are 'Short pattern definition'.
* `invalidRegex3` and `invalidRegexN` are 'Detailed pattern definition'.

#### String to Regular expression conversion

Internally, each string from the array will be converted into a Regular Expression with `global` and `multiline` options, e.g.:

`"someRegex"` will be transformed into `/someRegex/gm`

> Remember that backslash needs to be double in strings of a json file, e.g. To get the following regex `/\bhttp:/` define the following string `"\\bhttp:"`.

#### Error report

The 'Short pattern definition' errors are reported with the following structure:

Given `someRegex`, the following message will be shown on error:

```
Invalid regular expression /someRegex/gm found
```

or

```
Required regular expression /someRegex/gm not found in file
```

The 'Detailed pattern definition' errors are reported with the following structure:

A . If `message` is present then that **exact message is reported**.  
B . If `id` is present then:

Given `"id": "someRegexId"`, the following message will be shown on error:

```
Invalid regular expression 'someRegexId' found
```

or

```
Required regular expression 'someRegexId' not found in file
```

C . If neither `message` nor `id` is present then the 'Short pattern definition' error message is shown.

> * `message` takes precedence over `id`.  
> * Although `id` is a quick solution (and useful when creating and testing a rule), using `message` will give more information to the team about the issue.

### `regex/invalid` vs `regex/required`

Both rule were design with *binary* approach:

* `regex/invalid`: pattern **is not present** => any presence of the *specific* pattern in a file is invalid.
* `regex/required`: pattern **is present** => only 1 presence of the *specific* pattern in a file is required.

Array of patterns represent different logical operation for each rule:

* `regex/invalid`: **OR** => the presence in a file of *any* of the patterns defined in the *array* is invalid.
* `regex/required`: **AND** => the presence in file of *all* of the patterns defined in the *array* is required.

__________________

## Extending/Developing

[Developing](js/readme/developing.md)

## Contributing

* **Use it**.
* **Share it**.
* [Give it a Star](https://github.com/gmullerb/eslint-plugin-regex).
* [Propose changes or improvements](https://github.com/gmullerb/eslint-plugin-regex/issues).
* [Report bugs](https://github.com/gmullerb/eslint-plugin-regex/issues).

## Documentation

* [`CHANGELOG.md`](js/CHANGELOG.md): add information of notable changes for each version here, chronologically ordered [1].

> [1] [Keep a Changelog](http://keepachangelog.com)

## License

[MIT License](LICENSE.txt)
__________________

## Remember

* Use code style verification tools => Encourages Best Practices, Efficiency, Readability and Learnability.
* Start testing early => Encourages Reliability and Maintainability.
* Code Review everything => Encourages Functional suitability, Performance Efficiency and Teamwork.

## Additional words

Don't forget:

* **Love what you do**.
* **Learn everyday**.
* **Learn yourself**.
* **Share your knowledge**.
* **Learn from the past, dream on the future, live and enjoy the present to the max!**.

At life:

* Let's act, not complain.
* Be flexible.

At work:

* Let's give solutions, not questions.
* Aim to simplicity not intellectualism.
