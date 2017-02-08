require('source-map-support').install();
import * as bakery from '../index';
import LoopbackModelMock from './LoopbackModelMock';

import * as chai from 'chai';
import * as sinon from 'sinon';
var expect: Chai.ExpectStatic = chai.expect;

describe('bakery', () => {
  var model;

  beforeEach(() => {
    model = new LoopbackModelMock();
    sinon.stub(model, 'create', model.create);
    model.nextId = 5;
  });

  describe('Recipe', () => {

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

    it('should allow passing functions to create attribute values', async () => {
      let recipe = bakery.Recipe(model, {
        name: () => {
          return 'Richard';
        }
      });
      await recipe({email: 'steven@mail.test'});
      sinon.assert.alwaysCalledWithExactly(model.create, {name: 'Richard', email: 'steven@mail.test'}, sinon.match.func);
    });

    it('should allow passing functions to create attribute values that return a promise', async () => {
      let recipe = bakery.Recipe(model, {
        name: (): Promise<string> => {
          return new Promise<string>((resolve) => {
            process.nextTick(() => {
              resolve('Richard');
            })
          });
        }
      });
      await recipe({email: 'steven@mail.test'});
      sinon.assert.alwaysCalledWithExactly(model.create, {name: 'Richard', email: 'steven@mail.test'}, sinon.match.func);
    });

    it('should fail if creating the model returned an error', async () => {
      model.create.error = new Error('Creating the model failed');
      let caughtError;
      let recipe = bakery.Recipe(model);
      try {
        const record = await recipe({name: 'Steven', email: 'steven@mail.test'});
      }
      catch(err) {
        caughtError = err;
      }
      expect(caughtError.message).to.equal('Creating the model failed');
    });

    it('should fail if an attribute promise returned an error', async () => {
      let caughtError;
      let recipe = bakery.Recipe(model, {
        name: (): Promise<string> => {
          return new Promise<string>((resolve, reject) => {
            process.nextTick(() => {
              reject(new Error('Promise did not resolve'));
            })
          });
        }
      });
      try {
        const record = await recipe({email: 'steven@mail.test'});
      }
      catch(err) {
        caughtError = err;
      }
      expect(caughtError.message).to.equal('Promise did not resolve');
    });

  });

  describe('withLogging', () => {
    let loggingFunc;
    let recipe;

    beforeEach(() => {
      model.settings.name = 'User';
      loggingFunc = sinon.spy();
      recipe = bakery.withLogging(loggingFunc).Recipe(model);
    });

    it('should allow adding a global logging function and log the created models', async () => {
      const record = await recipe({name: 'Steven', email: 'steven@mail.test'});
      sinon.assert.alwaysCalledWithExactly(loggingFunc, 'Created User with attributes {"name":"Steven","email":"steven@mail.test"}');
    });

    it('should allow log errors through the passed logging function', async () => {
      model.create.error = new Error('Creating the model failed');
      try {
        const record = await recipe({email: 'steven@mail.test'});
      }
      catch(err) {
      }
      sinon.assert.alwaysCalledWithExactly(loggingFunc, 'Error: Creating the model failed');
    });

  });

});
