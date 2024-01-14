import {
  hasOwn,
  isBoolean,
  isFunction,
  isUndefined,
  logger,
  noop,
  pushItem,
  removeItem,
  toArray,
} from '@kpi-ui/utils'
import { _getName } from '../../../utils/path'
import {
  cloneWithPath,
  deleteIn,
  getIn,
  hasOwnWithPath,
  mergeValue,
  setIn,
} from '../../../utils/value'

import type { InternalFormContextState } from '../../../_shared/context'
import type {
  ExternalFieldData,
  ExternalNamePath,
  FormAction,
  InternalFieldMeta,
  InternalNamePath,
  WatchCallBack,
} from '../../../props'
import { InvalidFieldControl, type FormFieldControl } from '../../field/control'
import type { InternalFormProps } from '../props'
import type { ControlFindReturn, InternalFormInstance, InternalHookReturn } from './props'

export const HOOK_MARK = Symbol.for('_$KPI$_')

export default class FormGroupControl<State = any> {
  $props: FormPropsControl

  $state: FormStateControl

  $controls: FormControlsControl

  $initial: FormInitialControl

  $dispatch: FormDispatchControl<State>

  constructor(public forceUpdate: () => void) {
    this.$props = new FormPropsControl(forceUpdate)

    this.$controls = new FormControlsControl(this.$props)

    this.$state = new FormStateControl<State>(this.$controls)

    this.$initial = new FormInitialControl<State>(this.$state)

    this.$dispatch = new FormDispatchControl(
      this.$props,
      this.$controls,
      this.$state,
      this.$initial
    )
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
  _getInternalHooks = (secret: symbol): InternalHookReturn | undefined => {
    const matched = secret === HOOK_MARK

    if (process.env.NODE_ENV !== 'production') {
      logger(!matched, '`getInternalHooks` is internal usage. Should not call directly.')
    }
    if (!matched) return undefined

    const { $props, $initial, $dispatch, $controls } = this
    const { $watch, $dependencies } = $dispatch

    return {
      setInternalFormMisc: $props.setInternalFormMisc,
      setInitialValues: $initial.setInitialValues,
      registerField: $dispatch.registerField,
      registerWatch: $watch.registerWatch,
      metaUpdate: $controls.metaUpdate,
      setFields: $dispatch.setFields,
      dispatch: $dispatch.dispatch,
      ensureInitialized: $initial.ensureInitialized,
      subscribe: $dependencies.subscribe,
    }
  }
}

/** ==================================================== */
/** 负责 formProps                                       */
/** ==================================================== */
export class FormPropsControl {
  _props: Partial<InternalFormProps> = {}

  _parent: InternalFormContextState | undefined

  get useRenderProps() {
    return isFunction(this._props.children)
  }

  constructor(public forceUpdate: () => void) {}

  setInternalFormMisc = (props: Partial<InternalFormProps>, parent: InternalFormContextState) => {
    this._parent = parent
    this._props = props
  }
}

/** ==================================================== */
/** 负责 dependencies                                     */
/** ==================================================== */
export class FormDependenciesControl {
  private _dependencies = new Map<string, Set<FormFieldControl>>()

  // 订阅对应的字段变更
  subscribe = (control: FormFieldControl) => {
    const { dependencies = [] } = control._props
    const currentKey = control._key

    const subscribeCache = this._dependencies

    const cancels = dependencies.map((item) => {
      // 被依赖项
      const depKey = _getName(item)

      // 去除空白字段与自身
      if (!depKey || currentKey === depKey) return noop

      const cached = subscribeCache.get(depKey) || new Set()

      subscribeCache.set(depKey, cached.add(control))

      return () => {
        cached.delete(control)
        cached.size === 0 && subscribeCache.delete(depKey)
      }
    })

    return () => cancels.forEach((cancel) => cancel())
  }

