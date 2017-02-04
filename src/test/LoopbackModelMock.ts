
export default class LoopbackModelMock {

  public create(data: any, cb: (err: Error, record: any) => void) {
    process.nextTick(() => {
      cb(null, data);
    });
  }

}