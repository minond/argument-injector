[![Build Status](https://travis-ci.org/minond/argument-injector.svg?branch=master)](https://travis-ci.org/minond/argument-injector)
[![Coverage Status](https://coveralls.io/repos/minond/argument-injector/badge.png?branch=master)](https://coveralls.io/r/minond/argument-injector?branch=master)

`argument-injector` is a function argument injector for JavaScript. it allows
any function to be "bound" to an injector object, which hijacks the function
call and injects arguments when the function is executed.

#### usage

to get started, you'll first need to create a new instance of an `Injector`:

```js
var Injector = require('argument-injector'),
    injector = new Injector();
```

this `injector` object will have three methods you care about: `#register`,
`#bind`, and `#trigger`

##### register

this method allows you to "save" a variable in the injector object. there are
the variables that are available during a function call. this is the signature
of the method: `Injector register(String name, * variable)`

```js
injector.register('myService', {
    isActive: function () {
        return true;
    }
});
```

##### bind

the `bind` method is what ties a function to your injector. this works by
taking your function, and returning a copy which checks for arguments passed
and arguments available in the injector when the function is invoked. this is
the signature of the method: `Function bind(Function func, Object scope)`

```js
var myFunction = injector.bind(function (myService) {
    return myService.isActive() ? 'you are active' : 'you are not active';
});
```

you can call `myFunction` the same way you would any other function, with the
exception that you do not need to pass it a `myService` variable.

bind will parse the signature of the function you gave it and generate a list
of the required arguments. once the function is invoked, this list of arguments
is checked against the registered variables and passed to the real function.

##### trigger

there's also a `trigger` method, which works just like `bind`, except it will
invoke the funciton immediatelly and return that call's return value instead of
a bound function. this is the signature of the method: `* trigger(Function
func, Object scope)`

```js
injected.register('name', 'Marcos');
injector.trigger(function (name) {
    // will output 'Marcos'
    console.log(name);
});
```
