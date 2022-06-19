type AddCallback<C extends Constant, R> = (constant: C) => R
export class Constant {
  public add<R extends object>(fn: AddCallback<this, R>) {
    return Object.assign(this, fn(this))
  }
}
