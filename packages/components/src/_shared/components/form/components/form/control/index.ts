import { logger } from '@comps/_shared/utils'
import {
  execute,
  hasOwn,
  isBoolean,
  isFunction,
  isUndefined,
  noop,
  pushItem,
  removeItem,
  toArray,
} from '@internal/utils'

import type { InternalFormContextState } from '../../../_shared/context'
import type {
  ExternalFieldData,
  ExternalNamePath,
  FormAction,
  InternalFieldMeta,
  InternalNamePath,
  WatchCallBack,
} from '../../../props'
import type { InternalFormProps } from '../props'
import type { ControlFindReturn, InternalFormInstance, InternalHookReturn } from './props'

import { _getName } from '../../../utils/path'
import {
  cloneWithPath,
  deleteIn,
  getIn,
  hasOwnWithPath,
  mergeValue,
  setIn,
} from '../../../utils/value'
import { type FormFieldControl, InvalidFieldControl } from '../../field/control'

export const HOOK_MARK = Symbol.for('_$ink$_')

export default class FormGroupControl<State = any> {
  // 内部属性
  _getInternalHooks = (secret: symbol): InternalHookReturn | undefined => {
    const matched = secret === HOOK_MARK

    if (process.env.NODE_ENV !== 'production')
      logger(!matched, '`getInternalHooks` is internal usage. Should not call directly.')

    if (!matched) return undefined

    const { $controls, $dispatch, $initial, $props } = this
    const { $dependencies, $watch } = $dispatch

    return {
      dispatch: $dispatch.dispatch,
      ensureInitialized: $initial.ensureInitialized,
      metaUpdate: $controls.metaUpdate,
      registerField: $dispatch.registerField,
      registerWatch: $watch.registerWatch,
      setFields: $dispatch.setFields,
      setInitialValues: $initial.setInitialValues,
      setInternalFormMisc: $props.setInternalFormMisc,
      subscribe: $dependencies.subscribe,
    }
  }

  $controls: FormControlsControl

  $dispatch: FormDispatchControl<State>

  $initial: FormInitialControl

  $props: FormPropsControl

  $state: FormStateControl

  // 向外暴露的函数
  injectForm = (): InternalFormInstance<State> => {
    const { $controls, $dispatch, $state } = this

    return {
      getFieldError: $controls.getFieldError,
      getFieldValue: $state.getFieldValue,

      getFieldsError: $controls.getFieldsError,
      getFieldsValue: $state.getFieldsValue,

      /** @private */
      getInternalHooks: this._getInternalHooks,
      isFieldTouched: $controls.isFieldTouched,

      isFieldValidating: $controls.isFieldValidating,
      isFieldsTouched: $controls.isFieldsTouched,

      isFieldsValidating: $controls.isFieldsValidating,
      resetFields: $dispatch.resetFields,

      setFieldValue: $dispatch.setFieldValue,
      setFieldsValue: $dispatch.setFieldsValue,

      submitForm: $dispatch.submitForm,
      validateField: $dispatch.validateField,

      validateFields: $dispatch.validateFields,
    }
  }

  constructor(public forceUpdate: () => void) {
    this.$props = new FormPropsControl(forceUpdate)

    this.$controls = new FormControlsControl(this.$props)

    this.$state = new FormStateControl<State>(this.$controls)

    this.$initial = new FormInitialControl<State>(this.$state)

    this.$dispatch = new FormDispatchControl(
      this.$props,
      this.$controls,
      this.$state,
      this.$initial,
    )
  }
}

/** ==================================================== */
/** 负责 formProps                                       */
/** ==================================================== */
export class FormPropsControl {
  _parent: InternalFormContextState | undefined

  _props: Partial<InternalFormProps> = {}

  setInternalFormMisc = (props: Partial<InternalFormProps>, parent: InternalFormContextState) => {
    this._parent = parent
    this._props = props
  }

  constructor(public forceUpdate: () => void) {}

