[![Build Status](https://travis-ci.org/minond/injector.svg?branch=master)](https://travis-ci.org/minond/injector)

`injector` is a basic argument injector for Node.js. it allows any function to
be "bound" to an injector object which hijacks the function call and injects
arguments when the function is executed.

### Injector
acts as a holder of dependencies

```
var Injector = require('injector'),
    injector = new Injector();
```

### .dependency(/* String */ name, /* mixed */ value)
this is how dependencies are registered with the injector object

```
injector.dependency('myService', {
    isActive: function () {
        return true;
    }
});
```
### .bind(/* Function */ func, /* Object */ scope)
and this is how functions are "bound" to the injector object functions are
defined the way you normally would - as if you were going to pass the arguments
manually:

```
function myFunction(myService) {
    return myService.isActive() ? 'you are active' : 'you are not active';
}
```

then you can bind them to your injector
```
myFunction = injector.bind(myFunction);
```

you can call the function and your dependencies will be passed automatically
```
myFunction() // myService will be injected
```

### .trigger(/* Function */ func, /* Object */ scope)
there's also the possiblity to bind and trigger functions all in one swoop

```
injected.dependency('name', 'Marcos');

// binds then triggers the function. outputs 'Marcos'
injector.trigger(function (name) {
    console.log(name);
});
```
