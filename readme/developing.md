# Extending/Developing

## Prerequisites

* Node/Npm, Node/Yarn or [Java](http://www.oracle.com/technetwork/java/javase/downloads).
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

### Gradle

Run:

```sh
./gradlew
```

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

## Building it

### Npm

Npm scripts, [`package.json`](../package.json):

* `assessCommon`: checks common style of **all** files.
* `assessGradle`: checks code style of `build.gradle` file.
* `lint`: checks eslint style of `js` files.
* `test`: runs `RuleTester` E2E test.

Run `npm run check` to execute all tasks.

> Recommendation: First time run `npm run check` to start from an "ok" code.  
> [1] it will use eslint configuration defined in [base-style-config](https://github.com/gmullerb/base-style-config), most specifically [eslint-plugin-base-style-config](https://www.npmjs.com/package/eslint-plugin-base-style-config).

### Gradle

Gradle tasks, [`build.gradle`](../build.gradle):

* `lint`: checks eslint style of `js` files.
* `test`: runs `RuleTester` E2E test.
* `build`: build NPM package.

Run `./gradlew` to execute all tasks.

> Recommendation: First time run `./gradlew` to start from an "ok" code.

## Main documentation

[Back](../README.md)
