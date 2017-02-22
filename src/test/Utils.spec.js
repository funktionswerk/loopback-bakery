"use strict";
require('source-map-support').install();
var bakery = require("../index");
var chai = require("chai");
var expect = chai.expect;
describe('bakery', function () {
    var model;
    describe('cycle', function () {
        it('should rotate the elements of an array and return the current element', function () {
            var cycleStrings = bakery.cycle(['ONE', 'TWO', 'THREE']);
            expect(cycleStrings()).to.equal('ONE');
            expect(cycleStrings()).to.equal('TWO');
            expect(cycleStrings()).to.equal('THREE');
            expect(cycleStrings()).to.equal('ONE');
            expect(cycleStrings()).to.equal('TWO');
            expect(cycleStrings()).to.equal('THREE');
        });
    });
});
//# sourceMappingURL=Utils.spec.js.map