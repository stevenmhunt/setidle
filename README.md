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

## Examples

### CommonJS/Node
    var SetIdle = require('setidle');
    var idle = new SetIdle(emitter);
    idle.start(() => doSomething('awesome'));
    
### RequireJS
    require(['setidle'], function (SetIdle) {
        var idle = new SetIdle(emitter);
        idle.start(() => doSomething('awesome'));
    });
    
### Browser
    var element = document.getElementById('panelStuff');
    var idle = new SetIdle(new SetIdle.DOMEventEmitter(element));
    idle.start(() => doSomething('awesome'));

## Usage

### SetIdle (emitter)
- Constructs an idle monitor.
- The `SetIdle` constructor expects a single parameter *emitter*, which has either an 'on()' or 'addListener()' method, and an 'off()' or 'removeListener()' method. 
- It is compatible with the [NodeJS EventEmitter class in the *events* API](https://nodejs.org/api/events.html#events_class_eventemitter).

### SetIdle.start (fnIdle, [fnActive], [config])
- Starts monitoring of the given event emitter.
- The `fnIdle` callback will be triggered when the application is idle.
- The `fnActive` callback will be triggered when the application is active again.
- The `config` object is expected to take the following form. These are defaults if no config is provided:

```javascript
    {
        /**
         * How long to wait for event silence before declaring the application as idle.
         */
        interval: 3000,

        /**
         * A list of events to use in order to determine when the system is in use.
         */
        events: [

            // The user is interacting with the page.
            'change',
            'click',
            'dblclick',
            'scroll',
            'touchstart',
            'touchend',

            // watch for indications that the browser is having to re-paint the page.
            'resize',
            'DOMNodeInserted',
            'DOMNodeRemoved'
        ]
    }
```

### SetIdle.stop()
- Stops all monitoring activity.

### window.setIdle (fnIdle, [fnActive], [interval])
- Modeled after `window.setTimeout`
- The `fnIdle` callback will be triggered when the application is idle.
- The `fnActive` callback will be triggered when the application is active again.
- The interval defines how many milliseconds of inactivity constitutes "idleness". The default is 3000 milliseconds.
- Note that the procedural version automatically passes `window` to the `DOMEventEmitter` constructor.
- Returns an instance of the SetIdle object used to start monitoring.

### window.clearIdle (idle)
- Modeled after `window.clearTimeout`
- Stops the given SetIdle instance by calling the `SetIdle.stop` method.

## Contributing

Contributions and pull requests are welcome! If you see a feature that you want, add it to our issue tracker. If you find a bug, definitely report back to us. As always, PRs are welcome!