  findDependencies = (controls: FormFieldControl[], uniqueControls: Set<FormFieldControl>) => {
    if (!controls.length) return

    const nextControls: FormFieldControl[] = []

    const dependencies = this._dependencies

    controls.forEach((control) => {
      dependencies.get(control._key)?.forEach((field) => {
        // 只获取 touched 与 dirty 字段
        if (!field.dirty && !field._touched) return

        // 避免爆栈
        if (uniqueControls.has(field)) return

        nextControls.push(field)

        uniqueControls.add(field)
      })
    })

    this.findDependencies(nextControls, uniqueControls)
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

  constructor(private $state: FormStateControl<State>) {}

  private getFieldValue = (namePath: ExternalNamePath) => {
    return this.$state.getFieldValue(namePath)
  }

  private setFieldValue = (namePath: ExternalNamePath, value: any) => {
    return this.$state.setFieldValue(namePath, value)
  }

  private deleteFieldValue = (namePath?: ExternalNamePath) => {
    return this.$state.deleteFieldValue(namePath)
  }

  setInitialValues = (initial?: Partial<State>) => {
    this._initial = initial || {}
  }

  getInitialValue = (name: ExternalNamePath) => {
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

    if (process.env.NODE_ENV !== 'production') {
      logger(
        !isUndefined(topInitial) && !isUndefined($initialValue),
        "form has initialValues, don't set field initialValue"
      )
    }

    return this.setFieldValue(namePath, initialValue)
  }

  // 初始化表单数据
  initialFieldsValue = (nameList?: ExternalNamePath[]) => {
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
    list: [] as FormFieldControl[],
    map: new Map<string, FormFieldControl[]>(),
  }

  constructor(private $props: FormPropsControl) {}

  // 根据条件存放 control 到不同的地方
  private pushControl = (control: FormFieldControl, $initial: FormInitialControl) => {
    const key = control._key

    control.setGetInitial(() => $initial.getInitialValue(control._name))

    const { list, map } = this._controls

    pushItem(list, control)

    if (!key) return () => removeItem(list, control)

    const cache = map.get(key) ?? []

    map.set(key, pushItem(cache, control))

    // popControl
    return () => {
      removeItem(list, control)

      removeItem(cache, control)

      !cache.length && map.delete(key)
    }
  }

  // 获取字段,根据参数判断是否需要去除没有name的字段
  getControls = (pure = false) => {
    const controls = this._controls.list

    if (!pure) return controls

    return controls.filter((control) => control._key)
  }

  // 获取相同name的字段,不传参数认为获取全部有name的字段
  getControlsByName = <R extends boolean>(
    removeInvalid: R,
    nameList?: ExternalNamePath[]
  ): ControlFindReturn<R> => {
    if (isUndefined(nameList)) return this.getControls(true)

    const controls = this._controls.map

    return nameList.reduce((result, path) => {
      const key = _getName(path)

      const cache = controls.get(key)

      if (!cache && !removeInvalid) result.push(new InvalidFieldControl(path))

      cache && cache.forEach((control) => result.push(control))

      return result
    }, [] as any[])
  }

  // 获取校验字段
  getValidateControls = (nameList?: ExternalNamePath[]) => {
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

      const preserve = props.preserve ?? this.$props._props.preserve ?? true

      // 保留数据 不做任何处理
      if (preserve || props.isListField) return

      if ($state.getFieldValue(name) === $initial.getInitialValue(name)) return

      // 不保留数据 && name 合法 && 没有同名字段
      const cleanup = !this._controls.map.has(key)
      cleanup && dispatch.dispatch({ type: 'removeField', control })
    }
  }

  // 设置 FormField 的 meta 属性
  metaUpdate = (namePath: ExternalNamePath, meta: Partial<InternalFieldMeta>) => {
    this.getControlsByName(true, [namePath]).forEach((control) => {
      control.metaUpdate(meta)
    })
  }

  getFieldError = (namePath: ExternalNamePath) => {
    const controls = this.getFieldsError([namePath])
    return controls[0].errors
  }

  getFieldsError = (nameList?: ExternalNamePath[]) => {
    const allFields = this.getControlsByName(false, nameList)

    return allFields.map((field) => {
      const { _name: name, _errors: errors, _warnings: warnings } = field

      return { name, errors, warnings }
    })
  }

  isFieldTouched = (namePath: ExternalNamePath) => {
    return this.isFieldsTouched([namePath])
  }

  // 检查全部字段是否都被触摸过
  isFieldsTouched = (nameList?: ExternalNamePath[]) => {
    const allFields = this.getControlsByName(true, nameList)

    return allFields.some((field) => !field._touched)
  }

  isFieldValidating = (namePath: ExternalNamePath) => {
    return this.isFieldsValidating([namePath])
  }

