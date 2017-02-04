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
        resolvedAttributes[attrKey] = attributes[attrKey]();
        return cb();
      },
      (err: Error) => {
        resolve(resolvedAttributes);
      }
    )
  });
}