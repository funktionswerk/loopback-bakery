require('source-map-support').install();
import * as bakery from '../index';
import LoopbackModelMock from './LoopbackModelMock';

import * as chai from 'chai';
import * as sinon from 'sinon';
var expect: Chai.ExpectStatic = chai.expect;

describe('Recipe', () => {
  var model;
  var modelMock;

  beforeEach(() => {
    model = new LoopbackModelMock();
    modelMock = sinon.mock(model);
  });

  afterEach(() => {
    modelMock.verify();
  });

  describe('make', () => {

    it('should create a new model with the passed attributes', () => {
      modelMock.expects('create').once().returns(42);
      let recipe = bakery.Recipe(model);
      recipe({
        name: 'Steven',
        email: 'steven@mail.test'
      });
    });

  });

});