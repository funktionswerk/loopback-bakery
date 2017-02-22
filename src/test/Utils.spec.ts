require('source-map-support').install();
import * as bakery from '../index';

import * as chai from 'chai';
import * as sinon from 'sinon';
var expect: Chai.ExpectStatic = chai.expect;

describe('bakery', () => {
  var model;

  describe('cycle', () => {

    it('should rotate the elements of an array and return the current element', () => {
      let cycleStrings = bakery.cycle(['ONE', 'TWO', 'THREE']);
      expect(cycleStrings()).to.equal('ONE');
      expect(cycleStrings()).to.equal('TWO');
      expect(cycleStrings()).to.equal('THREE');
      expect(cycleStrings()).to.equal('ONE');
      expect(cycleStrings()).to.equal('TWO');
      expect(cycleStrings()).to.equal('THREE');
    });

  });

});