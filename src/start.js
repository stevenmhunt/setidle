
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