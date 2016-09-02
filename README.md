# setIdle()
Monitors your JS application for when the user is idle and triggers events.

    var idle = setIdle(() => doSomething('awesome'));

## Installation

### NPM
    > npm install setidle
### Bower
    > bower install setidle
### The old-fashioned way
    <script type="text/javascript" src="setidle.js"></script>

## Background

Does your JavaScript front-end send back telemetry or do other activities that aren't time sensitive?
If so, then a simple way to improve the performance of your application is to queue up those requests
until the application is "idle", for example if a user is reading something and not causing the UI to 
process anything. This can help to ensure that your complex interactions remain smooth, and that you're
only running code when you absolutely have the resources to do so, especially on mobile.

![](http://i.giphy.com/11xBk5MoWjrYoE.gif)
<br />
[[Giphy Link](http://gph.is/1nF4c0i)]

## Features
- Simple no-nonsense browser implementation based on `window.setTimeout`.
- Class constructor which wraps any `EventEmitter` using the [NodeJS EventEmitter class in the *events* API](https://nodejs.org/api/events.html#events_class_eventemitter).
- Can be configured to work on a specific element or the entire window.

## Usage

### Class constructor

#### CommonJS/Node
    var SetIdle = require('setidle');
    var idle = new SetIdle(emitter);
    idle.start(() => doSomething('awesome'));
    
#### RequireJS
    require(['setidle'], function (SetIdle) {
        var idle = new SetIdle(emitter);
        idle.start(() => doSomething('awesome'));
    });
    
#### Browser
    var element = document.getElementById('panelStuff');
    var idle = new SetIdle(new SetIdle.DOMEventEmitter(element));
    idle.start(() => doSomething('awesome'));

Note that the procedural version automatically passes `window` to the `DOMEventEmitter` constructor.

The `SetIdle` constructor expects a single parameter *emitter*, which is of the same for as the [NodeJS EventEmitter class in the *events* API](https://nodejs.org/api/events.html#events_class_eventemitter).

## Contributing

Contributions and pull requests are welcome! If you see a feature that you want, add it to our issue tracker. If you find a bug, definitely report back to us. As always, PRs are welcome!