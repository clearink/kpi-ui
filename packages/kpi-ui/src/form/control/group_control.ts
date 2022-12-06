/* eslint-disable max-classes-per-file,class-methods-use-this */
import isEqual from 'react-fast-compare'
import cloneDeep from 'lodash.clonedeep'
import type { MutableRefObject } from 'react'
import { isFunction, hasOwn, isBoolean, isUndefined, logger, toArray } from '../../.internal/utils'
import BaseControl from './base_control'

import { isDependent, _getName } from '../utils/path'

import { setIn, getIn, deleteIn, mergeValue, cloneWithPath } from '../utils/value'
import { InvalidField } from './field_control'

import type FormFieldControl from './field_control'
import type { FieldData, FormProps, NamePath } from '../props'
import type {
  ControlsByNameReturn,
  FieldMeta,
  WatchCallBack,
  InternalFormInstance,
  InternalHookReturn,
  UpdateFieldAction as Action,
  UpdateFieldActionType as ActionType,
} from '../internal_props'

export const HOOK_MARK = '_$_KPI_FORM_HOOK_MARK_$_'

// 部分逻辑耦合太多 ，现在拆开
export default class FormGroupControl<State = any> extends BaseControl {
  $state!: FormStateControl<State>

  $dispatch!: FormDispatchControl<State>

  constructor(_forceUpdate: () => void, mounted: MutableRefObject<boolean>) {
    super(_forceUpdate, mounted)

    this.$state = new FormStateControl<State>(this)

    this.$dispatch = new FormDispatchControl<State>(this)
  }

  /** ==================================================== */
  /** FormProps                                            */
  /** ==================================================== */
  _props: Partial<FormProps> = {}

  setFormProps = (props: Partial<FormProps>) => {
    this._props = props
  }

  get useRenderProps() {
    return isFunction(this._props.children)
  }

  // 向外暴露的函数
  injectForm = (): InternalFormInstance<State> => {
    const { $dispatch, $state } = this

    return {
      getFieldError: $state.getFieldError,
      getFieldsError: $state.getFieldsError,

      setFieldValue: $dispatch.setFieldValue,
      getFieldValue: $state.getFieldValue,

      setFieldsValue: $dispatch.setFieldsValue,
      getFieldsValue: $state.getFieldsValue,

      validateField: $dispatch.validateField,
      validateFields: $dispatch.validateFields,

      submitForm: $dispatch.submitForm,
      resetFields: $dispatch.resetFields,

      isFieldTouched: $dispatch.isFieldTouched,
      isFieldsTouched: $dispatch.isFieldsTouched,

      scrollToField: this.scrollToField,

      /** @ */
      getInternalHooks: this._getInternalHooks,
    }
  }

  // 内部属性
  _getInternalHooks = (secret: string): InternalHookReturn | undefined => {
    const matched = secret === HOOK_MARK

    logger.warn(!matched, '`getInternalHooks` is internal usage. Should not call directly.')

    if (!matched) return undefined

    const { $dispatch, $state } = this

    return {
      setInitialValues: $state.setInitialValues,
      registerField: $dispatch.registerField,
      registerWatch: $state.registerWatch,
      setFieldMeta: $state.setFieldMeta,
      setFields: $dispatch.setFields,
      dispatch: $dispatch.dispatch,
      setFormProps: this.setFormProps,
      registerSubscribe: $state.registerSubscribe,
    }
  }

  /** ==================================================== */
  /** Features                                             */
  /** ==================================================== */

  // TODO: 不属于该处的功能. 因为有可能没有dom
  // 滚动到对应位置
  scrollToField = (namePath: NamePath = []) => {
    const key = _getName(namePath)

    if (!key) return

    const control = this.$state.getControls().find(({ _key }) => _key === key)

    const formName = this._props.name
    const fieldId = control?._getId(formName)

    if (fieldId === undefined) return

    const dom = document.querySelector(`#${fieldId}`)

    dom?.scrollIntoView({ behavior: 'smooth' })
  }
}

// 仅负责存储信息(具体逻辑由 FormDispatchControl 实现)
export class FormStateControl<State = any> {
  constructor(private formGroupControl: FormGroupControl) {}

  /** ==================================================== */
  /** State                                                */
  /** ==================================================== */
  private _state = {} as State

  setFieldValue = (namePath: NamePath, value: any) => {
    const prev = this._state
    const path = toArray(namePath)

    // namePath 不合法
    if (!path.length) return [prev, prev] as const

    this._state = setIn(this._state, path, value)
    return [prev, this._state] as const
  }

