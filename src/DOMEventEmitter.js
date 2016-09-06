
/**
 * Pre-configured observers that can be passed into the constructor.
 */
var defaultDOMObservers = {

    /**
     * Observes DOM mutation events.
     */
    mutated: {

        /**
         * Starts the given observer.
         * @param element The element to monitor.
         * @param callback The callback to register.
         * @returns {MutationObserver} The mutation observer.
         */
        on: function (element, callback) {
            var observer = new MutationObserver(callback);
            observer.observe(element, {
                childList: true, attributes: true, attributeOldValue: false, characterData: false,
                subtree: true, characterDataOldValue: false, attributeFilter: [] });
            return observer;
        },

        /**
         * Stops the given observer.
         * @param observer {MutationObserver} The mutation observer to stop.
         */
        off: function (observer) {
            observer.disconnect();
        }
    }
};

/**
 * @private
 * @instance
 * Registers an observer with the emitter.
 * @param observer
 * @param name
 * @param element
 */
function registerObserver(observer, name, element) {

    this["_on" + name] = []; // set up event handler list.
    this._observerNames.push(name); // store event names.

    // initialize the observer and handle registered events when the callback is triggered.
    this["_" + name] = observer.on(element, function () {

        // iterate through and call the registered event handlers.
        for (var i = 0; i < this["_on" + name].length; i++) {
            this["_on" + name][i]();
        }
    }.bind(this));
}

/**
 * An event emitter wrapper for DOM events.
 * This is helpful so that SetIdle only cares about working with event emitters in general.
 * @param [element] The element to monitor for events. The default is the window object.
 * @param [observers] A list of observers to register for supporting virtual DOM events.
 * @constructor
 */
function DOMEventEmitter (element, observers) {

    element = element || document;

    /**
     * Retrieves the HTML element being wrapped.
     * @returns The HTML element being wrapped.
     */
    this.getElement = function () { return element; };

    observers = observers || {
        mutated: defaultDOMObservers.mutated
    };

    this._observerNames = [];
    this._observers = observers;

    // iterate through the given observers...
    for (var observer in observers) {
        if (observers.hasOwnProperty(observer)) {
            registerObserver.call(this, observers[observer], observer, element);
        }
    }
}

/**
 * Pre-configured observers that can be passed into the constructor.
 */
DOMEventEmitter.observers = defaultDOMObservers;

/**
 * Disconnects all running observers.
 */
DOMEventEmitter.disconnect = function () {

    // iterate through the observers...
    for (var i = 0; i < this._observerNames.length; i++) {

        // call the off handler for the observer type.
        var observer = this['_' + this._observerNames[i]];
        if (observer) {
            this._observers[this._observerNames[i]].off(observer);
        }
    }
};

/**
 * Called when an event is registered.
 * @param event {string} The event to register.
 * @param fn {function} The event listener to register.
 */
DOMEventEmitter.prototype.on = function (event, fn) {

    if (this._observerNames.indexOf(event) >= 0) {
        this["_on" + event].push(fn);
    }
    else {
        this.getElement()
            .addEventListener(event, fn, false);
    }
};

/**
 * Called when an event is removed.
 * @param event {string} The event to remove.
 * @param fn {function} The event listener to remove.
 */
DOMEventEmitter.prototype.off =  function (event, fn) {

    if (this._observerNames.indexOf(event) >= 0) {

        // get the event handlers array for the event.
        var handlers = this["_on" + event],
            index = handlers.indexOf(fn);

        // remove the given function from the list.
        if (index >= 0) {
            handlers.splice(index, 1);
        }
    }
    else {
        this.getElement()
            .removeEventListener(event, fn);
    }
};