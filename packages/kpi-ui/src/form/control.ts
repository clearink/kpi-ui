/* eslint-disable max-classes-per-file, class-methods-use-this */

import { MutableRefObject } from 'react'
import isEqual from 'react-fast-compare'
import { isNullish, isUndefined, logger, toArray } from '../_utils'
import { deleteIn, getIn, setIn } from './utils/value'
import { BaseSchema } from '../_utils/form_schema/schema'
import type { NamePath } from './props'
import type {
  FormControlStatus,
  InternalFieldMeta,
  InternalFormFieldProps,
  InternalFormInstance,
  InternalHookReturn,
  InternalNamePath,
  UpdateFilterCallback,
  WatchCallBack,
} from './internal_props'

export const HOOK_MARK = '_$_KPI_FORM_HOOK_MARK_$_'

const EmptyFieldMeta = (): InternalFieldMeta => ({
  dirty: false,
  touched: false,
  pending: false,
  errors: [],
  warnings: [],
})

export class BaseControl {
  forceUpdate = () => {}

  constructor(_forceUpdate: () => void, mounted: MutableRefObject<boolean>) {
    // 必须在组件挂载时调用
    this.forceUpdate = () => mounted.current && _forceUpdate()
  }

  // 获取名称字符串
  static _getName(namePath: NamePath) {
    const paths = toArray(namePath)
    const separator = '_$_KPI_FORM_CONTROL_$_'
    return paths.map((item) => `${typeof item}:${item}`).join(separator)
  }
}

/** ===================================================== */
/** ===================================================== */
/** FormField                                             */
/** ===================================================== */
/** ===================================================== */

export class FormFieldControl extends BaseControl {
  constructor(
    public _name: InternalNamePath, // 记录 name
    _forceUpdate: () => void,
    mounted: MutableRefObject<boolean>
  ) {
    super(_forceUpdate, mounted)
  }

  _parent: FormGroupControl | undefined = undefined
  // protected _parent: FormGroupControl | undefined = undefined

  setParent(parent?: FormGroupControl) {
    this._parent = parent
  }

  _validator: BaseSchema | undefined = undefined

  setValidator(validator?: BaseSchema) {
    if (!(validator instanceof BaseSchema)) return
    this._validator = validator
  }

  // 校验状态 交给 Form.Field 维护
  // 同样的 由于同名字段的影响 不能只更新当前视图
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

  setTouched(touched: boolean) {
    this._touched = touched
  }

  // 未触发 onChange 为 false
  protected _dirty = false

  get dirty() {
    return this._dirty
  }

  setDirty(dirty: boolean) {
    this._dirty = dirty
  }

  // 后续的逻辑就参考 formik
  getFieldMeta(): InternalFieldMeta {
    return {
      dirty: this._dirty,
      touched: this.touched,
      pending: this.pending,
      errors: this._errors,
      warnings: [],
    }
  }

  // 保存错误信息
  private _errors: string[] = []
  // 要不要来个 getFieldError ?

  setErrors(errors: string[]) {
    this._errors = errors
  }

  // TODO: 字段校验
  async validate(value: any) {
    console.log('validate', value)
    if (!this._validator) return value
    return this._validator.validate(value)
  }
}

/** ===================================================== */
/** ===================================================== */
/** FormGroup                                             */
/** ===================================================== */
/** ===================================================== */

export class FormGroupControl<State = any> extends BaseControl {
  injectForm = (): InternalFormInstance<State> => {
    // 向外暴露函数 避免内部数据被更改
    return {
      setFieldValue: this.setFieldValue.bind(this),
      getFieldValue: this.getFieldValue.bind(this),

      // setFieldsValue: this.setFieldsValue.bind(this),
      getFieldsValue: this.getFieldsValue.bind(this),

      validateField: () => Promise.resolve(),
      validateForm: () => Promise.resolve(),

      submitForm: () => {},
      resetForm: () => {},

      /** @private */
      getInternalHooks: this._getInternalHooks.bind(this),
    }
  }

