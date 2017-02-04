
export function Recipe(model) {
  return function(attributes) {
    model.create(attributes, (err: Error, model: any) => {
    });
  }
}