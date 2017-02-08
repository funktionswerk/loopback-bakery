require('source-map-support').install();
import * as bakery from '../index';
import LoopbackModelMock from './LoopbackModelMock';

import * as chai from 'chai';
import * as sinon from 'sinon';
var expect: Chai.ExpectStatic = chai.expect;

describe('bakery', () => {
  var model;

  var createModelMock = () => {
    let model = new LoopbackModelMock();
    sinon.stub(model, 'create', model.create);
    sinon.stub(model, 'findOrCreate', model.findOrCreate);
    return model;
  }

  beforeEach(() => {
    model = createModelMock();
    model.create.data = {id: 5};
  });

  describe('Recipe', () => {

    it('should create a new record with the passed attributes', async () => {
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
      model.definition.name = 'User';
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

  describe('UserRecipe', () => {
    var userModel;
    var roleModel;
    var roleRecord;

    beforeEach(() => {
      userModel = createModelMock();
      roleModel = createModelMock();
      roleRecord = {
        principals: {
          create: (data, cb) => {
            cb(roleRecord.principals.create.error, roleRecord.principals.create.data);
          }
        }
      };
      sinon.stub(roleRecord.principals, 'create', roleRecord.principals.create);
      roleModel.findOrCreate.data = roleRecord;
      userModel.create.data = {id: 15};
    });

    it('should create a new user record with the passed attributes', async () => {
      let recipe = bakery.UserRecipe(userModel);
      const record = await recipe({name: 'Steven', email: 'steven@mail.test'});
      sinon.assert.alwaysCalledWithExactly(userModel.create, {name: 'Steven', email: 'steven@mail.test'}, sinon.match.func);
      expect(record.id).to.equal(15);
      expect(record.name).to.equal('Steven');
      expect(record.email).to.equal('steven@mail.test');
    });

    it('should create a new user role principal', async () => {
      let recipe = bakery.UserRecipe(userModel).withRole('admin', roleModel);
      const record = await recipe({name: 'Steven', email: 'steven@mail.test'});
      sinon.assert.alwaysCalledWithExactly(roleModel.findOrCreate, {where: {name: 'admin'}}, {name: 'admin'}, sinon.match.func);
      sinon.assert.alwaysCalledWithExactly(roleRecord.principals.create, {principalId: 15, principalType: 'User'}, sinon.match.func);
    });

    it('should fail if creating the role record', async () => {
      let caughtError;
      roleModel.findOrCreate.error = new Error('Create role failed');
      let recipe = bakery.UserRecipe(userModel).withRole('admin', roleModel);
      try {
        const record = await recipe({name: 'Steven', email: 'steven@mail.test'});
      }
      catch(err) {
        caughtError = err;
      }
      expect(caughtError.message).to.equal('Create role failed');
    });

    it('should fail if creating the principal record failed', async () => {
      let caughtError;
      roleRecord.principals.create.error = new Error('Create principal failed');
      let recipe = bakery.UserRecipe(userModel).withRole('admin', roleModel);
      try {
        const record = await recipe({name: 'Steven', email: 'steven@mail.test'});
      }
      catch(err) {
        caughtError = err;
      }
      expect(caughtError.message).to.equal('Create principal failed');
    });

  });

});
