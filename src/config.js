
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
        'mutated' // this is a virtual event, we're using MutationObserver under the hood.
    ]
};