  // TODO: 优化返回值，仅仅返回一些必要的属性
  private _getInternalHooks(secret: string): InternalHookReturn | undefined {
    const matched = secret === HOOK_MARK

    logger.warn(!matched, '`getInternalHooks` is internal usage. Should not call directly.')
    if (!matched) return undefined

    return {
      setInitialValues: this.setInitialValues.bind(this),
      registerField: this.registerField.bind(this),
      registerWatch: this.registerWatch.bind(this),
      subscribe: this.subscribe.bind(this),
      ensureInitialized: this.ensureInitialized.bind(this),
      setFieldMeta: this.setFieldMeta.bind(this),
      // eslint-disable-next-line no-return-assign
      setPreserve: (preserve = true) => (this._preserve = preserve),
    }
  }

  // 收集当前表单的数据
  private getFieldsValue() {
    return [...this._controls.values()].reduce((values, controls) => {
      if (controls.size === 0) return values
      const paths = toArray([...controls][0]._name)
      const value = getIn(this._state, paths)
      return setIn(values ?? ({} as State), paths, value)
    }, {} as State)
  }

  // 默认值
  private _initial = {} as Partial<State>

  // TODO: 待完善
  private setInitialValues(initial?: Partial<State>, mounted = true) {
    if (mounted) return
    this._initial = initial || {}
    const nextState = setIn
    // merge _initial to _state
    // 组件尚未挂载， 将初始值同步到store中去
    // merge value
    // const nextState = setIn({}, )
  }

  getInitialValue(name: NamePath) {
    return getIn(this._initial, toArray(name))
  }

  // 设置字段初始值
  private ensureInitialized(namePath: NamePath, $initialValue?: any) {
    // name 不存在 或者 已存在该值就不设置了
    if (!BaseControl._getName(namePath) || this.getFieldValue(namePath) !== undefined) return

    const topInitial = this.getInitialValue(namePath)
    const initialValue = isUndefined(topInitial) ? $initialValue : topInitial
    logger.warn(
      !isUndefined(topInitial) && !isUndefined($initialValue),
      "form has initialValues, don't set field initialValue"
    )
    if (!isUndefined(initialValue)) this.setFieldValue(namePath, initialValue)
  }

  // TODO: 确定是否要删除
  private updateControl(namePath: NamePath, filter: UpdateFilterCallback | boolean = true) {
    const controls = this.getControl(namePath)
    if (!controls || !controls.size) return
    controls.forEach((control) => {
      // TODO: 如果值相等 且不是强制更新 就不进行更新
      // if (isFunction(filter) && !filter(control)) return
      // 如果值相等 且不是强制更新 就不进行更新
      // if(isBoolean(filter) && filter && diff)
      control.forceUpdate()
    })
  }

  // store
  private _state = {} as State

  private setFieldValue(namePath: NamePath, value: any, shouldValidate = false) {
    if (!BaseControl._getName(namePath)) return
    this._state = setIn(this._state, toArray(namePath), value)

    // 那么要如何才能通知到视图呢？
    const controls = this.getControl(namePath)
    if (!controls || !controls.size) return

    // TODO: 移到组件中处理比较好点，可以做一些优化项。更新视图
    // TODO: 父级使用 render props 时不在此更新视图
    // if (shouldValidate) {
    //   controls.forEach((control) => control.validate())
    // } else {
    controls.forEach((control) => control.forceUpdate())
    // }

    // // 运行订阅事件（目标状态为dirty 时才订阅）
    // const listeners = this._listeners.get(fieldName)
    // listeners?.forEach((controlName) => {
    //   this.get(controlName)?.forEach((control) => {
    //     const controlValue = this.getFieldValue(controlName)
    //     control.validate(controlValue)
    //   })
    // })
    // 这里是否要执行 watchList ?
  }

  getFieldValue(namePath: NamePath) {
    return getIn(this._state, toArray(namePath))
  }

  private deleteFieldValue(namePath: NamePath) {
    const paths = toArray(namePath)
    // 路径为空代表删除整个对象，得到 undefined，故此处重置为空对象
    if (paths.length === 0) this._state = {} as State
    else this._state = deleteIn(this._state, paths)
  }