  isFieldsValidating = (nameList?: ExternalNamePath[]) => {
    const allFields = this.getControlsByName(true, nameList)

    return allFields.some((field) => !field._validating)
  }
}

/** ==================================================== */
/** 负责表单数据                                           */
/** ==================================================== */
export class FormStateControl<State = any> {
  private _state = {} as State

  constructor(private $controls: FormControlsControl) {}

  get state() {
    return this._state
  }

  setFieldValue = (namePath: ExternalNamePath, value: any) => {
    const prev = this._state
    const path = toArray(namePath)

    if (!path.length) return [prev, prev] as const

    this._state = setIn(this._state, path, value)

    return [prev, this._state] as const
  }

  // 设置多个字段值
  setFieldsData = (fields: ExternalFieldData[]) => {
    const prev = this._state

    fields.forEach((field) => hasOwn(field, 'value') && this.setFieldValue(field.name, field.value))

    return [prev, this._state] as const
  }

  getFieldValue = (namePath: ExternalNamePath) => {
    return getIn(this._state, toArray(namePath))
  }

  setFieldsValue = (state: Partial<State>) => {
    const prev = this._state
    this._state = mergeValue(this._state, state)

    return [prev, this._state] as const
  }

  getFieldsValue = (fields?: ExternalNamePath[] | true) => {
    if (fields === true) return this._state

    const noFields = isUndefined(fields)
    const nameList = isBoolean(fields) ? [] : fields
    const controls = this.$controls.getControlsByName(false, nameList)
    const state = this._state

    return controls.reduceRight((values, field) => {
      const { _name: name, _props: props } = field

      // 该场景时不用获取列表项，可以减小一些开销
      if (noFields && props.isListField) return values

      // 已存在的值也不用再次 set
      if (hasOwnWithPath(values, name)) return values

      return setIn(values, name, getIn(state, name))
    }, {} as State)
  }

  getFields = (nameList?: ExternalNamePath[]) => {
    return this.$controls.getControlsByName(true, nameList).map((control) => {
      const name = control._name
      const value = this.getFieldValue(name)
      // TODO: 验证 fields 与 onFieldsChange 一起使用时 errors 是否一直为空
      return { ...control.meta, name, value }
    })
  }

  deleteFieldValue = (namePath?: ExternalNamePath) => {
    const prev = this._state

    if (isUndefined(namePath)) this._state = {} as State
    else this._state = deleteIn(this._state, toArray(namePath))

    return [prev, this._state] as const
  }

  // 清除字段卸载时的副作用
  cleanupField = (control: FormFieldControl) => {
    control.metaUpdate({}) // 触发 mounted.current = false
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
    private $props: FormPropsControl,
    private $controls: FormControlsControl,
    public $state: FormStateControl<State>,
    public $initial: FormInitialControl
  ) {}

  // 注册字段
  registerField = (control: FormFieldControl) => {
    if (control._shouldHook === true) control.forceUpdate()
    return this.$controls.registerField(control, this)
  }

  // 更新视图
  updateControl = (filter: (control: FormFieldControl) => boolean) => {
    // 获取需要更新的 control
    const controls = this.$controls.getControls().filter(filter)

    if (this.$props.useRenderProps) this.$props.forceUpdate()
    else controls.forEach((control) => control.forceUpdate())

    // 通知监听事件
    this.$watch.publishWatch()

    // 校验依赖字段
    return this.publishDependentControl(controls)
  }

  // 调度方法
  dispatch = (action: FormAction) => {
    const { $state, $controls, $initial } = this

    // 由用户事件主动触发
    if (action.type === 'fieldEvent') {
      const { control: field, value, type } = action

      const name = field._name

      const [prev, next] = $state.setFieldValue(name, value)
      // 更新字段
      const dependencies = this.updateControl((control) => {
        return control.shouldUpdate(prev, next, type)
      })
      // 触发回调
      this.triggerOnValuesChange(next, name)
      // 触发 value = action.value
      return this.triggerOnFieldsChange([field].concat(dependencies))
    }

    // 调用 setFieldsValue 方法
    if (action.type === 'setFieldsValue') {
      const { state, type } = action

      const [prev, next] = $state.setFieldsValue(state)
      // 更新字段
      return this.updateControl((control) => {
        return control.shouldUpdate(prev, next, type)
      })
    }
    // 调用 setFieldValue, setFields 方法
    if (action.type === 'setFields') {
      const { type, fields } = action
      // 更新字段 meta 属性
      fields.forEach((field) => $controls.metaUpdate(field.name, field as any))
      // 获得更新数据
      const [prev, next] = $state.setFieldsData(fields)
      // 更新字段
      return this.updateControl((control) => {
        return control.shouldUpdate(prev, next, type)
      })
    }

    // 删除字段，主要时通知 dependence
    if (action.type === 'removeField') {
      const { control: field, type } = action

      const [prev, next] = $state.cleanupField(field)

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

        if (!control._shouldHook) return false

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
      controls.forEach((control) => control.reset())

      const next = $state.state
      return this.updateControl((control) => {
        return control.shouldUpdate(prev, next, type)
      })
    }

    if (process.env.NODE_ENV !== 'production') {
      logger(true, 'invalid action type')
    }
  }

