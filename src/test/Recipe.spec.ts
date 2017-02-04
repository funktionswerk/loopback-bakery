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
    model.nextId = 5;
  });

  describe('make', () => {

    it('should create a new model with the passed attributes', async () => {
      let recipe = bakery.Recipe(model);
      const record = await recipe({name: 'Steven', email: 'steven@mail.test'});
      sinon.assert.alwaysCalledWithExactly(model.create, {name: 'Steven', email: 'steven@mail.test'}, sinon.match.func);
      expect(record.id).to.equal(5);
      expect(record.name).to.equal('Steven');
      expect(record.email).to.equal('steven@mail.test');
    });

    it('should use default attributes if defined and not overwritten by the make arguments', async () => {
      let recipe = bakery.Recipe(model, {
        name: 'Richard'
      });
      await recipe({email: 'steven@mail.test'});
      sinon.assert.alwaysCalledWithExactly(model.create, {name: 'Richard', email: 'steven@mail.test'}, sinon.match.func);
    });

    it('should NOT use default attributes if defined but overwritten by the make arguments', async () => {
      let recipe = bakery.Recipe(model, {
        name: 'Richard'
      });
      await recipe({name: 'Steven', email: 'steven@mail.test'});
      sinon.assert.alwaysCalledWithExactly(model.create, {name: 'Steven', email: 'steven@mail.test'}, sinon.match.func);
    });

  });

});