  get useRenderProps() {
    return isFunction(this._props.children)
  }
}

/** ==================================================== */
/** 负责 dependencies                                     */
/** ==================================================== */
export class FormDependenciesControl {
  private _dependencies = new Map<string, Set<FormFieldControl>>()

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

    return () => cancels.forEach(cancel => cancel())
  }
}

/** ==================================================== */
/** 负责监听事件                                           */
/** ==================================================== */
export class FormWatchValueControl {
  private _watchList = new Set<WatchCallBack>()

  publishWatch = () => { this._watchList.forEach(execute) }

  // 通知监听字段
  registerWatch = (callback: WatchCallBack) => {
    this._watchList.add(callback)

    return () => {
      this._watchList.delete(callback)
    }
  }
}

/** ==================================================== */
/** 负责初始化数据                                         */
/** ==================================================== */
export class FormInitialControl<State = any> {
  private _initial = {} as Partial<State>

  private deleteFieldValue = (namePath?: ExternalNamePath) => {
    return this.$state.deleteFieldValue(namePath)
  }

  private getFieldValue = (namePath: ExternalNamePath) => {
    return this.$state.getFieldValue(namePath)
  }

  private setFieldValue = (namePath: ExternalNamePath, value: any) => {
    return this.$state.setFieldValue(namePath, value)
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
        'form has initialValues, don\'t set field initialValue',
      )
    }

    return this.setFieldValue(namePath, initialValue)
  }

  getInitialValue = (name: ExternalNamePath) => {
    return getIn(this._initial, toArray(name))
  }

  // 初始化表单数据
  initialFieldsValue = (nameList?: ExternalNamePath[]) => {
    // 不传nameList则清空state
    if (isUndefined(nameList)) return this.deleteFieldValue()

    const prev = this.$state.state

    nameList.forEach(this.deleteFieldValue)

    return [prev, this.$state.state] as const
  }

  setInitialValues = (initial?: Partial<State>) => {
    this._initial = initial || {}
  }

  constructor(private $state: FormStateControl<State>) {}
}

/** ==================================================== */
/** 负责表单字段                                           */
/** ==================================================== */
export class FormControlsControl {
  private _controls = {
    list: [] as FormFieldControl[],
    map: new Map<string, FormFieldControl[]>(),
  }

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

    return controls.filter(control => control._key)
  }

  // 获取相同name的字段,不传参数认为获取全部有name的字段
  getControlsByName = <R extends boolean>(
    removeInvalid: R,
    nameList?: ExternalNamePath[],
  ): ControlFindReturn<R> => {
    if (isUndefined(nameList)) return this.getControls(true)

    const controls = this._controls.map

    return nameList.reduce((result, path) => {
      const key = _getName(path)

      const cache = controls.get(key)

      if (!cache && !removeInvalid) result.push(new InvalidFieldControl(path))

      return cache ? pushItem(result, cache) : result
    }, [] as any[])
  }

  getFieldError = (namePath: ExternalNamePath) => {
    const controls = this.getFieldsError([namePath])
    return controls[0].errors
  }

  getFieldsError = (nameList?: ExternalNamePath[]) => {
    const allFields = this.getControlsByName(false, nameList)

    return allFields.map((field) => {
      const { _errors: errors, _name: name, _warnings: warnings } = field

      return { errors, name, warnings }
    })
  }

  // 获取校验字段
  getValidateControls = (nameList?: ExternalNamePath[]) => {
    return this.getControlsByName(true, nameList).filter(control => !!control._props.rule)
  }

  isFieldTouched = (namePath: ExternalNamePath) => {
    return this.isFieldsTouched([namePath])
  }

  isFieldValidating = (namePath: ExternalNamePath) => {
    return this.isFieldsValidating([namePath])
  }

  // 检查全部字段是否都被触摸过
  isFieldsTouched = (nameList?: ExternalNamePath[]) => {
    const allFields = this.getControlsByName(true, nameList)

    return allFields.some(field => !field._touched)
  }

  isFieldsValidating = (nameList?: ExternalNamePath[]) => {
    const allFields = this.getControlsByName(true, nameList)

    return allFields.some(field => !field._validating)
  }

  // 设置 FormField 的 meta 属性
  metaUpdate = (namePath: ExternalNamePath, meta: Partial<InternalFieldMeta>) => {
    this.getControlsByName(true, [namePath]).forEach((control) => {
      control.metaUpdate(meta)
    })
  }

  // 注册字段
  registerField = (control: FormFieldControl, dispatch: FormDispatchControl) => {
    const { $initial, $state, dispatch: _dispatch } = dispatch

    const popControl = this.pushControl(control, $initial)

    _dispatch({ control, type: 'registerField' })

    // 取消注册， 清除副作用
    return () => {
      const { _key: key, _name: name, _props: props } = control

      popControl()

      const preserve = props.preserve ?? this.$props._props.preserve ?? true

      // 保留数据 不做任何处理
      if (preserve || props.isListField) return

      if ($state.getFieldValue(name) === $initial.getInitialValue(name)) return

      // 不保留数据 && name 合法 && 没有同名字段
      if (!this._controls.map.has(key)) _dispatch({ control, type: 'removeField' })
    }
  }

  constructor(private $props: FormPropsControl) {}
}