  // 设置多个字段值
  setFieldsData = (fields: FieldData[]) => {
    const prev = this._state

    fields.forEach((field) => {
      const { name, value } = field

      hasOwn(field, 'value') && this.setFieldValue(name, value)
    })

    return [prev, this._state] as const
  }

  getFieldValue = (namePath: NamePath) => {
    const value = getIn(this._state, toArray(namePath))

    return cloneDeep(value)
  }

  setFieldsValue = (state: Partial<State>) => {
    const prev = this._state
    this._state = mergeValue(this._state, state)

    return [prev, this._state] as const
  }

  getFieldsValue = (fields?: NamePath[] | true) => {
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

  getFields = (nameList?: NamePath[]) => {
    return this.getControlsByName(true, nameList).map((control) => {
      const name = control._name
      const value = this.getFieldValue(name)
      // TODO: 验证 fields 与 onFieldsChange 一起使用时 errors 是否一直为空
      return { ...control.getFieldMeta(), name, value }
    })
  }

  deleteFieldValue = (namePath: NamePath) => {
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

  setInitialValues = (initial?: Partial<State>) => {
    this._initial = initial || {}
  }

  getInitialValue = (name: NamePath) => {
    const value = getIn(this._initial, toArray(name))

    return cloneDeep(value)
  }

  // 确保设置了字段初始值
  ensureInitialized = (control: FormFieldControl) => {
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
  initialFieldsValue = (nameList?: NamePath[]) => {
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
  getControls = (pure = false) => {
    const controls = [...this._controls.values()].reduce(
      (res, set) => res.concat([...set.values()]),
      [] as FormFieldControl[]
    )

    if (!pure) return controls

    return controls.filter((control) => control._key)
  }

  // 获取相同name的字段,不传参数认为获取全部有name的字段
  getControlsByName = <R extends boolean>(
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
  getValidateControls = (nameList?: NamePath[]) => {
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
  registerField = (control: FormFieldControl, dispatch: FormDispatchControl) => {
    const key = control._key

    const cached = this._controls.get(key) ?? new Set<FormFieldControl>()

    this._controls.set(key, cached.add(control.setParent(this)))

    dispatch.dispatch({ type: 'registerField', control })

    // 取消注册， 清除副作用
    return () => {
      const formPreserve = this.formGroupControl._props.preserve
      const preserve = control._props.preserve ?? formPreserve ?? true

      cached.delete(control)

      cached.size === 0 && this._controls.delete(key)

      // 不保留数据 && name 合法 && 没有同名字段
      const cleanup = !preserve && !!key && !cached.size
      dispatch.dispatch({ type: 'removeField', control, cleanup })
    }
  }

  // 清除字段卸载时的副作用
  cleanupField = (cleanup: boolean, namePath: NamePath) => {
    const prev = this._state
    if (!cleanup) return [prev, prev]

    return this.deleteFieldValue(namePath)
  }

  /** ==================================================== */
  /** Dependencies                                         */
  /** ==================================================== */
  // 字段依赖 当数据变更时就会重新校验与更新相应的字段
  private _dependencies = new Map<string, Set<FormFieldControl>>()

  // 订阅对应的字段变更
  registerSubscribe = (control: FormFieldControl) => {
    const { dependencies = [] } = control._props

    const cancels = dependencies.map((item) => {
      // 被依赖项
      const depKey = _getName(item)

      // 去除空白字段与自身
      if (!depKey || control._key === depKey) return () => {}

      const cached = this._dependencies.get(depKey) ?? new Set<FormFieldControl>()

      this._dependencies.set(depKey, cached.add(control))

      return () => {
        cached.delete(control)
        cached.size === 0 && this._dependencies.delete(depKey)
      }
    })

    return () => cancels.forEach((cancel) => cancel())
  }

  findDependencies = (updateControls: FormFieldControl[]) => {
    if (!updateControls.length) return [] as FormFieldControl[]

    const dependentControls = updateControls.reduce((res, control) => {
      const controls = this._dependencies.get(control._key)
      controls?.forEach((field) => res.add(field))

      return res
    }, new Set<FormFieldControl>())

    return [...dependentControls.keys()]
  }

  /** ==================================================== */
  /** Watch                                                */
  /** ==================================================== */
  // 实现 useWatch 功能
  _watchList: { namePath: NamePath; callback: WatchCallBack }[] = []

  registerWatch = (namePath: NamePath, callback: WatchCallBack) => {
    this._watchList.push({ namePath, callback })

    return () => {
      this._watchList = this._watchList.filter(({ callback: fn }) => fn !== callback)
    }
  }

  // 设置 FormField 的 meta 属性
  setFieldMeta = (namePath: NamePath, meta: Partial<FieldMeta>) => {
    // 由于涉及到隐式依赖，所以此处需要遍历全部 controls
    const key = _getName(namePath)
    for (const control of this.getControls(true)) {
      if (!isDependent(control._name, namePath)) continue

      if (control._key === key) control.setFieldMeta(meta)
      else control.setFieldMeta({ dirty: meta.dirty, touched: meta.touched })
    }
  }

  getFieldError = (namePath: NamePath) => {
    const controls = this.getFieldsError([namePath])
    return controls[0].errors
  }

  getFieldsError = (nameList?: NamePath[]) => {
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

// 负责调度逻辑
export class FormDispatchControl<State = any> {
  constructor(private formGroupControl: FormGroupControl) {}

  private get $state() {
    return this.formGroupControl.$state
  }

  // 注册字段
  registerField = (control: FormFieldControl) => {
    return this.$state.registerField(control, this)
  }

  // 更新视图
  updateControl = (prev: State, next: State, type: ActionType) => {
    // 获取需要更新的 control
    const controls = this.$state.getControls().reduce((res, control) => {
      if (control.shouldUpdate(prev, next, type)) res.push(control)
      return res
    }, [] as FormFieldControl[])

    // 校验依赖字段
    const dependencies = this.publishDependentControl(controls)

    if (this.formGroupControl.useRenderProps) {
      this.formGroupControl.forceUpdate()
    } else {
      const updateControls = controls.concat(dependencies)
      updateControls.forEach((control) => control.forceUpdate())
    }
    // 通知监听事件
    this.publishWatch(prev, next)
    return [controls, dependencies] as const
  }

  // 调度方法
  dispatch = (action: Action) => {
    const { $state } = this

    // 由用户事件主动触发
    if (action.type === 'fieldEvent') {
      const [prev, next] = $state.setFieldValue(action.name, action.value)
      // 更新字段
      const [, dependencies] = this.updateControl(prev, next, action.type)
      // 触发回调
      const changedValues = cloneWithPath(next, action.name)
      this.triggerOnValuesChange(changedValues)
      // 触发回调
      const nameList = [action.name, ...dependencies.map(({ _name }) => _name)]
      this.triggerOnFieldsChange(nameList)

      return
    }

    // 调用 setFieldValue, setFields 方法
    if (action.type === 'setFields') {
      const { fields } = action
      // 更新字段 meta 属性
      fields.forEach((field) => $state.setFieldMeta(field.name, field))
      // 获得更新数据
      const [prev, next] = $state.setFieldsData(fields)
      // 更新字段
      return this.updateControl(prev, next, action.type)
    }

    // 调用 setFieldsValue 方法
    if (action.type === 'setFieldsValue') {
      const [prev, next] = $state.setFieldsValue(action.state)

      return this.updateControl(prev, next, action.type)
    }

    // 删除字段，主要时通知 dependence
    if (action.type === 'removeField') {
      const { cleanup, control } = action
      const [prev, next] = $state.cleanupField(cleanup, control._name)

      return this.updateControl(prev, next, action.type)
    }

    // 注册字段
    if (action.type === 'registerField') {
      const [prev, next] = $state.ensureInitialized(action.control)

      return this.updateControl(prev, next, action.type)
    }

    // 重置字段
    if (action.type === 'resetFields') {
      // 重置表单数据
      const [prev, init] = $state.initialFieldsValue(action.nameList)
      const controls = $state.getControlsByName(true, action.nameList)

      // 设置字段初始值
      const next = controls.reduce((_, control) => {
        return $state.ensureInitialized(control)[1]
      }, init)

      // 重挂载组件以消除副作用
      controls.forEach((control) => control.resetField())

      return this.updateControl(prev, next, action.type)
    }

    logger.error(true, 'invalid action type')
  }

  // 设置一组字段状态
  setFields = (fields: FieldData[]) => {
    this.dispatch({ type: 'setFields', fields })
  }

  // 设置字段值
  setFieldValue = (name: NamePath, value: any) => {
    this.dispatch({ type: 'setFields', fields: [{ name, value }] })
  }

  // 设置多个字段值
  setFieldsValue = (state: Partial<State>) => {
    this.dispatch({ type: 'setFieldsValue', state })
  }

  // 重置字段
  resetFields = (nameList?: NamePath[]) => {
    this.dispatch({ type: 'resetFields', nameList })
  }

  // 通知监听字段
  publishWatch = (prev: State, next: State) => {
    this.$state._watchList.forEach(({ callback, namePath }) => {
      const path = toArray(namePath)
      const prevValue = getIn(prev, path)
      const nextValue = getIn(next, path)
      // 前后两次值不等就执行回调函数, 深比较
      !isEqual(prevValue, nextValue) && callback(nextValue)
    })
  }

  /** ==================================================== */
  /** validate                                             */
  /** ==================================================== */

  // 提交表单
  submitForm = () => {
    this.validateFields().then(this.triggerOnFinish, this.triggerOnFailed)
  }

  // 校验指定字段
  validateField = (namePath: NamePath) => {
    return this.validateFields([namePath])
  }

  // 校验多个字段, 不传默认校验全部
  validateFields = (fields?: NamePath[]) => {
    const controls = this.$state.getValidateControls(fields)

    const validateList = controls.map((control) => {
      const value = this.$state.getFieldValue(control._name)
      // 主动改成 touched
      control.setFieldMeta({ touched: true })
      return control.validate(value)
    })

    const returnPromise = Promise.all(validateList).then(() => {
      const nameList = controls.map(({ _name }) => _name)
      const validateErrors = this.$state
        .getFieldsError(nameList)
        .filter(({ errors }) => errors.length)
      // 触发 OnFieldsChange 回调事件
      this.triggerOnFieldsChange(controls.map(({ _name }) => _name))

      const values = this.$state.getFieldsValue(fields)
      if (validateErrors.length) {
        // 这里少个 outOfDate 目前不知道有啥用
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject({ errorFields: validateErrors, values })
      }
      return values
    })

    // 控制台不展示错误信息
    returnPromise.catch((e) => e)

    return returnPromise
  }

  isFieldTouched = (namePath: NamePath) => {
    return this.isFieldsTouched([namePath])
  }

  // 检查全部字段是否都触发过 onBlur
  isFieldsTouched = (fields?: NamePath[]) => {
    const untouchedFields = this.$state.getControls(true).filter((control) => {
      if (!fields) return false

      const { touched } = control.getFieldMeta()
      const implicate = fields.some((fieldName) => {
        return isDependent(control._name, fieldName)
      })
      return implicate && !touched
    })
    return untouchedFields.length === 0
  }

  // 通知依赖字段
  publishDependentControl = (controls: FormFieldControl[]) => {
    const dependencies = this.$state.findDependencies(controls)

    // 仅需要校验 dirty 与 touched 字段
    const nameList = dependencies
      .filter((control) => control.isDirty() || control.isTouched())
      .map(({ _name }) => _name)

    nameList.length && this.validateFields(nameList)

    // 尽量更新所有依赖字段
    return dependencies
  }

  /** ==================================================== */
  /** callbacks                                            */
  /** ==================================================== */
  // 触发 onValuesChange 回调
  triggerOnValuesChange = (changedValues: Partial<State>) => {
    const { onValuesChange } = this.formGroupControl._props

    if (!isFunction(onValuesChange)) return

    onValuesChange(changedValues, this.$state.getFieldsValue())
  }

  // 触发 onFieldsChange 回调
  triggerOnFieldsChange = (nameList: NamePath[]) => {
    const { onFieldsChange } = this.formGroupControl._props

    if (!isFunction(onFieldsChange)) return

    const changedFields = this.$state.getFields(nameList)
    const allFields = this.$state.getFields()

    onFieldsChange(changedFields, allFields)
  }

  // 触发 onFinish 回调
  triggerOnFinish = (values: State) => {
    const { onFinish } = this.formGroupControl._props
    if (!isFunction(onFinish)) return

    try {
      onFinish(values)
    } catch (error) {
      // onFinish失败时需要打印失败原因
      // eslint-disable-next-line no-console
      console.error(error)
    }
  }

  // 触发 onFailed 回调
  triggerOnFailed = (errors: any) => {
    const { onFailed } = this.formGroupControl._props
    if (!isFunction(onFailed)) return
    onFailed(errors)
  }
}
