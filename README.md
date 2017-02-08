# loopback-bakery

This is a toolkit to easily create test data for [loopback](http://loopback.io/) based applications.
It is heavily inspired by [Django's Model Mommy](http://model-mommy.readthedocs.io/en/latest/basic_usage.html).

## Installation
```
npm install --save loopback-bakery
```

## Basic Usage

Import the module and create a recipe for a loopback PersistedModel:

```js
var app = require('../server'); //path to your loopback server script
var bakery = require('loopback-bakery');

//...

var userRecipe = bakery.Recipe(app.models.User);

userRecipe({
  email: 'user@loopback.test',
  password: 'xxx'
}).then((user) => {
  console.log(user);
});
```

You can pass default values when creating the recipe:
```js
var userRecipe = bakery.Recipe(app.models.User, {
  password: 'xxx'
});

userRecipe({
  email: 'user@loopback.test'
}).then((user) => {
  console.log(user);
});
```
## Dynamic Data

Instead of fixed attributes you can use functions that are resolved to attribute values before the new record is created:

```js
var userRecipe = bakery.Recipe(app.models.User, {
  password: 'xxx',
  email: () => {
    return 'user@loopback.test';
  }
});

userRecipe().then((user) => {
  console.log(user);
});
```
This is handy if you use [fakerjs](https://github.com/marak/Faker.js/) to generate your test samples:

```js
var faker = require('faker/locale/de');

//...

var userRecipe = bakery.Recipe(app.models.User, {
  password: 'xxx',
  email: faker.internet.email
});

userRecipe().then((user) => {
  console.log(user);
});
```
Support for Promises is also available. Instead of returning an attribute your function can return a Promise:

```js

var userRecipe = bakery.Recipe(app.models.User, {
  password: 'xxx',
  email: () => {
    return new Promise((resolve) => {
      process.nextTick(() => {
        resolve('user@loopback');
      });
    });
  }
});

userRecipe().then((user) => {
  console.log(user);
});
```
