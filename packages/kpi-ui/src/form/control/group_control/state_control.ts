/* eslint-disable class-methods-use-this */
import cloneDeep from 'lodash.clonedeep'
import { hasOwn, isBoolean, isFunction, isUndefined, logger, toArray } from '../../../_utils'
import { setIn, getIn, deleteIn, mergeValue } from '../../utils/value'
import { getNormalizePathList, hasIntersection, isDependent, _getName } from '../../utils/path'
import { InvalidField } from '../field_control'

import type FormFieldControl from '../field_control'
import type FormDispatchControl from './dispatch_control'
import type { FieldData, FormProps, NamePath } from '../../props'
import type { ControlsByNameReturn, FieldMeta, WatchCallBack } from '../../internal_props'

// 仅负责存储信息(具体逻辑由 FormDispatchControl 实现)
export default class FormStateControl<State = any> {
  /** ==================================================== */
  /** FormProps                                            */
  /** ==================================================== */

  public _props: Partial<FormProps> = {}

  public setFormProps = (props: Partial<FormProps>) => {
    this._props = props
  }

  public get formChildrenIsFunctional() {
    return isFunction(this._props.children)
  }

  /** ==================================================== */
  /** State                                                */
  /** ==================================================== */
  private _state = {} as State

  public setFieldValue = (namePath: NamePath, value: any) => {
    const prev = this._state
    const path = toArray(namePath)

    // namePath 不合法
    if (!path.length) return [prev, prev] as const

    this._state = setIn(this._state, path, value)
    return [prev, this._state] as const
  }

  // 设置多个字段值
  public setFieldsData = (fields: FieldData[]) => {
    const prev = this._state

    fields.forEach((field) => {
      const { name, value } = field

      hasOwn(field, 'value') && this.setFieldValue(name, value)
    })

    return [prev, this._state] as const
  }

  public getFieldValue = (namePath: NamePath) => {
    const value = getIn(this._state, toArray(namePath))

    return cloneDeep(value)
  }

  public setFieldsValue = (state: Partial<State>) => {
    const prev = this._state
    this._state = mergeValue(this._state, state)

    return [prev, this._state] as const
  }

  public getFieldsValue = (fields?: NamePath[] | true) => {
    if (fields === true) return this._state

    const nameList = isBoolean(fields) ? [] : fields
    const controls = this.getControlsByName(false, nameList)

    return controls.reduce((values, field) => {
      if (InvalidField.isInvalid(field)) {
        const { name } = field
        return setIn(values, name, getIn(this._state, name))
      }

      const { _name: name, _props: props } = field
      // 该场景时不用获取列表项，可以减小一些开销
      if (!fields && props.isListField) return values

      return setIn(values, name, getIn(this._state, name))
    }, {} as State)
  }

  public getFields = (nameList?: NamePath[]) => {
    return this.getControlsByName(true, nameList).map((control) => {
      const name = control._name
      const value = this.getFieldValue(name)
      // TODO: 验证 fields 与 onFieldsChange 一起使用时 errors 是否一直为空
      return { ...control.getFieldMeta(), name, value }
    })
  }

  private deleteFieldValue = (namePath: NamePath) => {
    const prev = this._state
    const path = toArray(namePath)

    // 路径为空代表删除整个对象，得到 undefined，故此处重置为空对象
    if (path.length === 0) this._state = {} as State
    else this._state = deleteIn(this._state, path)

    return [prev, this._state]
  }

  /** ==================================================== */
  /** InitialValues                                        */
  /** ==================================================== */
  private _initial = {} as Partial<State>

  public setInitialValues = (initial?: Partial<State>) => {
    this._initial = initial || {}
  }

  public getInitialValue = (name: NamePath) => {
    const value = getIn(this._initial, toArray(name))

    return cloneDeep(value)
  }

  // 确保设置了字段初始值
  public ensureInitialized = (control: FormFieldControl) => {
    const namePath = control._name
    const $initialValue = control._props.initialValue
    const prev = this._state

    if (!control._key) return [prev, prev]
    if (!isUndefined(this.getFieldValue(namePath))) return [prev, prev]

    const topInitial = this.getInitialValue(namePath)
    const initialValue = isUndefined(topInitial) ? $initialValue : topInitial

    const invalid = !isUndefined(topInitial) && !isUndefined($initialValue)
    logger.warn(invalid, "form has initialValues, don't set field initialValue")

    if (isUndefined(initialValue)) return [prev, prev]

    return this.setFieldValue(namePath, initialValue)
  }

