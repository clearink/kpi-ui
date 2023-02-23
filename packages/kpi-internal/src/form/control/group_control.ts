/* eslint-disable max-classes-per-file,class-methods-use-this */
import { isFunction, hasOwn, isBoolean, isUndefined, logger, toArray } from '@kpi/shared'
import BaseControl from './base_control'
import { _getName } from '../utils/path'
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
} from '../internal_props'

export const HOOK_MARK = '_$_KPI_FORM_HOOK_MARK_$_'

export default class FormGroupControl<State = any> {
  $props: FormPropsControl

  $state: FormStateControl

  $controls: FormControlsControl

  $initial: FormInitialControl

  $dispatch: FormDispatchControl<State>

  constructor(_forceUpdate: () => void, mounted: () => boolean) {
    this.$props = new FormPropsControl(_forceUpdate, mounted)

    this.$controls = new FormControlsControl({ $props: this.$props })

    this.$state = new FormStateControl<State>({ $controls: this.$controls })

    this.$initial = new FormInitialControl<State>({ $state: this.$state })

    this.$dispatch = new FormDispatchControl({
      $props: this.$props,
      $controls: this.$controls,
      $state: this.$state,
      $initial: this.$initial,
    })
  }

  // 向外暴露的函数
  injectForm = (): InternalFormInstance<State> => {
    const { $dispatch, $state, $controls } = this

    return {
      getFieldError: $controls.getFieldError,
      getFieldsError: $controls.getFieldsError,

      setFieldValue: $dispatch.setFieldValue,
      getFieldValue: $state.getFieldValue,

      setFieldsValue: $dispatch.setFieldsValue,
      getFieldsValue: $state.getFieldsValue,

      validateField: $dispatch.validateField,
      validateFields: $dispatch.validateFields,

      submitForm: $dispatch.submitForm,
      resetFields: $dispatch.resetFields,

      isFieldTouched: $controls.isFieldTouched,
      isFieldsTouched: $controls.isFieldsTouched,

      isFieldValidating: $controls.isFieldValidating,
      isFieldsValidating: $controls.isFieldsValidating,

      /** @private */
      getInternalHooks: this._getInternalHooks,
    }
  }

  // 内部属性
  _getInternalHooks = (secret: string): InternalHookReturn | undefined => {
    const matched = secret === HOOK_MARK

    logger(!matched, '`getInternalHooks` is internal usage. Should not call directly.')

    if (!matched) return undefined

    const { $props, $initial, $dispatch, $controls } = this
    const { $watch, $dependencies } = $dispatch

    return {
      setFormProps: $props.setFormProps,
      setInitialValues: $initial.setInitialValues,
      registerField: $dispatch.registerField,
      registerWatch: $watch.registerWatch,
      setFieldMeta: $controls.setFieldMeta,
      setFields: $dispatch.setFields,
      dispatch: $dispatch.dispatch,
      ensureInitialized: $initial.ensureInitialized,
      registerSubscribe: $dependencies.registerSubscribe,
    }
  }
}

/** ==================================================== */
/** 负责 formProps                                       */
/** ==================================================== */
export class FormPropsControl extends BaseControl {
  private _props: Partial<FormProps> = {}

  get props() {
    return this._props
  }

  get useRenderProps() {
    return isFunction(this._props.children)
  }

  setFormProps = (props: Partial<FormProps>) => {
    this._props = { ...props }
  }
}

/** ==================================================== */
/** 负责 dependencies                                     */
/** ==================================================== */
export class FormDependenciesControl {
  private _dependencies = new Map<string, Set<FormFieldControl>>()

  // 订阅对应的字段变更
  registerSubscribe = (control: FormFieldControl) => {
    const { dependencies = [] } = control._props
    const currentKey = control._key

    const cancels = dependencies.map((item) => {
      // 被依赖项
      const depKey = _getName(item)

      // 去除空白字段与自身
      if (!depKey || currentKey === depKey) return () => {}

      const cached = this._dependencies.get(depKey) ?? new Set<FormFieldControl>()

      this._dependencies.set(depKey, cached.add(control))

      return () => {
        cached.delete(control)
        cached.size === 0 && this._dependencies.delete(depKey)
      }
    })

    return () => cancels.forEach((cancel) => cancel())
  }

