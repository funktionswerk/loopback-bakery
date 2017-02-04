
export default class LoopbackModelMock {
  public nextId: number;

  public create(data: any, cb: (err: Error, record: any) => void) {
    process.nextTick(() => {
      cb(null, {id: this.nextId, ...data});
    });
  }

}