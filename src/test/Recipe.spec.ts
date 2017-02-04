require('source-map-support').install();
import * as bakery from '../index';
import LoopbackModelMock from './LoopbackModelMock';

import * as chai from 'chai';
import * as sinon from 'sinon';
var expect: Chai.ExpectStatic = chai.expect;

describe('Recipe', () => {
  var model;

  beforeEach(() => {
    model = new LoopbackModelMock();
    sinon.stub(model, 'create', model.create);
  });

  describe('make', () => {

    it('should create a new model with the passed attributes', async () => {
      let recipe = bakery.Recipe(model);
      await recipe({name: 'Steven', email: 'steven@mail.test'});
      sinon.assert.alwaysCalledWithExactly(model.create, {name: 'Steven', email: 'steven@mail.test'}, sinon.match.func);
    });

  });

});