  findDependencies = (controls: Set<FormFieldControl>) => {
    if (!controls.size) return controls

    const res = new Set<FormFieldControl>()
    const dependencies = this._dependencies

    controls.forEach((control) => {
      dependencies.get(control._key)?.forEach((field) => {
        // 只获取 touched 与 dirty 字段
        if (field.isDirty() || field.isTouched()) res.add(field)
      })
    })

    if (res.size) this.findDependencies(res).forEach(res.add)

    return res
  }
}

/** ==================================================== */
/** 负责监听事件                                           */
/** ==================================================== */
export class FormWatchValueControl {
  private _watchList = new Set<WatchCallBack>()

  registerWatch = (callback: WatchCallBack) => {
    this._watchList.add(callback)

    return () => this._watchList.delete(callback)
  }

  // 通知监听字段
  publishWatch = () => {
    this._watchList.forEach((callback) => callback())
  }
}

/** ==================================================== */
/** 负责初始化数据                                         */
/** ==================================================== */
export class FormInitialControl<State = any> {
  private _initial = {} as Partial<State>

  constructor(private $inject: { $state: FormStateControl<State> }) {}

  private get $state() {
    return this.$inject.$state
  }

  private getFieldValue = (namePath: NamePath) => {
    return this.$state.getFieldValue(namePath)
  }

  private setFieldValue = (namePath: NamePath, value: any) => {
    return this.$state.setFieldValue(namePath, value)
  }

  private deleteFieldValue = (namePath?: NamePath) => {
    return this.$state.deleteFieldValue(namePath)
  }

  setInitialValues = (initial?: Partial<State>) => {
    this._initial = initial || {}
  }

  getInitialValue = (name: NamePath) => {
    return getIn(this._initial, toArray(name))
  }

  // 确保设置了字段初始值
  ensureInitialized = (control: FormFieldControl) => {
    const namePath = control._name
    const $initialValue = control._props.initialValue
    const prev = this.$state.state

    if (!control._key) return [prev, prev]
    if (!isUndefined(this.getFieldValue(namePath))) return [prev, prev]

    const topInitial = this.getInitialValue(namePath)
    const initialValue = topInitial ?? $initialValue

    if (isUndefined(initialValue)) return [prev, prev]

    const invalid = !isUndefined(topInitial) && !isUndefined($initialValue)
    logger(invalid, "form has initialValues, don't set field initialValue")

    return this.setFieldValue(namePath, initialValue)
  }

  // 初始化表单数据
  initialFieldsValue = (nameList?: NamePath[]) => {
    // 不传nameList则清空state
    if (isUndefined(nameList)) return this.deleteFieldValue()

    const prev = this.$state.state

    nameList.forEach(this.deleteFieldValue)

    return [prev, this.$state.state] as const
  }
}

/** ==================================================== */
/** 负责表单字段                                           */
/** ==================================================== */
export class FormControlsControl {
  private _controls = {
    // 存放全部
    all: [] as FormFieldControl[],
    // 存放有效key
    pure: [] as FormFieldControl[],
    // key 映射数据
    map: new Map<string, FormFieldControl[]>(),
  }

  constructor(private $inject: { $props: FormPropsControl }) {}

  private get $props() {
    return this.$inject.$props
  }

  // 根据条件存放 control 到不同的地方
  private pushControl = (control, $initial: FormInitialControl) => {
    const key = control._key

    control.setParent($initial)

    const controls = this._controls
    const { all, pure, map } = controls

    all.push(control)

    if (key) {
      const cache = map.get(key) ?? []

      cache.push(control)

      map.set(key, cache)
      pure.push(control)
    }

    // popControl
    return () => {
      controls.all = controls.all.filter((field) => field !== control)

      if (!key) return

      controls.pure = controls.pure.filter((field) => field !== control)

      const cache = map.get(key)!

      const next = cache.filter((field) => field !== control)

      next.length ? map.set(key, next) : map.delete(key)
    }
  }

