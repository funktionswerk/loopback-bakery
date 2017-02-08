
export default class LoopbackModelMock {
  public definition = {
    name: 'ModelMock'
  };

  public create = function(data: any, cb: (err: Error, record: any) => void) {
    process.nextTick(() => {
      cb(this.create.error, {...this.create.data, ...data});
    });
  }

  public findOrCreate = function(filter: any, data, cb: (err: Error, record: any) => void) {
    process.nextTick(() => {
      cb(this.findOrCreate.error, {...this.findOrCreate.data, ...data});
    });
  }


}