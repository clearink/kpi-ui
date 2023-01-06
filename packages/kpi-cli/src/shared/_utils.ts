export class Constant {
  public add<R extends object>(fn: (constant: this) => R) {
    return Object.assign(this, fn(this))
  }
}
