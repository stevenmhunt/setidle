/*****************************
 * setidle
 * Written by Steven Hunt
 * MIT License
 *****************************/

(function (window) {

    /**
     * The default idle configuration.
     */
    var defaultConfig = {

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
    };

    /**
     * An event emitter wrapper for DOM events.
     * This is helpful so that SetIdle only cares about working with event emitters in general.
     * @constructor
     */
    function DOMEventEmitter (element) {

        element = element || window;

        /**
         * Retrieves the HTML element being wrapped.
         * @returns The HTML element being wrapped.
         */
        this.getElement = function () { return element; };
    }

    /**
     * Called when an event is registered.
     * @param event {string} The event to register.
     * @param fn {function} The event listener to register.
     */
    DOMEventEmitter.prototype.on = function (event, fn) {

        this.getElement()
            .addEventListener(event, fn, false);
    };

    /**
     * Called when an event is removed.
     * @param event {string} The event to remove.
     * @param fn {function} The event listener to remove.
     */
    DOMEventEmitter.prototype.off =  function (event, fn) {

        this.getElement()
            .removeEventListener(event, fn);
    };

    /**
     * Monitors and reports on whether the given event emitted is idle.
     * @param emitter An event emitter. Expects a NodeJS-style EventEmitter instance. For DOM events, use SetIdle.DOMEventEmitter.
     * @constructor
     */
    function SetIdle(emitter) {

        /**
         * Retrieves the emitter being monitored.
         * @returns The emitter being monitored.
         */
        this.getEmitter = function () {  return emitter; };
    }

    SetIdle.DOMEventEmitter = DOMEventEmitter;

    /**
     * Starts the event monitoring if not started yet.
     * @param fnIdle A callback for when the application is idle.
     * @param fnActive A callback for when the application is active.
     * @param [config] A configuration object.
     */
    SetIdle.prototype.start = function (fnIdle, fnActive, config) {

        // use the default configuration if none is provided.
        config = config || defaultConfig;
        this._config = config;

        this._eventHandlers = this._eventHandlers || [];

        var prevTimeout = null;

        /**
         * Handles the event by resetting the idle timer.
         */
        function handleEvent() {

            // clear the previously running timeout.
            if (prevTimeout) {
                clearTimeout(prevTimeout);
                prevTimeout = null;
            }

            // if there was no running timeout, then report that the application has become active.
            else if (fnActive && typeof fnActive === 'function') {
                fnActive();
            }

            // start a new timeout counter. If it completes, then run the idle callback.
            prevTimeout = setTimeout(function () {
                if (fnIdle && typeof fnIdle === 'function') {
                    fnIdle();
                }
                prevTimeout = null;
            }, config.interval);
        }

        var events = this.getEmitter(),
            eventOn = (events.on || events.addListener);

        if (!eventOn || typeof eventOn !== 'function') {
            throw 'The provided event emitter does not implement on() or addListener().';
        }

        eventOn = eventOn.bind(events);

        // register the handler for all events to be monitored.
        for (var i = 0; i < config.events.length; i++) {
            eventOn(config.events[i], handleEvent);
        }

        this._eventHandlers.push(handleEvent);
    };

    /**
     * Stops all event monitoring.
     */
    SetIdle.prototype.stop = function () {

        var i, j,
            events = this.getEmitter(),
            eventOff = (events.off || events.removeListener);

        if (!eventOff || typeof eventOff !== 'function') {
            throw 'The provided event emitter does not implement off() or removeListener().';
        }

        eventOff = eventOff.bind(events);

        for (i = 0; i < this._config.events.length; i++) {
            for (j = 0; j < this._eventHandlers.length; j++) {
                eventOff(this._config.events[i], this._eventHandlers[j]);
            }
        }
    };

    /**
     * Monitors the DOM and reports when an application is either idle or active.
     * @param fnIdle {function} A callback for when the application is idle.
     * @param [fnActive] {function} A callback for when the application is active.
     * @param [interval] {number} The number of milliseconds to wait until the application is considered idle. The default is 2,000 milliseconds.
     * @returns {SetIdle} An instance of the SetIdle class which allows for stopping and starting the event monitoring.
     */
    function setIdle(fnIdle, fnActive, interval) {

        // if the second callback is left out...
        if (!interval && fnActive && typeof fnActive !== 'function' && !isNaN(fnActive) && isFinite(fnActive)) {
            interval = fnActive;
        }

        interval = interval || defaultConfig.interval;

        var idle = new SetIdle(new SetIdle.DOMEventEmitter());

        idle.start(fnIdle, fnActive, {
            interval: interval,
            events: defaultConfig.events
        });

        return idle;
    }

    /**
     * Stops setIdle monitoring.
     * @param idle An instance of the SetIdle class returned by setIdle().
     */
    function clearIdle(idle) {
        idle.stop();
    }

    // check for RequireJS
    if(typeof define === "function" && define.amd) {
        define(["setidle"], SetIdle);
    }

    // check for CommonJS
    else if(typeof module === "object" && module.exports) {
        module.exports = SetIdle;
    }

    // check for browser.
    else if (window) {

        // set up simple functions.
        window.setIdle = setIdle;
        window.clearIdle = clearIdle;

        window.SetIdle = SetIdle;
    }

    else {
        throw 'Error: No browser or module system detected!';
    }

})(window);