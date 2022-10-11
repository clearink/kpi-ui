/* eslint-disable class-methods-use-this */

import FormControl, { HOOK_MARK } from './form_control'
import { deleteIn, getIn, setIn } from '../utils'
import toArray from '../../_utils/to_array'

import type { NamePath, PathItem } from '../props'
import type { GetIn, InternalFormInstance } from '../internal_props'
import type { ArrowFunction, Writable } from '../../_types'

export default class FormGroupControl<State = any> extends FormControl {
  // TODO: 待优化 userForm 返回值
  get inject(): InternalFormInstance<State> {
    return {
      state: this._state,
      validate: this.validate,
      submit: this.submit,
      resetFields: this.resetFields,
      getInternalHooks: this.getInternalHooks,
    }
  }

  /** ==================================================== */
  /** FormStore                                            */
  /** ==================================================== */
  private _state = {} as State

  setState() {
    this._state = Object.values(this._controls).reduce((res, { path, control }) => {
      return setIn(res, toArray(path), (control as any).state) as State
    }, {} as State)
  }

  // 设置值
  setIn(name: NamePath, value: any) {
    // 执行监听事件
    this._state = setIn(this._state, toArray(name), value)
  }

  // 获取值
  getIn<N extends PathItem>(name: N): GetIn<State, [N]>
  getIn<N extends PathItem, M extends [N, ...N[]]>(name: M): GetIn<State, M>
  getIn<N extends Readonly<PathItem[]>>(name: N): GetIn<State, Writable<N>>
  getIn<N extends PathItem | PathItem[]>(name: N) {
    return getIn(this._state, toArray(name))
  }

  deleteIn(name?: NamePath) {
    this._state = deleteIn(this._state, toArray(name))
  }

  // 字段删除时是否保留数据
  private preserve = true

  setPreserve(preserve = true) {
    this.preserve = preserve
  }

  private getInternalHooks(secret: string) {
    return secret === HOOK_MARK ? this : undefined
  }

  private resetFields() {}

  private _controls: Record<string, { control: FormControl; path: NamePath }> = {}

  getControl(name: string) {
    return this._controls[name]
  }

  /** 注册子控件  */
  register(control: FormControl, namePath?: NamePath) {
    // 避免重复注册
    const name = FormControl._getName(namePath)
    if (!name) return () => {}
    if (!this._controls[name]) {
      this._controls[name] = { control, path: namePath! }
    }
    return (preserve?: boolean) => {
      const $preserve = preserve ?? this.preserve
      if (!$preserve) this.deleteIn(name)
      delete this._controls[name]
    }
  }

  // 提交表单
  submit(onFinish?: ArrowFunction, onFailed?: ArrowFunction) {
    // 校验参数
    // 触发回调
  }
}