  private _preserve = true

  private _controls = new Map<string, Set<FormFieldControl>>()

  // 获取 control
  private getControl(namePath: NamePath) {
    const name = BaseControl._getName(namePath)
    return this._controls.get(name)
  }

  // 注册字段
  registerField(namePath: NamePath, control: FormFieldControl) {
    const name = BaseControl._getName(namePath)
    if (!name) return () => {}

    control.setParent(this)
    const cached = this._controls.get(name) ?? new Set<FormFieldControl>()
    logger.warn(
      cached.size > 0,
      `the name=${JSON.stringify(namePath)} is not unique. Try to ensure name is unique`
    )
    this._controls.set(name, cached.add(control))

    // 取消注册， 清除副作用
    return ($preserve?: boolean) => {
      const preserve = $preserve ?? this._preserve
      const controls = this._controls.get(name)
      controls?.delete(control)
      if (controls?.size !== 0) return
      this._controls.delete(name) // 清空空字段
      !preserve && this.deleteFieldValue(namePath) // 没有同名字段且不保留数据
    }
  }

  // 字段依赖 当数据变更时就会重新校验相应的字段
  private _dependencies = new Map<string, Map<string, NamePath>>()

  // 订阅对应的字段变更，并通知相应的 control
  private subscribe(namePath: NamePath, dependencies: NamePath[] = []) {
    const fieldName = BaseControl._getName(namePath)
    if (!fieldName) return () => {} // 为空不进行操作

    const cancels = dependencies.map((dependency) => {
      // 被依赖项
      const depName = BaseControl._getName(dependency)
      if (!depName || fieldName === depName) return () => {}

      const cached = this._dependencies.get(depName) ?? new Map<string, NamePath>()
      this._dependencies.set(depName, cached.set(fieldName, namePath))
      return () => {
        const current = this._dependencies.get(depName)
        current?.delete(fieldName)
        current?.size === 0 && this._dependencies.delete(depName)
      }
    })
    return () => cancels.forEach((cancel) => cancel())
  }

  // 实现 useWatch 功能
  private _watchList: { namePath: NamePath; callback: WatchCallBack<State> }[] = []

  private registerWatch(namePath: NamePath, callback: WatchCallBack) {
    this._watchList.push({ namePath, callback })
    return () => {
      this._watchList = this._watchList.filter(({ callback: fn }) => fn !== callback)
    }
  }

  // 设置 FormField 的 meta 属性
  private setFieldMeta(namePath: NamePath, meta: Partial<InternalFieldMeta>) {
    const controls = this.getControl(namePath)
    if (!controls || !controls.size) return () => {}
    const prev = [...controls][0].getFieldMeta()
    // 同步全部
    controls.forEach((control) => {
      !isNullish(meta.dirty) && control.setDirty(meta.dirty)
      !isNullish(meta.touched) && control.setTouched(meta.touched)
      !isNullish(meta.errors) && control.setErrors(meta.errors)
    })
    const current = [...controls][0].getFieldMeta()
    return (onMetaChange: InternalFormFieldProps['onMetaChange']) => {
      !isEqual(prev, current) && onMetaChange?.(current)
    }
  }

  validate(value: any) {
    // 1. 遍历 _controls
    const list = [...this._controls.values()]
    return Promise.all(list).then(() => true)
  }
}

/** ===================================================== */
/** ===================================================== */
/** FormArray(特殊的FormField)                             */
/** ===================================================== */
/** ===================================================== */

export class FormArrayControl extends FormFieldControl {
  // 注册子控件
  registerField(namePath: NamePath, control: FormFieldControl) {
    if (!this._parent || !(this._parent instanceof FormGroupControl)) {
      // logger.warn('无法正确注册')
      // 父级不存在或者父级不是FormGroupControl
      return () => {}
    }
    return this._parent.registerField(namePath, control)
  }

  /** ===================================================== */
  /** features                                              */
  /** ===================================================== */

  // add() {}

  // delete() {}

  // remove() {}
  // 可以直接操作 root._state
}
