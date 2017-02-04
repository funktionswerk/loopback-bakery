import * as async from 'async';

export function Recipe(model, defaultAttributes?: any) {
  return function(overrideAttributes): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      const attributes = { ...defaultAttributes, ...overrideAttributes};
      const resolvedAttributes = await resolveAttributes(attributes);
      model.create(resolvedAttributes, (err: Error, model: any) => {
        resolve(model);
      });
    });
  }
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
        })
      },
      (err: Error) => {
        resolve(resolvedAttributes);
      }
    )
  });
}

function isThennable(val): boolean {
  return val.then && val.catch;
}