  // 设置一组字段状态
  setFields = (fields: ExternalFieldData[]) => {
    this.dispatch({ type: 'setFields', fields })
  }

  // 设置字段值
  setFieldValue = (name: ExternalNamePath, value: any) => {
    this.dispatch({ type: 'setFields', fields: [{ name, value }] })
  }

  // 设置多个字段值
  setFieldsValue = (state: Partial<State>) => {
    this.dispatch({ type: 'setFieldsValue', state })
  }

  // 重置字段
  resetFields = (nameList?: ExternalNamePath[]) => {
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
  validateField = (namePath: ExternalNamePath) => {
    return this.validateFields([namePath])
  }

  private lastValidate: null | Promise<void[]> = null

  // 校验多个字段, 不传默认校验全部
  validateFields = (fields?: ExternalNamePath[]) => {
    const { getFieldValue, getFieldsValue } = this.$state
    const { getFieldsError, getValidateControls } = this.$controls

    const controls = getValidateControls(fields)

    const validateList = controls.map((control) => {
      const path = control._name

      // 重置字段 meta 属性
      control.metaUpdate({
        touched: true,
        validating: true,
        errors: [],
        warnings: [],
      })

      return control.validate(getFieldValue(path), { path })
    })

    // 触发 validating === true
    this.triggerOnFieldsChange(controls)

    const promiseList = Promise.all(validateList)

    this.lastValidate = promiseList

    const returnPromise = promiseList.then(() => {
      if (promiseList !== this.lastValidate) return 'invalid-validate'

      const errorFields = getFieldsError(fields).filter(({ errors }) => errors.length)
      // 触发 validating === false
      this.triggerOnFieldsChange(controls)

      const values = getFieldsValue(fields)

      if (errorFields.length) {
        // 这里少个 outOfDate 目前不知道有啥用
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject({ errorFields, values })
      }
      return values
    })

    // 控制台不展示错误信息
    returnPromise.catch((e) => e)

    return returnPromise as Promise<State>
  }

  // 通知依赖字段
  publishDependentControl = (controls: FormFieldControl[]) => {
    const dependencies = new Set<FormFieldControl>()

    this.$dependencies.findDependencies(controls, dependencies)

    const updateControls = Array.from(dependencies)

    const nameList = updateControls.map(({ _name }) => _name)

    nameList.length && this.validateFields(nameList)

    // 尽量更新所有依赖字段
    return updateControls
  }

  /** ==================================================== */
  /** callbacks                                            */
  /** ==================================================== */
  // 触发 onValuesChange 回调
  triggerOnValuesChange = (state: State, path: InternalNamePath) => {
    const { onValuesChange } = this.$props._props

    if (!onValuesChange) return

    const changedValues = cloneWithPath(state, path)

    onValuesChange(changedValues, () => this.$state.getFieldsValue())
  }

  // 触发 onFieldsChange 回调
  triggerOnFieldsChange = (controls: FormFieldControl[]) => {
    const { onFieldsChange, name } = this.$props._props

    const parentForm = this.$props._parent

    if (!onFieldsChange && !parentForm) return

    const { getFields } = this.$state

    const nameList = controls.map((control) => control._name)

    const changedFields = getFields(nameList)

    !isUndefined(name) && parentForm?.triggerFormChange(name, changedFields)

    onFieldsChange?.(changedFields, () => getFields())
  }

  // 触发 onFinish 回调
  triggerOnFinish = (values: State | 'invalid-validate') => {
    const { onFinish } = this.$props._props

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
    const { onFailed } = this.$props._props

    onFailed && onFailed(errors)
  }
}