  // 获取字段,根据参数判断是否需要去除没有name的字段
  getControls = (pure = false) => {
    if (pure) return this._controls.pure

    return this._controls.all
  }

  // 获取相同name的字段,不传参数认为获取全部有name的字段
  getControlsByName = <R extends boolean>(
    removeInvalid: R,
    nameList?: NamePath[]
  ): ControlsByNameReturn<R> => {
    if (isUndefined(nameList)) return this.getControls(true)

    const controls = this._controls.map

    return nameList.reduce((result, path) => {
      const key = _getName(path)

      const cache = controls.get(key)

      if (!cache && !removeInvalid) result.push(new InvalidField(path))

      cache?.forEach((control) => result.push(control))

      return result
    }, [] as any[])
  }

  // 获取校验字段
  getValidateControls = (nameList?: NamePath[]) => {
    return this.getControlsByName(true, nameList).filter((control) => !!control._props.rule)
  }

  // 注册字段
  registerField = (control: FormFieldControl, dispatch: FormDispatchControl) => {
    const { $state, $initial } = dispatch

    const popControl = this.pushControl(control, $initial)

    dispatch.dispatch({ type: 'registerField', control })

    // 取消注册， 清除副作用
    return () => {
      const { _key: key, _name: name, _props: props } = control

      popControl()

      const preserve = props.preserve ?? this.$props.props.preserve ?? true

      // 保留数据 不做任何处理
      if (preserve || props.isListField) return

      if ($state.getFieldValue(name) === $initial.getInitialValue(name)) return

      // 不保留数据 && name 合法 && 没有同名字段
      const cleanup = !this.getControls().find((field) => field._key === key)
      cleanup && dispatch.dispatch({ type: 'removeField', control })
    }
  }

  // 设置 FormField 的 meta 属性
  setFieldMeta = (namePath: NamePath, meta: Partial<FieldMeta>) => {
    this.getControlsByName(true, [namePath]).forEach((control) => {
      control.setFieldMeta(meta)
    })
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

      const { _name: name, _errors: errors } = control
      return { name, errors, warnings: [] }
    })
  }

  isFieldTouched = (namePath: NamePath) => {
    return this.isFieldsTouched([namePath])
  }

  // 检查全部字段是否都被触摸过
  isFieldsTouched = (nameList?: NamePath[]) => {
    const allFields = this.getControlsByName(true, nameList)
    const untouchedFields = allFields.filter((control) => !control.isTouched())

    return untouchedFields.length === 0
  }

  isFieldValidating = (namePath: NamePath) => {
    return this.isFieldsValidating([namePath])
  }

  isFieldsValidating = (nameList?: NamePath[]) => {
    const allFields = this.getControlsByName(true, nameList)
    const unValidatingFields = allFields.filter((control) => !control.isValidating())

    return unValidatingFields.length === 0
  }
}

/** ==================================================== */
/** 负责表单数据                                           */
/** ==================================================== */
export class FormStateControl<State = any> {
  private _state = {} as State

  constructor(private $inject: { $controls: FormControlsControl }) {}

  get state() {
    return this._state
  }

  private get $controls() {
    return this.$inject.$controls
  }

  setFieldValue = (namePath: NamePath, value: any) => {
    const prev = this._state
    const path = toArray(namePath)

    if (!path.length) return [prev, prev] as const

    this._state = setIn(this._state, path, value)

    return [prev, this._state] as const
  }

  // 设置多个字段值
  setFieldsData = (fields: FieldData[]) => {
    const prev = this._state

    fields.forEach((field) => hasOwn(field, 'value') && this.setFieldValue(field.name, field.value))

    return [prev, this._state] as const
  }

