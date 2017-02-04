
export function Recipe(model, defaultAttributes?: any) {
  return function(overrideAttributes): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const attributes = { ...defaultAttributes, ...overrideAttributes};
      model.create(attributes, (err: Error, model: any) => {
        resolve(model);
      });
    });
  }
}