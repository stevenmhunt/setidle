
var expect = require("chai").expect,
    MockEmitter = require('./mocks/MockEmitter'),
    SetIdle = require('../setidle');

describe('SetIdle', function () {

   describe('constructor', function () {

       it('should take no parameters', function () {
           var idle = new SetIdle();
           expect(idle).not.be.null;
       });

       it ('should take an emitter', function () {
           var events = [];
           var idle = new SetIdle(new MockEmitter(events));
           expect(idle).not.be.null;
       });

       it ('should take a random value', function () {
           var events = [];
           var idle = new SetIdle(1000);
           expect(idle).not.be.null;
       });

   })
});