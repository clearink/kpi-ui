import type { FormControlStatus } from '../internal_props'

export default class FormStatus {
  constructor(private forceUpdate: () => void) {}

  // 校验状态 交给 Form.Field 维护
  protected _status: FormControlStatus = 'VALID'

  get valid() {
    return this._status === 'VALID'
  }

  get invalid() {
    return this._status === 'INVALID'
  }

  get warning() {
    return this._status === 'WARNING'
  }

  get pending() {
    return this._status === 'PENDING'
  }

  get disabled() {
    return this._status === 'DISABLED'
  }

  get enabled() {
    return this._status !== 'DISABLED'
  }

  protected _touched = false // 以是否触发 blur 事件为准

  get touched() {
    return this._touched
  }

  get untouched() {
    return !this._touched
  }

  setTouched(touched: boolean) {
    this._touched = touched
  }

  protected _pristine = true // 未被更改值则为 true

  get pristine() {
    return this._pristine
  }

  get dirty() {
    return !this._pristine
  }

  setPristine(pristine: boolean) {
    this._pristine = pristine
  }
}
