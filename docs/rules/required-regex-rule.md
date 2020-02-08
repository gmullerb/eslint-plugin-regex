# Looks for Required regular expressions that must be present in each file

## Rule Details

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

## Options

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
