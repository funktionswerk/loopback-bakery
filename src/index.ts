
export function Recipe(model) {
  return function(attributes): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      model.create(attributes, (err: Error, model: any) => {
        resolve(model);
      });
    });
  }
}