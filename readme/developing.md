# Extending/Developing

## Prerequisites

* Node/Npm, Node/Yarn or failing [Java](http://www.oracle.com/technetwork/java/javase/downloads).
* [Git](https://git-scm.com/downloads) (only if you are going to clone the project).

## Getting it

Clone or download the project[1], in the desired folder execute:

```sh
git clone https://github.com/gmullerb/eslint-plugin-regex
```

or

```sh
git clone https://gitlab.com/gmullerb/eslint-plugin-regex
```

> [1] [Cloning a repository](https://help.github.com/articles/cloning-a-repository/)

## Set up

### Npm

Run:

```sh
npm install
```

> Recommendation: Immediately after installation, run `npm run check` to be sure that initial code is "ok".  
> [1] it will use eslint configuration defined in [base-style-config](https://github.com/gmullerb/base-style-config), most specifically [eslint-plugin-base-style-config](https://www.npmjs.com/package/eslint-plugin-base-style-config).

### Gradle

Run:

```sh
./gradlew
```

This command will install `node` (`npm install`) and run `npm run check`.

### Npm scripts

Npm scripts, [`package.json`](../package.json):

* `lint.common`: checks common style of "all" files.
* `lint.source`: checks eslint style of `js` files.
* `lint`: runs lints.
* `only-test`: runs test.
* `test`: runs test with coverage report.
* `check`: runs lints, test, pack and audit.

#### From Gradle

Run any scripts using `/gradlew npm_run_.name.`, where `.name.` is the name of the npm script, e.g.:

`lint.common` => `./gradlew npm_run_lint.common`

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
