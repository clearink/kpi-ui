/* eslint-disable max-classes-per-file */
/* eslint-disable class-methods-use-this */

import { toArray } from '../_utils'
import type { ArrowFunction, Writable } from '../_types'
import type { GetIn } from './internal_props'
import type { NamePath, PathItem } from './props'
import { getIn, setIn } from './utils'

const NOOP = () => {}
export const NAME_SEPARATOR = '__KPI_FORM_CONTROL__'
export const HOOK_MARK = '__KPI_FORM_INTERNAL_HOOK__'

/** 收集表单数据 */
export class FormStore<State = any> {
  _state = {} as State

  // 设置值
  setIn(name: NamePath, value: any) {
    this._state = setIn(this._state, toArray(name), value)
  }

  // 获取值
  getIn<N extends PathItem>(name: N): GetIn<State, [N]>
  getIn<N extends PathItem, M extends [N, ...N[]]>(name: M): GetIn<State, M>
  getIn<N extends Readonly<PathItem[]>>(name: N): GetIn<State, Writable<N>>
  getIn<N extends PathItem | PathItem[]>(name: N) {
    return getIn(this._state, toArray(name))
  }
}

/**
 * 所以还是需要每个Form.Item维护一个control 但是不会收集数据了，都提交给FormGroupControl
 * _controls 也要变成数组以保证同名Form.Item
 * 校验状态放在哪里?
 * */
export default class FormControl<State = any> extends FormStore<State> {
  // 收集表单数据

  constructor(private forceUpdate: () => void) {
    super()
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

  protected _controls: { name: NamePath; control: FormControl }[] = []

  protected _parent?: FormControl = undefined

  // 因为只有一层 所以不太需要该属性
  // get root() {
  //   let root: FormControl = this
  //   while (root._parent) root = root._parent
  //   return root
  // }

  /** 注册字段  */
  register(control: FormControl, namePath?: NamePath) {
    const name = FormControl._getName(namePath)
    if (!name) return NOOP
    this._controls.push({ name: namePath!, control })
    return () => {
      // TODO: 取消注册时是否要清空值呢？
      this._controls.filter(({ control: _control }) => _control !== control)
    }
  }

  // 被依赖的 control this._state 变更时需要通知到对方
  protected _listeners = new Set<FormControl>()

  listen(dependencies: NamePath[] = []) {
    // if (!this._parent) return NOOP
    const cancel: ArrowFunction[] = []
    // for (const path of dependencies) {
    //   const name = FormControl._getName(path)
    //   const target = this._parent._controls.get(name)
    //   if (!target) continue
    //   target._listeners.add(this)
    //   cancel.push(() => target._listeners.delete(this))
    // }
    // return unwatch handler
    return () => cancel.forEach((handler) => handler())
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
