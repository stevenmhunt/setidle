
module.exports = function MockEmitter (events) {

    this.on = function (event) {
        events.push(event);
    };

    this.off = function (event) {
        var index = events.indexOf(event);
        if (index >= 0) {
            events = events.splice(index, 1);
        }
    };
};