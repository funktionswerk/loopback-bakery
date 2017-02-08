
export default class LoopbackModelMock {
  public settings = {
    name: 'ModelMock'
  };
  public nextId: number;

  public create = function(data: any, cb: (err: Error, record: any) => void) {
    process.nextTick(() => {
      cb(this.create.error, {id: this.nextId, ...data});
    });
  }

}