/** ==================================================== */
/** 负责表单数据                                           */
/** ==================================================== */
export class FormStateControl<State = any> {
  private _state = {} as State

  // 清除字段卸载时的副作用
  cleanupField = (control: FormFieldControl) => {
    control.metaUpdate({}) // 触发 mounted.current = false
    return this.deleteFieldValue(control._name)
  }

  deleteFieldValue = (namePath?: ExternalNamePath) => {
    const prev = this._state

    if (isUndefined(namePath)) this._state = {} as State
    else this._state = deleteIn(this._state, toArray(namePath))

    return [prev, this._state] as const
  }

  getFieldValue = (namePath: ExternalNamePath) => {
    return getIn(this._state, toArray(namePath))
  }

  getFields = (nameList?: ExternalNamePath[]) => {
    return this.$controls.getControlsByName(true, nameList).map((control) => {
      const name = control._name
      const value = this.getFieldValue(name)
      // TODO: 验证 fields 与 onFieldsChange 一起使用时 errors 是否一直为空
      return { ...control.meta, name, value }
    })
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

    fields.forEach((field) => {
      if (hasOwn(field, 'value')) this.setFieldValue(field.name, field.value)
    })

    return [prev, this._state] as const
  }

  setFieldsValue = (state: Partial<State>) => {
    const prev = this._state
    this._state = mergeValue(this._state, state)

    return [prev, this._state] as const
  }

  constructor(private $controls: FormControlsControl) {}

  get state() {
    return this._state
  }
}

/** ==================================================== */
/** 负责调度逻辑                                           */
/** ==================================================== */
export class FormDispatchControl<State = any> {
  private lastValidate: Promise<void[]> | null = null

  $dependencies = new FormDependenciesControl()

  $watch = new FormWatchValueControl()

  // 调度方法
  dispatch = (action: FormAction) => {
    const { $controls, $initial, $state } = this

    // 由用户事件主动触发
    if (action.type === 'fieldEvent') {
      const { control: field, type, value } = action

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
      const { fields, type } = action
      // 更新字段 meta 属性
      fields.forEach(field => $controls.metaUpdate(field.name, field as any))
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
      const { control: field, type } = action
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
      controls.forEach(control => control.reset())

      const next = $state.state
      return this.updateControl((control) => {
        return control.shouldUpdate(prev, next, type)
      })
    }

    if (process.env.NODE_ENV !== 'production') logger(true, 'invalid action type')
  }