  // 初始化表单数据
  public initialFieldsValue = (nameList?: NamePath[]) => {
    const prev = this._state

    // 不传nameList则清空state
    if (!nameList) return this.deleteFieldValue([])

    nameList.forEach((name) => {
      const path = toArray(name)
      path.length && this.deleteFieldValue(path)
    })

    return [prev, this._state] as const
  }

  /** ==================================================== */
  /** FormFieldControls                                    */
  /** ==================================================== */
  private _controls = new Map<string, Set<FormFieldControl>>()

  // 获取字段,根据参数判断是否需要去除没有name的字段
  public getControls = (pure = false) => {
    const controls = [...this._controls.values()].reduce(
      (res, set) => res.concat([...set.values()]),
      [] as FormFieldControl[]
    )

    if (!pure) return controls

    return controls.filter((control) => control._key)
  }

  // 获取相同name的字段,不传参数认为获取全部有name的字段
  public getControlsByName = <R extends boolean>(
    removeInvalid: R,
    nameList?: NamePath[]
  ): ControlsByNameReturn<R> => {
    if (!nameList) return this.getControls(true)

    return nameList.reduce((res, path) => {
      const key = _getName(path)

      if (!this._controls.has(key)) {
        if (removeInvalid) return res
        return res.concat(new InvalidField(toArray(path)))
      }

      const controls = this._controls.get(key)!

      return res.concat(...controls.values())
    }, [] as any[])
  }

  // 获取校验字段
  public getValidateControls = (nameList?: NamePath[]) => {
    if (!nameList) return this.getControls()

    const pureControls = this.getControls(true)

    const controls = pureControls.reduce((set, control) => {
      nameList.some((name) => {
        return isDependent(control._name, name)
      }) && set.add(control)

      return set
    }, new Set<FormFieldControl>())

    return [...controls.keys()]
  }

  // 注册字段
  public registerField = (control: FormFieldControl, dispatch: FormDispatchControl) => {
    const { _key: key, _name: name } = control

    const cached = this._controls.get(key) ?? new Set<FormFieldControl>()

    this._controls.set(key, cached.add(control.setParent(this)))

    dispatch.dispatch({ type: 'registerField', control })

    // 取消注册， 清除副作用
    return () => {
      const preserve = control._props.preserve ?? this._props.preserve ?? true

      cached.delete(control)

      cached.size === 0 && this._controls.delete(key)

      // 不保留数据 && name 合法 && 没有同名字段
      if (!preserve && key && !cached.size) {
        this.deleteFieldValue(name)
      }
    }
  }

  /** ==================================================== */
  /** Dependencies 获取依赖字段                              */
  /** ==================================================== */
  public findDependencies = (updateControls: FormFieldControl[]) => {
    if (!updateControls.length) return [] as FormFieldControl[]

    // 格式化路径列表
    const updateNameList = getNormalizePathList(updateControls.map(({ _name }) => _name))

    // 获取依赖的字段
    const dependentControls = this.getControls().reduce((set, control) => {
      const { dependencies = [] } = control._props

      const dependentList = getNormalizePathList(dependencies)

      if (hasIntersection(updateNameList, dependentList)) set.add(control)

      return set
    }, new Set<FormFieldControl>())

    return [...dependentControls.keys()]
  }

  /** ==================================================== */
  /** Watch                                                */
  /** ==================================================== */
  // 实现 useWatch 功能
  private _watchList: { namePath: NamePath; callback: WatchCallBack<State> }[] = []

  public registerWatch = (namePath: NamePath, callback: WatchCallBack) => {
    this._watchList.push({ namePath, callback })

    return () => {
      this._watchList = this._watchList.filter(({ callback: fn }) => fn !== callback)
    }
  }

  // 设置 FormField 的 meta 属性
  public setFieldMeta = (namePath: NamePath, meta: Partial<FieldMeta>) => {
    // 由于涉及到隐式依赖，所以此处需要遍历全部 controls
    const key = _getName(namePath)
    for (const control of this.getControls(true)) {
      if (!isDependent(control._name, namePath)) continue

      if (control._key === key) control.setFieldMeta(meta)
      else control.setFieldMeta({ dirty: meta.dirty, touched: meta.touched })
    }
  }

  public getFieldError = (namePath: NamePath) => {
    const controls = this.getFieldsError([namePath])
    return controls[0].errors
  }

  public getFieldsError = (nameList?: NamePath[]) => {
    return this.getControlsByName(false, nameList).map((control) => {
      if (InvalidField.isInvalid(control)) {
        const { name } = control
        return { name, errors: [], warnings: [] }
      }
      return {
        name: control._name,
        errors: control._errors,
        warnings: [],
      }
    })
  }
}
