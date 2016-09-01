/*****************************
 * setIdle
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
        interval: 2000,

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
            // watch for document resize, or the DOM getting rebuilt (I.E. React)
            'resize',
            'DOMSubtreeModified'
        ]
    };

    /**
     * An event emitter wrapper for DOM events.
     * This is helpful so that the actual code only cares about working with event emitters.
     * @constructor
     */
    function WindowEventEmitter (element) {

        element = element || window;

        this.getElement = function () { return element; };
    }

    /**
     * Called when an event is registered.
     * @param event {string} The event to register.
     * @param fn {function} The event listener to register.
     */
    WindowEventEmitter.prototype.on = function (event, fn) {
        this.getElement().addEventListener(event, fn, false);
    };

    /**
     * Called when an event is removed.
     * @param event {string} The event to remove.
     * @param fn {function} The event listener to remove.
     */
    WindowEventEmitter.prototype.removeListener =  function (event, fn) {
        this.getElement().removeEventListener(event, fn);
    };

    /**
     * Monitors and reports on whether the given event emitted is idle.
     * @param emitter An event emitter.
     * @constructor
     */
    function SetIdle(emitter) {
        this._isRunning = false;
        this.getEvents = function () {  return emitter; };
    }

    SetIdle.WindowEventEmitter = WindowEventEmitter;

    /**
     * Starts the event monitoring if not started yet.
     * @param config
     * @param fnIdle
     * @param fnActive
     */
    SetIdle.prototype.start = function (config, fnIdle, fnActive) {

        // use the default configuration if none is provided.
        config = config || defaultConfig;
        this._config = config;

        this._eventHandlers = this._eventHandlers || [];

        var prevTimeout = null;

        /**
         * Handles the event by resetting the idle timer.
         * @param e Event object.
         */
        function handleEvent(e) {

            // clear the previously running timeout.
            if (prevTimeout) {
                clearTimeout(prevTimeout);
            }
            else if (fnActive && typeof fnActive === 'function') {
                // if there was no running timeout, then report that the application has become active.
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

        for (var i = 0; i < config.events.length; i++) {
            this.getEvents().on(config.events[i], handleEvent);
        }

        this._eventHandlers.push(handleEvent);

        this._isRunning = true;
    };

    SetIdle.prototype.stop = function () {

        var i = 0, j = 0;

        for (i = 0; i < this._config.events.length; i++) {
            for (j = 0; j < this._eventHandlers.length; j++) {
                this.getEvents().removeListener(this._config.events[i], this._eventHandlers[j]);
            }
        }

        this._isRunning = false;
    };

    /**
     *
     * @param fnIdle
     * @param [fnActive]
     * @param [interval]
     * @returns {SetIdle}
     */
    function setIdle(fnIdle, fnActive, interval) {

        // if the second callback is left out...
        if (!interval && fnActive && typeof fnActive !== 'function' && !isNaN(fnActive) && isFinite(fnActive)) {
            interval = fnActive;
        }

        interval = interval || defaultConfig.interval;

        var idle = new SetIdle(new SetIdle.WindowEventEmitter());

        idle.start({
            interval: interval,
            events: defaultConfig.events
        }, fnIdle, fnActive);

        return idle;
    }

    /**
     *
     * @param idle
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
    // we're in an ordinary browser apparently.
    else {
        window.setIdle = setIdle;
        window.clearIdle = clearIdle;

        window.SetIdle = SetIdle;
    }

})(window);