/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */

import { MutableRefObject } from 'react'
import { isUndefined, toArray } from '../../_utils'
import { deleteIn, getIn, setIn } from '../utils'
import type { NamePath } from '../props'
import type { GetIn, InternalFormInstance } from '../internal_props'
import type { ArrowFunction, Writable } from '../../_types'
import { BaseSchema } from '../../_utils/form_schema/schema'
import logger from '../../_utils/logger'

export class BaseControl {
  forceUpdate = () => {}

  constructor(_forceUpdate: () => void, mounted: MutableRefObject<boolean>) {
    // 必须在组件挂载时调用
    this.forceUpdate = () => mounted.current && _forceUpdate()
  }

  // 获取名称字符串
  static _getName(name?: NamePath) {
    const paths = toArray(name)
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
  _parent: FormGroupControl | undefined = undefined

  setParent(parent?: this['_parent']) {
    this._parent = parent
  }

  // 字段依赖事件
  // 每个字段都可以被多个依赖
  // 当数据变更时就会向其发送事
  _listeners: FormFieldControl[] = []

  // 监听
  private _listen(control: FormFieldControl) {
    this._listeners.push(control)
    return () => {
      this._listeners = this._listeners.filter((_control) => {
        return _control !== control
      })
    }
  }

  // 订阅对应的 control 变更 通知
  subscribe(dependencies: NamePath[] = []) {
    const cancel: ArrowFunction[] = []
    for (const path of dependencies) {
      const name = BaseControl._getName(path)
      // 1. 找到对应的control
      const target = this._parent?.get(name)
      // 2. 向listeners添加数据
      target?.forEach((control) => cancel.push(control._listen(this)))
    }
    return () => {
      cancel.forEach((handler) => handler())
    }
  }

  // rule 改变时 是否需要重新校验呢？
  registerValidation(handler: () => void) {
    // this.validate = handler
  }

  // TODO: 字段校验
  async validate(value: any) {
    // if (!this._rule) return value
    // return this._rule.validate(value)
    // 设置字段状态值
  }
}

/** ===================================================== */
/** ===================================================== */
/** FormGroup                                             */
/** ===================================================== */
/** ===================================================== */

export const HOOK_MARK = '_$_KPI_FORM_HOOK_MARK_$_'
export class FormGroupControl<State = any> extends BaseControl {
  get inject(): InternalFormInstance<State> {
    // 向外暴露函数 避免内部数据被更改
    return {
      getFieldsValue: () => this.getFieldsValue(),
      validate: () => Promise.resolve(),
      submit: () => {},
      resetFields: () => {},
      getInternalHooks: (secret: string) => (secret === HOOK_MARK ? this : undefined),
      // eslint-disable-next-line no-return-assign
      setPreserve: (preserve = true) => (this._preserve = preserve),
    }
  }

  private getFieldsValue() {
    let values = {} as State
    this._controls.forEach(({ path }) => {
      const $path = toArray(path)
      const value = getIn(this._state, $path)
      values = setIn(values, $path, value)
    })
    return values
  }

  // 默认值
  private _initial = {} as Partial<State>

  // TODO: 待完善
  setInitial(initial: Partial<State> | undefined, mounted: boolean) {
    this._initial = initial || {}
    if (!mounted) {
      // 组件尚未挂载， 将初始值同步到store中去
      // merge value
      // const nextState = setIn({}, )
    }
  }

  getInitial(name: NamePath | undefined) {
    return getIn(this._initial, toArray(name))
  }

  // 设置字段初始值
  ensureFieldInitial(name: NamePath | undefined, initialValue: any) {
    // name 不存在 或者 已存在该值就不设置了
    if (!BaseControl._getName(name) || this.getFieldValue(name) !== undefined) return
    const topInitial = this.getInitial(name)
    const $initialValue = isUndefined(topInitial) ? initialValue : topInitial
    logger.warn(
      !isUndefined(topInitial) && !isUndefined(initialValue),
      "form has initialValues, don't set field initialValue"
    )
    if (!isUndefined($initialValue)) this.setFieldValue(name, $initialValue)
  }

  // store
  private _state = {} as State

  setFieldValue(name: NamePath | undefined, value: any) {
    const paths = toArray(name)
    if (!paths.length) return
    this._state = setIn(this._state, paths, value)
    // 更新视图
    this.get(name)?.forEach((control) => control.forceUpdate())
  }

  getFieldValue(name: NamePath | undefined) {
    return getIn(this._state, toArray(name))
  }

  deleteFieldValue(name?: NamePath) {
    this._state = deleteIn(this._state, toArray(name))
  }

  private _preserve = true

  setPreserve(preserve = true) {
    this._preserve = preserve
  }

  _controls = new Map<string, { path: NamePath; control: Set<FormFieldControl> }>()

  // 获取 control
  get(namePath?: NamePath) {
    const name = BaseControl._getName(namePath)
    return this._controls.get(name)?.control
  }

  /**
   * 同名 schema 会有问题 校验时无法正确拿到对应的rule 是否需要外部处理呢？
   */
  register(control: FormFieldControl, path?: NamePath) {
    const name = BaseControl._getName(path)

    const cache = this._controls.get(name)
    if (cache) cache.control.add(control)
    else if (name) this._controls.set(name, { path: path!, control: new Set([control]) })

    return (preserve?: boolean) => {
      const $preserve = preserve ?? this._preserve
      if (!$preserve) this.deleteFieldValue(path)
      const controls = this._controls.get(name)?.control
      if (!controls) return
      controls.delete(control)
      // 清除空的字段集合
      controls.size === 0 && this._controls.delete(name)
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
  _parent: FormGroupControl | undefined = undefined

  setParent(parent: this['_parent']) {
    this._parent = parent
  }

  // 注册子控件
  register(control: FormFieldControl, namePath?: NamePath) {
    if (!this._parent || !(this._parent instanceof FormGroupControl)) {
      // logger.warn('无法正确注册')
      // 父级不存在或者父级不是FormGroupControl
      return () => {}
    }
    return this._parent.register(control, namePath)
  }

  /** ===================================================== */
  /** features                                              */
  /** ===================================================== */

  // add() {}

  // delete() {}

  // remove() {}
  // 可以直接操作 root._state
}

/**
 * QA:
 * 1. 字段注册
 * FormGroup 可以注册
 * FormArray 可以注册
 * FormField 不能注册
 *
 * 2. 同名字段（正常运行，二者需要同步数据，那么就不能使用map了，需要用数组去存储） 当数据更改时需要调用forceUpdate更新视图
 *
 * 3. 没有名称的字段（不进行注册操作）
 */
