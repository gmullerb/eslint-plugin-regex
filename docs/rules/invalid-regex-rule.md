# Looks for Invalid regular expressions to be reported for each file

## Rule Details

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
    "regex/invalid": [
      "error", [
        "invalidRegex1",
        "invalidRegexN"
      ],
      ".*test\.js"
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