  getFieldValue = (namePath: NamePath) => {
    return getIn(this._state, toArray(namePath))
  }

  setFieldsValue = (state: Partial<State>) => {
    const prev = this._state
    this._state = mergeValue(this._state, state)

    return [prev, this._state] as const
  }

  getFieldsValue = (fields?: NamePath[] | true) => {
    if (fields === true) return this._state

    const noFields = isUndefined(fields)
    const nameList = isBoolean(fields) ? [] : fields
    const controls = this.$controls.getControlsByName(false, nameList)

    return controls.reduce((values, field) => {
      if (InvalidField.isInvalid(field)) {
        const { name } = field
        return setIn(values, name, getIn(this._state, name))
      }

      const { _name: name, _props: props } = field
      // 该场景时不用获取列表项，可以减小一些开销
      if (noFields && props.isListField) return values

      return setIn(values, name, getIn(this._state, name))
    }, {} as State)
  }

  getFields = (nameList?: NamePath[]) => {
    return this.$controls.getControlsByName(true, nameList).map((control) => {
      const name = control._name
      const value = this.getFieldValue(name)
      // TODO: 验证 fields 与 onFieldsChange 一起使用时 errors 是否一直为空
      return { ...control.getFieldMeta(), name, value }
    })
  }

  deleteFieldValue = (namePath?: NamePath) => {
    const prev = this._state

    if (isUndefined(namePath)) this._state = {} as State
    else this._state = deleteIn(this._state, toArray(namePath))

    return [prev, this._state] as const
  }

  // 清除字段卸载时的副作用
  cleanupField = (control: FormFieldControl) => {
    control.setFieldMeta({}) // 触发 mounted.current = false
    return this.deleteFieldValue(control._name)
  }
}

/** ==================================================== */
/** 负责调度逻辑                                           */
/** ==================================================== */
export class FormDispatchControl<State = any> {
  $dependencies = new FormDependenciesControl()

  $watch = new FormWatchValueControl()

  constructor(
    private $inject: {
      $props: FormPropsControl
      $controls: FormControlsControl
      $state: FormStateControl<State>
      $initial: FormInitialControl
    }
  ) {}

  private get $props() {
    return this.$inject.$props
  }

  private get $controls() {
    return this.$inject.$controls
  }

  get $state() {
    return this.$inject.$state
  }

  get $initial() {
    return this.$inject.$initial
  }

  // 注册字段
  registerField = (control: FormFieldControl) => {
    return this.$controls.registerField(control, this)
  }

  // 更新视图
  // TODO: cost time 51.6ms
  updateControl = (filter: (control: FormFieldControl) => boolean) => {
    // 获取需要更新的 control
    const controls = this.$controls.getControls().filter(filter)

    // 校验依赖字段
    const dependencies = this.publishDependentControl(controls)

    const updateControls = new Set(controls.concat(dependencies))

    if (this.$props.useRenderProps) this.$props.forceUpdate()
    else updateControls.forEach((control) => control.forceUpdate())

    // 通知监听事件
    this.$watch.publishWatch()

    return dependencies
  }

