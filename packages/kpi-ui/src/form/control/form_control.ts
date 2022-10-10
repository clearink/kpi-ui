/* eslint-disable class-methods-use-this */
import { toArray } from '../../_utils'
import { getIn, setIn } from '../utils'
import type { AnyObject, ArrowFunction, Writable } from '../../_types'
import type { NamePath, PathItem } from '../props'
import type { FormControlStatus, GetIn, InternalFormInstance } from '../internal_props'

const NOOP = () => {}
export const NAME_SEPARATOR = '__KPI_FORM_CONTROL__'
export const HOOK_MARK = '__KPI_FORM_INTERNAL_HOOK__'

export default abstract class FormControl<State = any> {
  // 收集表单数据
  protected _state: State | undefined = undefined

  // 校验状态
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

  protected _forceUpdate = NOOP // 强制视图更新

  constructor(forceUpdate?: () => void) {
    this._forceUpdate = forceUpdate ?? NOOP
  }

  static _getName(path?: NamePath) {
    const paths = toArray(path)
    // log.warn(!paths.length, "name不能为空");
    return paths.join(NAME_SEPARATOR)
  }

  // 校验错误信息
  errors: string[] = []

  setError(error: string | string[]) {
    this.errors = toArray(error)
  }

  // // 设置值
  // setIn(name: NamePath, value: any) {
  //   this._value = setIn(this._value, toArray(name), value)
  // }

  // // V
  // getIn<N extends PathItem>(name: N): GetIn<Value, [N]>
  // getIn<N extends PathItem, M extends [N, ...N[]]>(name: M): GetIn<Value, M>
  // getIn<N extends Readonly<PathItem[]>>(name: N): GetIn<Value, Writable<N>>
  // getIn<N extends PathItem | PathItem[]>(name: N) {
  //   return getIn(this._value, toArray(name))
  // }

  protected _controls = new Map<string, FormControl>()

  addControl(control: FormControl, namePath?: NamePath) {
    const name = FormControl._getName(namePath)
    if (!name) return
    this._controls.set(name, control)
    this.setParent(this)
  }

  removeControl(namePath?: NamePath) {
    const name = FormControl._getName(namePath)
    name && this._controls.delete(name)
  }

  protected _parent?: FormControl = undefined

  get root() {
    let root: FormControl = this
    while (root._parent) root = root._parent
    return root
  }

  setParent(parent?: FormControl) {
    if (!parent) return
    this._parent = parent
  }

  // 依赖数组
  protected _watches = new Set<FormControl>()

  watch(control: FormControl, dependencies: NamePath[] = []) {
    const unwatch: ArrowFunction[] = []
    for (const path of dependencies) {
      const name = FormControl._getName(path)
      const target = this._controls.get(name)
      if (!target) continue
      target._watches.add(control)
      unwatch.push(() => target._watches.delete(control))
    }
    // return unwatch handler
    return () => unwatch.forEach((handler) => handler())
  }

  // 校验数据 校验自身与 controls
  async validate() {
    const validatorList = []
    await Promise.all(validatorList)
  }

  // 校验某一个字段
  async validateAt(name: NamePath) {
    const validatorList = []
    await Promise.all(validatorList)
  }

  // 提交表单
  submit(onFinish: ArrowFunction, onFailed: ArrowFunction) {
    // 校验参数
    // 触发回调
  }
}

/**
 * QA:
 *
 * 1. form 共用一个 control 还是每个字段使用一个呢？
 *
 * 1.1 共用一个 control
 * 优点：比较清晰
 * 缺点：代码难以维护
 *
 * 1.2 每个字段使用一个
 * 优点：容易维护
 * 缺点：代码较多，control.state 不能粗暴的设置为对象了
 */