  // 通知依赖字段
  publishDependentControl = (controls: FormFieldControl[]) => {
    const dependencies = new Set<FormFieldControl>()

    this.$dependencies.findDependencies(controls, dependencies)

    const updateControls = Array.from(dependencies)

    const nameList = updateControls.map(({ _name }) => _name)

    nameList.length > 0 && this.validateFields(nameList)

    // 尽量更新所有依赖字段
    return updateControls
  }

  // 注册字段
  registerField = (control: FormFieldControl) => {
    if (control._shouldHook === true) control.forceUpdate()
    return this.$controls.registerField(control, this)
  }

  // 重置字段
  resetFields = (nameList?: ExternalNamePath[]) => {
    this.dispatch({ nameList, type: 'resetFields' })
  }

  // 设置字段值
  setFieldValue = (name: ExternalNamePath, value: any) => {
    this.dispatch({ fields: [{ name, value }], type: 'setFields' })
  }

  // 设置一组字段状态
  setFields = (fields: ExternalFieldData[]) => {
    this.dispatch({ fields, type: 'setFields' })
  }

  // 设置多个字段值
  setFieldsValue = (state: Partial<State>) => {
    this.dispatch({ state, type: 'setFieldsValue' })
  }

  /** ==================================================== */
  /** validate                                             */
  /** ==================================================== */

  // 提交表单
  submitForm = () => {
    this.validateFields().then(this.triggerOnFinish, this.triggerOnFailed)
  }

  // 触发 onFailed 回调
  triggerOnFailed = (errors: any) => {
    this.$props._props.onFailed?.(errors)
  }

  // 触发 onFieldsChange 回调
  triggerOnFieldsChange = (controls: FormFieldControl[]) => {
    const { name, onFieldsChange } = this.$props._props

    const parentForm = this.$props._parent

    if (!onFieldsChange && !parentForm) return

    const { getFields } = this.$state

    const nameList = controls.map(control => control._name)

    const changedFields = getFields(nameList)

    !isUndefined(name) && parentForm?.triggerFormChange(name, changedFields)

    onFieldsChange?.(changedFields, () => getFields())
  }

  // 触发 onFinish 回调
  triggerOnFinish = (values: 'invalid-validate' | State) => {
    const { onFinish } = this.$props._props

    if (!onFinish || values === 'invalid-validate') return

    try {
      onFinish(values)
    }
    catch (error) {
      console.error(error)
    }
  }

  // 触发 onValuesChange 回调
  triggerOnValuesChange = (state: State, path: InternalNamePath) => {
    const { onValuesChange } = this.$props._props

    if (!onValuesChange) return

    const changedValues = cloneWithPath(state, path)

    onValuesChange(changedValues, () => this.$state.getFieldsValue())
  }

  /** ==================================================== */
  /** callbacks                                            */
  /** ==================================================== */
  // 更新视图
  updateControl = (filter: (control: FormFieldControl) => boolean) => {
    // 获取需要更新的 control
    const controls = this.$controls.getControls().filter(filter)

    if (this.$props.useRenderProps) this.$props.forceUpdate()
    else controls.forEach(control => control.forceUpdate())

    // 通知监听事件
    this.$watch.publishWatch()

    // 校验依赖字段
    return this.publishDependentControl(controls)
  }

  // 校验指定字段
  validateField = (namePath: ExternalNamePath) => {
    return this.validateFields([namePath])
  }

  // 校验多个字段, 不传默认校验全部
  validateFields = (fields?: ExternalNamePath[]) => {
    const { getFieldValue, getFieldsValue } = this.$state
    const { getFieldsError, getValidateControls } = this.$controls

    const controls = getValidateControls(fields)

    const validateList = controls.map((control) => {
      const path = control._name

      // 重置字段 meta 属性
      control.metaUpdate({
        errors: [],
        touched: true,
        validating: true,
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
    returnPromise.catch(e => e)

    return returnPromise as Promise<State>
  }

  constructor(
    private $props: FormPropsControl,
    private $controls: FormControlsControl,
    public $state: FormStateControl<State>,
    public $initial: FormInitialControl,
  ) {}
}
