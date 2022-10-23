/* eslint-disable max-classes-per-file, class-methods-use-this */

import { MutableRefObject } from 'react'
import isEqual from 'react-fast-compare'
import { isFunction, isNullish, isObjectLike, isUndefined, logger, toArray } from '../_utils'
import { deleteIn, getIn, setIn } from './utils/value'
import { BaseSchema } from '../_utils/form_schema/schema'
import type { SchemaIssue } from '../_utils/form_schema/interface'
import type { NamePath } from './props'
import type {
  FieldHandlers,
  FormControlStatus,
  InternalFieldMeta,
  InternalFormInstance,
  InternalHookReturn,
  InternalNamePath,
  UpdateFilterCallback,
  WatchCallBack,
} from './internal_props'

export const HOOK_MARK = '_$_KPI_FORM_HOOK_MARK_$_'

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

  // 是否被隐式依赖,形如 ['username'] 与 ['username', 'a', 'b']
  isImplicate(namePath: NamePath) {
    const path = toArray(namePath)
    const len = Math.min(path.length, this._name.length)
    for (let i = 0; i < len; i++) {
      if (path[i] !== this._name[i]) return false
    }
    // 没有name 时的逻辑?
    return path.length > 0
  }

  // 是否应该更新该 control
  shouldUpdate(namePath: NamePath) {
    if (this.isImplicate(namePath)) return true
    const { shouldUpdate } = this._fieldHandlers
    if (shouldUpdate === true) return true
    // TODO: 如何拿到之前的 state ?
    // if (isFunction(shouldUpdate)) return shouldUpdate(prev, current)
  }

  _parent: FormGroupControl | undefined = undefined

  setParent(parent?: FormGroupControl) {
    this._parent = parent
    return this
  }

  _fieldHandlers: FieldHandlers = {}

  provideHandlers(fieldHandlers: FieldHandlers) {
    this._fieldHandlers = isObjectLike(fieldHandlers) ? fieldHandlers : {}
  }

  private _pending = false

  setPending(pending: boolean) {
    this._pending = pending
  }

  protected _touched = false // 以是否触发 blur 事件为准

  setTouched(touched: boolean) {
    this._touched = touched
  }

  // 未触发 onChange 为 false
  protected _dirty = false

  setDirty(dirty: boolean) {
    this._dirty = dirty
  }

  setFieldMeta(meta: Partial<InternalFieldMeta>) {
    // 自动触发 onMetaChange 事件
    const prev = this.getFieldMeta()
    // 同步全部
    !isNullish(meta.dirty) && this.setDirty(meta.dirty)
    !isNullish(meta.pending) && this.setPending(meta.pending)
    !isNullish(meta.touched) && this.setTouched(meta.touched)
    !isNullish(meta.errors) && this.setErrors(meta.errors)
    const current = this.getFieldMeta()
    if (!isEqual(prev, current)) this._fieldHandlers.onMetaChange?.(current)
  }

  // 后续的逻辑就参考 formik
  getFieldMeta(): InternalFieldMeta {
    return {
      dirty: this._dirty,
      touched: this._touched,
      pending: this._pending,
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

  async validate(value: any) {
    const { rule: validator } = this._fieldHandlers
    if (!(validator instanceof BaseSchema)) return
    try {
      this.setFieldMeta({ pending: true })
      await validator.validate(value)
      this.setFieldMeta({ pending: false })
    } catch (error) {
      const { issues = [] } = error as { issues: SchemaIssue[] }
      const errors = issues.map((issue) => issue.message)
      this.setFieldMeta({ pending: false, errors })
    } finally {
      this.forceUpdate()
    }
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

      validateField: this.validateField.bind(this),
      validateForm: () => Promise.resolve(),

      submitForm: () => {},
      resetForm: () => {},

      /** @private */
      getInternalHooks: this._getInternalHooks.bind(this),
    }
  }

  private _preserve = true

  // 内部属性
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

  private setInitialValues(initial?: Partial<State>) {
    this._initial = initial || {}
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

  private updateControl(namePath: NamePath) {
    for (const control of this.controls) {
      if (!control.shouldUpdate(namePath)) continue
      control.forceUpdate()
    }
  }

  // store
  private _state = {} as State

  private setFieldValue(namePath: NamePath, value: any, shouldValidate = false) {
    if (!BaseControl._getName(namePath)) return
    this._state = setIn(this._state, toArray(namePath), value)

    this.updateControl(namePath)
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

  private _controls = new Map<string, Set<FormFieldControl>>()

  get controls() {
    return [...this._controls.values()].reduce(
      (res, set) => res.concat([...set.values()]),
      [] as FormFieldControl[]
    )
  }

  // 获取 control
  private getControl(namePath: NamePath) {
    const name = BaseControl._getName(namePath)
    return this._controls.get(name)
  }

  // 注册字段 // 同名字段是个很恶心的东西
  registerField(namePath: NamePath, control: FormFieldControl) {
    const name = BaseControl._getName(namePath)
    if (!name) return () => {}

    const cached = this._controls.get(name) ?? new Set<FormFieldControl>()
    logger.error(cached.size > 0, `the name=${JSON.stringify(namePath)} field has existed.`)
    this._controls.set(name, cached.add(control.setParent(this)))

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
    for (const control of this.controls) {
      if (!control.isImplicate(namePath)) continue
      control.setFieldMeta(meta)
    }
  }

  validate(value: any) {
    // 1. 遍历 _controls
    const list = [...this._controls.values()]
    return Promise.all(list).then(() => true)
  }

  // 校验指定字段
  validateField(namePath: NamePath) {
    for (const control of this.controls) {
      // 隐式包含也要校验
      if (!control.isImplicate(namePath)) continue
      const value = this.getFieldValue(namePath)
      control.validate(value)
    }
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
