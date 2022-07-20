# Extending/Developing

## Prerequisites

* [NodeJS](https://nodejs.org/en/download)/npm [1].
* [Git](https://git-scm.com/downloads) (if you are going to clone the project).

> [1] [Downloading NodeJS](https://nodejs.org/en/download) will also download and provide [`npm`](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm#using-a-node-installer-to-install-nodejs-and-npm).

## Getting it

[Clone](https://help.github.com/articles/cloning-a-repository/) the project in the desired folder by executing:

```sh
git clone https://github.com/gmullerb/eslint-plugin-regex
```

or

```sh
git clone https://gitlab.com/gmullerb/eslint-plugin-regex
```

(you can also fork)

## Set up

Run:

```sh
npm install
```

It will install project dependencies, as [eslint](https://www.npmjs.com/package/eslint), [any-eslint-parser](https://www.npmjs.com/package/any-eslint-parser), [eslint-plugin-base-style-config](https://www.npmjs.com/package/eslint-plugin-base-style-config), etc.

> Recommendation: Immediately after installation, run `npm run check` to be sure that initial code is "ok".

### Npm scripts

[`package.json`](../package.json):

* `lint.common`: checks common style of "all" files defined in [`.eslintrc-any.json`](../.eslintrc-any.json) using [any-eslint-parser](https://www.npmjs.com/package/any-eslint-parser).
* `lint.source`: checks eslint style of `js` files.
* `lint`: runs both lints (`lint.common` and `lint.source`).
* `test.only`: runs test.
* `test`: runs test with coverage report.

Additionally:

* `npm run check`: will execute all tasks (`lint`, `test`, etc.).
* `npm run`: will list all available script/task for the project.

## Folders structure

```
  /lib
    /rules
    /utils
  /tests
    /lib
      /rules
```

- `lib/rules`: Rules files.
- `lib/utils`: Utilities files.
- `tests/lib/rules`: Test files.

## Main documentation

[Back](../README.md)
