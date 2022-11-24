/* eslint-disable class-methods-use-this */
import cloneDeep from 'lodash.clonedeep'
import { hasOwn, toArray } from '../../../_utils'
import { setIn, getIn, deleteIn, mergeValue } from '../../utils/value'
import { isDependent, _getName } from '../../utils/path'

import type { FieldData, FormProps, NamePath } from '../../props'
import type FormFieldControl from '../field_control'
import type { InternalNamePath, WatchCallBack } from '../../internal_props'
import type FormDispatchControl from './dispatch_control'

// 仅负责存储信息(具体逻辑由 FormDispatchControl 实现)
export default class FormStateControl<State = any> {
  /** ==================================================== */
  /** FormProps                                            */
  /** ==================================================== */

  public _props: Partial<FormProps> = {}

  public setFormProps(props: Partial<FormProps>) {
    this._props = props
  }

  /** ==================================================== */
  /** State                                                */
  /** ==================================================== */
  private _state = {} as State

  public setFieldValue(namePath: InternalNamePath, value: any) {
    const prev = this._state

    // namePath 不合法
    if (!_getName(namePath)) return [prev, prev] as const

    this._state = setIn(this._state, namePath, value)
    return [prev, this._state] as const
  }

  // 设置多个字段值
  public setFieldsData(fields: FieldData[]) {
    const prev = this._state

    this._state = fields.reduce((res, field) => {
      if (!_getName(field.name) || !hasOwn(field, 'value')) {
        return res
      }

      return setIn(res, toArray(field.name), field.value)
    }, this._state)

    return [prev, this._state] as const
  }

  public getFieldValue(namePath: NamePath) {
    const value = getIn(this._state, toArray(namePath))

    return cloneDeep(value)
  }

  public setFieldsValue(state: Partial<State>) {
    const prev = this._state
    this._state = mergeValue(this._state, state)

    return [prev, this._state] as const
  }

  public getFieldsValue(fields: NamePath[] = []) {
    const controls = this.controls(true).filter((control) => {
      if (fields.length === 0) return true

      return fields.some((field) => isDependent(control._name, field, true))
    })

    return controls.reduce((values, { _name: name, _props: props }) => {
      // 不用获取列表项， 可以减小一些开销
      if (props.isListField) return values

      return setIn(values, name, getIn(this._state, name))
    }, {} as State)
  }

  public getFields() {
    return this.controls(true).map((control) => {
      const name = control._name
      const value = this.getFieldValue(name)
      // TODO: 验证 fields 与 onFieldsChange 一起使用时 errors 是否一直为空
      return { ...control.getFieldMeta(), name, value }
    })
  }

  private deleteFieldValue(namePath: NamePath) {
    const paths = toArray(namePath)
    // 路径为空代表删除整个对象，得到 undefined，故此处重置为空对象
    if (paths.length === 0) this._state = {} as State
    else this._state = deleteIn(this._state, paths)
  }

  /** ==================================================== */
  /** InitialValues                                        */
  /** ==================================================== */
  private _initial = {} as Partial<State>

  public setInitialValues(initial?: Partial<State>) {
    this._initial = initial || {}
  }

  public getInitialValue(name: NamePath) {
    const value = getIn(this._initial, toArray(name))

    return cloneDeep(value)
  }

  /** ==================================================== */
  /** FormFieldControls                                    */
  /** ==================================================== */
  public _controls = new Map<string, Set<FormFieldControl>>()

  public controls(pure = false) {
    const controls = [...this._controls.values()].reduce(
      (res, set) => res.concat([...set.values()]),
      [] as FormFieldControl[]
    )

    if (!pure) return controls

    return controls.filter((control) => control._key)
  }

  // 注册字段
  public registerField(control: FormFieldControl, dispatch: FormDispatchControl) {
    const { _key: key, _name: name } = control

    const cached = this._controls.get(key) ?? new Set<FormFieldControl>()
    this._controls.set(key, cached.add(control))

    dispatch.ensureInitialized(control)

    // 取消注册， 清除副作用
    return ($preserve?: boolean) => {
      const preserve = $preserve ?? this._props.preserve ?? true

      cached.delete(control)

      cached.size === 0 && this._controls.delete(key)

      // 不保留数据 && name 合法 && 没有同名字段
      if (!preserve && key && !cached.size) {
        this.deleteFieldValue(name)
      }
    }
  }

  /** ==================================================== */
  /** Dependencies                                         */
  /** ==================================================== */
  // 字段依赖 当数据变更时就会重新校验相应的字段
  private _dependencies = new Map<string, Set<string>>()

  public findImplicates(key: string) {
    const init = [] as FormFieldControl[]
    const dependencies = this._dependencies.get(key)

    if (!dependencies) return init

    return [...dependencies.keys()].reduce((res, fieldKey) => {
      const controls = this._controls.get(fieldKey)

      if (!controls) return res

      return res.concat([...controls.values()])
    }, init)
  }

  // 订阅对应的字段变更，并通知相应的 control
  public subscribe(control: FormFieldControl, dependencies: NamePath[] = []) {
    const fieldKey = control._key
    if (!fieldKey) return () => {} // 为空不进行操作

    const cancels = dependencies.map((dependency) => {
      // 被依赖项
      const depKey = _getName(dependency)

      if (!depKey || fieldKey === depKey) return () => {}

      const cached = this._dependencies.get(depKey) ?? new Set<string>()
      this._dependencies.set(depKey, cached.add(fieldKey))

      return () => {
        cached.delete(fieldKey)
        cached.size === 0 && this._dependencies.delete(depKey)
      }
    })
    return () => cancels.forEach((cancel) => cancel())
  }

  /** ==================================================== */
  /** Watch                                                */
  /** ==================================================== */
  // 实现 useWatch 功能
  private _watchList: { namePath: NamePath; callback: WatchCallBack<State> }[] = []

  public registerWatch(namePath: NamePath, callback: WatchCallBack) {
    this._watchList.push({ namePath, callback })

    return () => {
      this._watchList = this._watchList.filter(({ callback: fn }) => fn !== callback)
    }
  }
}