  // 调度方法
  dispatch = (action: Action) => {
    const { $state, $controls, $initial } = this

    // 由用户事件主动触发
    if (action.type === 'fieldEvent') {
      const { name, value, type } = action
      const [prev, next] = $state.setFieldValue(name, value)
      // 更新字段
      const dependencies = this.updateControl((control) => {
        return control.shouldUpdate(prev, next, type)
      })
      // 触发回调
      this.triggerOnValuesChange(cloneWithPath(next, name))

      const nameList = [action.name, ...dependencies.map(({ _name }) => _name)]

      return this.triggerOnFieldsChange(nameList)
    }

    // 调用 setFieldValue, setFields 方法
    if (action.type === 'setFields') {
      const { type, fields } = action
      // 更新字段 meta 属性
      fields.forEach((field) => $controls.setFieldMeta(field.name, field as FieldMeta))
      // 获得更新数据
      const [prev, next] = $state.setFieldsData(fields)
      // 更新字段
      return this.updateControl((control) => {
        return control.shouldUpdate(prev, next, type)
      })
    }

    // 注册字段
    if (action.type === 'registerField') {
      const { type, control: field } = action
      const { initialValue } = field._props

      // 字段没有初始值
      if (isUndefined(initialValue)) return

      // 字段初始值不生效
      if ($state.getFieldValue(field._name) !== initialValue) return

      const [prev, next] = $initial.ensureInitialized(field)

      return this.updateControl((control) => {
        if (control === field) return false
        if (control._key === field._key) return true
        if (!control._props.shouldUpdate) return false
        return control.shouldUpdate(prev, next, type)
      })
    }

    // 重置字段
    if (action.type === 'resetFields') {
      const { nameList, type } = action
      // 重置表单数据
      const prev = $initial.initialFieldsValue(nameList)[0]

      const controls = $controls.getControlsByName(true, nameList)
      // 设置字段初始值
      controls.forEach($initial.ensureInitialized)
      // 重挂载组件以消除副作用
      controls.forEach((control) => control.resetField())

      const next = $state.state
      return this.updateControl((control) => {
        return control.shouldUpdate(prev, next, type)
      })
    }

    logger(true, 'invalid action type')
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

  private lastValidate: null | Promise<void[]> = null

  // 校验多个字段, 不传默认校验全部
  validateFields = (fields?: NamePath[]) => {
    const { getFieldValue, getFieldsValue } = this.$state
    const { getFieldsError, getValidateControls } = this.$controls

    const controls = getValidateControls(fields)

    const validateList = controls.map((control) => {
      const path = control._name

      !control.isTouched() && control.setFieldMeta({ touched: true })

      return control.validate(getFieldValue(path), { path })
    })

    const promiseList = Promise.all(validateList)
    this.lastValidate = promiseList

    const returnPromise = promiseList.then(() => {
      if (promiseList !== this.lastValidate) return 'invalid-validate'

      const validateErrors = getFieldsError(fields).filter(({ errors }) => errors.length)
      // 触发 OnFieldsChange 回调事件
      this.triggerOnFieldsChange(controls.map(({ _name }) => _name))

      const values = getFieldsValue(fields)

      if (validateErrors.length) {
        // 这里少个 outOfDate 目前不知道有啥用
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject({ errorFields: validateErrors, values })
      }
      return values
    })

    // 控制台不展示错误信息
    returnPromise.catch((e) => e)

    return returnPromise as Promise<State>
  }

  // 通知依赖字段
  publishDependentControl = (controls: FormFieldControl[]) => {
    const dependencies = this.$dependencies.findDependencies(new Set(controls))
    const updateControls = [...dependencies.values()]

    const nameList = updateControls.map(({ _name }) => _name)

    nameList.length && this.validateFields(nameList)

    // 尽量更新所有依赖字段
    return updateControls
  }

  /** ==================================================== */
  /** callbacks                                            */
  /** ==================================================== */
  // 触发 onValuesChange 回调
  triggerOnValuesChange = (changedValues: Partial<State>) => {
    const { onValuesChange } = this.$props.props

    if (!onValuesChange) return

    onValuesChange(changedValues, this.$state.getFieldsValue())
  }

  // 触发 onFieldsChange 回调
  triggerOnFieldsChange = (nameList: NamePath[]) => {
    const { onFieldsChange } = this.$props.props

    if (!onFieldsChange) return

    const { getFields } = this.$state

    onFieldsChange(getFields(nameList), getFields())
  }

  // 触发 onFinish 回调
  triggerOnFinish = (values: State | 'invalid-validate') => {
    const { onFinish } = this.$props.props
    if (!onFinish || values === 'invalid-validate') return

    try {
      onFinish(values)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)
    }
  }

  // 触发 onFailed 回调
  triggerOnFailed = (errors: any) => {
    const { onFailed } = this.$props.props

    if (!onFailed) return

    onFailed(errors)
  }
}
