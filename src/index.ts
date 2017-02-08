import * as async from 'async';

var globalLoggingFunc: (msg: string) => void;

export function withLogging(loggingFunc: (msg: string) => void) {
  globalLoggingFunc = loggingFunc;
  return this;
}

export function Recipe(model, defaultAttributes?: any) {
  return function(overrideAttributes): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      const attributes = { ...defaultAttributes, ...overrideAttributes};
      try {
        const resolvedAttributes = await resolveAttributes(attributes);
        model.create(resolvedAttributes, (err: Error, createdRecord: any) => {
          if (err) {
            if (globalLoggingFunc) {
              globalLoggingFunc(`${err}`)
            }
            return reject(err);
          }
          if (globalLoggingFunc) {
            globalLoggingFunc(`Created ${model.definition.name} with attributes ${JSON.stringify(resolvedAttributes)}`);
          }
          return resolve(createdRecord);
        });
      }
      catch(err) {
        reject(err);
      }
    });
  }
}

export function UserRecipe(userModel, defaultAttributes?: any) {
  var _roleName: string;
  var _roleModel;
  var _rolePrincipalType;
  let userRecipe = Recipe(userModel, defaultAttributes);
  let recipe: any = async(overrideAttributes): Promise<any> => {
    if (!_roleName) {
      return userRecipe(overrideAttributes);
    }
    const roleRecord = await findOrCreateRole(_roleModel, _roleName);
    let userRecord = await userRecipe(overrideAttributes);
    return new Promise<any>((resolve, reject) => {
      roleRecord.principals.create({
        principalType: _rolePrincipalType,
        principalId: userRecord.id
      }, (err: Error, record): void => {
        if (err) {
          return reject(err);
        }
        return resolve(record);
      });
    });
  }
  recipe.withRole = (roleName: string, roleModel, rolePrincipalType = 'User') => {
    _roleName = roleName;
    _roleModel = roleModel;
    _rolePrincipalType = rolePrincipalType;
    return recipe;
  }
  return recipe;
}

function findOrCreateRole(roleModel, roleName: string): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    roleModel.findOrCreate({
      where: {
        name: roleName
      }
    },(err: Error, roleRecord): void => {
      if (err) {
        return reject(err);
      }
      return resolve(roleRecord);
    });
  });
}

function resolveAttributes(attributes): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    let attrKeys = [];
    for (var attrKey in attributes) {
      if (attributes.hasOwnProperty(attrKey)) {
        attrKeys.push(attrKey);
      }
    }
    let resolvedAttributes: any = {};
    async.eachSeries(
      attrKeys,
      (attrKey: string, cb) => {
        if (typeof attributes[attrKey] !== 'function') {
          resolvedAttributes[attrKey] = attributes[attrKey];
          return cb();
        }
        let value = attributes[attrKey]();
        if (!isThennable(value)) {
          resolvedAttributes[attrKey] = value;
          return cb();
        }
        value.then((resolvedValue) => {
          resolvedAttributes[attrKey] = resolvedValue;
          cb();
        }).catch((err) => {
          cb(err);
        });
      },
      (err: Error) => {
        if (err) {
          return reject(err);
        }
        return resolve(resolvedAttributes);
      }
    )
  });
}

function isThennable(val): boolean {
  return val.then && val.catch;
}