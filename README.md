<p align="center">
  <br/>
  <img src="https://assets.gitlab-static.net/uploads/-/system/project/avatar/16770425/eslint-plugin-regex.png"/>
</p>

<h1 align="center">ESLint rules using Regular Expressions</h1>

[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](LICENSE.txt) [![eslint-plugin-regex](https://img.shields.io/badge/npm-eslint--plugin--regex-blue?logo=npm)](https://www.npmjs.com/package/eslint-plugin-regex)

This project is licensed under the terms of the [MIT license](LICENSE.txt).
__________________

## Quick Start

1 . Add dependencies:

`package.json`:

```json
  ..
  "devDependencies": {
    "eslint": "^6.0.0",
    "eslint-plugin-regex": "1.0.0",
    ..
```

2 . Configure eslint:

`eslintrc.json`:

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
      ]
    ]
  }
}
```

__________________

## Goals

The idea is to allow to create different eslint rules based on Regular Expressions in order to have some "freedom" to create quick ESLint custom rules.

## Rules

### `regex/invalid`

This rule looks for **Invalid regular expressions** to be reported for each file.

Example of **incorrect** code for this rule:

```js
/* eslint regex/invalid: ['error', ['"']] */

const message = 'Hello "My Friend"'
```

Example of **correct** code for this rule:

```js
/* eslint regex/invalid: ['error', ['"']] */

const message = 'Hello \'My Friend\''
```

#### Options

This rule has two options:

* array of regular expressions to look for. [REQUIRED]
* a regular expression for ignoring files. [OPTIONAL]

`eslintrc.json`:

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

Internally, each string from the array will be converted into a Regular Expression with `global` and `multiline` options, e.g.:

`"invalidRegex1"` will be transformed into `/invalidRegex1/gm`

When the pattern is found splitting in more the one line the error message will no reflect the location, e.g.:

```bash
 1:1  error  Invalid regular expression /invalidRegex1/gm found in file  regex/invalid
```

When the pattern is found inside an specific line the error message will reflect the exact location, e.g.:

```bash
 34:25  error  Invalid regular expression /invalidRegex1/gm found  regex/invalid
```

### `regex/required`

This rule looks for **Required regular expressions** that must be present in each file.

Example of **incorrect** code for this rule:

```js
/* eslint regex/required: ["error", ["^// Copyright My Friend"]] */

const message = 'Hello "My Friend"'
```

Example of **correct** code for this rule:

```js
/* eslint regex/required: ["error", ["^// Copyright My Friend"]] */

// Copyright My Friend
const message = 'Hello "My Friend"'
```

#### Options

This rule has two options:

* array of regular expressions to look for. [REQUIRED]
* a regular expression for ignoring files. [OPTIONAL]

`eslintrc.json`:

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

Internally, each string from the array will be converted into a Regular Expression with `global` and `multiline` options, e.g.:

`"requiredRegex1"` will be transformed into `/requiredRegex1/gm`

__________________

## Extending/Developing

[Developing](js/readme/developing.md)

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
