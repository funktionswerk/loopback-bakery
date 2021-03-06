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
Or use await:
```js
let newUser = await userRecipe({email: 'user@loopback.test', password: 'xxx'});
```

You can pass default values when creating the recipe:
```js
var userRecipe = bakery.Recipe(app.models.User, {password: 'xxx'});
var user = await userRecipe({email: 'user@loopback.test'});
```
You can create multiple samples with ```quantity()```:
```js
var userList = await recipe.quantity(3)({name: 'Steven', email: 'steven@mail.test'});
console.log(userList.length); //3
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
## Users and Roles

The bakery allows to easily create users and roles. Use the built-in UserRecipe:

```js
var app = require('../server'); //path to your loopback server script
var bakery = require('loopback-bakery');

//...

var adminUserRecipe = bakery.UserRecipe(app.models.User).withRole('admin', app.models.Role);
let adminUser = await adminUserRecipe({email: 'admin@loopback.test', password: 'admin'});  
```
The recipe will create a new role in case the required user role does not exist.

## Utils

Use ```cycle()``` to rotate a list of sample values:
```js
let pets = bakery.cycle(['dog', 'cat', 'rabbit']);
console.log(pets()) //dog
console.log(pets()) //cat
console.log(pets()) //rabbit
console.log(pets()) //dog
//...
```

## Logging

```js
var bakery = require('loopback-bakery');
var logger = require('debug')('samples');

bakery.withLogging(logger);
var todoRecipe = bakery.Recipe(app.models.TODO);

// Logs: 'Created TODO with attributes {"title":"Write Email to John","text":"Some more infos about the TODO..."}'
todoRecipe({
  title: 'Write Email to John',
  text: 'Some more infos about the TODO...'
});
```
