/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */

import { MutableRefObject } from 'react'
import { toArray } from '../../_utils'
import { deleteIn, getIn, setIn } from '../utils'
import type { NamePath, PathItem } from '../props'
import type { GetIn, InternalFormInstance } from '../internal_props'
import type { ArrowFunction, Writable } from '../../_types'
import { BaseSchema } from '../../_utils/form_schema/schema'

/** ===================================================== */
/** ===================================================== */
/** BaseControl                                           */
/** ===================================================== */
/** ===================================================== */

export class BaseControl<State = any> {
  constructor(public forceUpdate: () => void) {}

  _state: State | undefined = undefined

  setState(state: State) {
    this._state = state
  }

  // 获取名称字符串
  static _getName(name?: NamePath) {
    const paths = toArray(name)
    // log.warn(!paths.length, "name不能为空");
    const separator = '_$_KPI_FORM_CONTROL_$_'
    return paths.map((item) => `${typeof item}:${item}`).join(separator)
  }

  _parent: FormGroupControl | FormArrayControl | undefined = undefined

  setParent(parent?: this['_parent']) {
    this._parent = parent
  }

  get root() {
    let root = this as unknown as FormGroupControl | FormArrayControl
    while (root._parent) root = root._parent
    return root
  }

  // 字段依赖事件
  // 每个字段都可以被多个依赖
  // 当数据变更时就会向其发送事
  _listeners: BaseControl[] = []

  // 监听
  listen(control: BaseControl) {
    this._listeners.push(control)
    return () => {
      this._listeners = this._listeners.filter((_control) => {
        return _control !== control
      })
    }
  }

  // 订阅
  subscribe(dependencies: NamePath[] = []) {
    const { root } = this
    const cancel: ArrowFunction[] = []
    for (const path of dependencies) {
      const target = root.get(path)
      // 1. 找到对应的control
      if (!target) continue
      // 2. 向listeners添加数据
      cancel.push(target.listen(this))
    }
    return () => {
      cancel.forEach((handler) => handler())
    }
  }

  // // 实现 useWatch 当对应namePath 变更时通知
  // _watchList: ((value: any) => void)[] = []

  // watch(handler: (value: any) => void) {
  //   this._watchList.push(handler)
  //   return () => {
  //     this._watchList = this._watchList.filter((fn) => fn !== handler)
  //   }
  // }

  _rule: BaseSchema | undefined = undefined

  // 字段校验
  async validate(value: any) {
    if (!this._rule) return value
    return this._rule.validate(value)
    // 设置字段状态值
  }
}

/** ===================================================== */
/** ===================================================== */
/** FormField                                             */
/** ===================================================== */
/** ===================================================== */

export class FormFieldControl<State = any> extends BaseControl<State> {
  _rule: BaseSchema | undefined = undefined

  // 字段校验
  async validate(value: any) {
    if (!this._rule) return value
    return this._rule.validate(value)
    // 设置字段状态值
  }
}

/** ===================================================== */
/** ===================================================== */
/** FormGroup                                             */
/** ===================================================== */
/** ===================================================== */

export const HOOK_MARK = '_$_KPI_FORM_HOOK_MARK_$_'
export class FormGroupControl<State = any> extends BaseControl<State> {
  get state() {
    return {} as State
  }

  get inject(): InternalFormInstance<State> {
    return {
      state: this.state,
      validate: () => Promise.resolve(),
      submit: () => {},
      resetFields: () => {},
      getInternalHooks: (secret: string) => (secret === HOOK_MARK ? this : undefined),
      // eslint-disable-next-line no-return-assign
      setPreserve: (preserve = true) => (this._preserve = preserve),
    }
  }

  override _state = {} as State

  setIn(name: NamePath, value: any) {
    // 执行监听事件
    const paths = toArray(name)
    this._state = setIn(this._state, paths, value)
  }

  getIn<N extends PathItem>(name: N): GetIn<State, [N]>
  getIn<N extends PathItem, M extends [N, ...N[]]>(name: M): GetIn<State, M>
  getIn<N extends Readonly<PathItem[]>>(name: N): GetIn<State, Writable<N>>
  getIn<N extends PathItem | PathItem[]>(name: N) {
    return getIn(this._state, toArray(name))
  }

  deleteIn(name?: NamePath) {
    this._state = deleteIn(this._state, toArray(name))
  }

  _preserve = true

  setPreserve(preserve = true) {
    this._preserve = preserve
  }

  _controls = new Map<string, { path: NamePath; control: BaseControl }>()

  // 获取 control
  get(namePath?: NamePath) {
    const name = BaseControl._getName(namePath)
    return this._controls.get(name)?.control
  }

  register(ref: MutableRefObject<BaseControl>, path?: NamePath) {
    const name = BaseControl._getName(path)
    // 如果有同名的，将已注册的控件值赋值给他
    if (this._controls.has(name)) {
      ref.current = this._controls.get(name)!.control
    } else {
      this._controls.set(name, { path: path!, control: ref.current })
    }
    return (preserve?: boolean) => {
      const $preserve = preserve ?? this._preserve
      if (!$preserve) this.deleteIn(path)
      this._controls.delete(name)
    }
  }

  override validate(value: any) {
    // 1. 遍历 _controls
    const list = [...this._controls.values()].map(({ name, control }) => {
      const $value = this.getIn(name)
      return control.validate($value)
    })
    return Promise.all(list).then(() => true)
  }
}

/** ===================================================== */
/** ===================================================== */
/** FormArray                                             */
/** ===================================================== */
/** ===================================================== */
export class FormArrayControl<State = any[]> extends BaseControl<State> {
  override _state = [] as unknown as State

  _controls = new Map<string, { path: NamePath; control: BaseControl }>()

  // 获取 control
  get(namePath?: NamePath) {
    const name = BaseControl._getName(namePath)
    return this._controls.get(name)?.control
  }

  // 注册子控件
  register(control: BaseControl<State>, namePath?: NamePath) {
    if (!(this.root instanceof FormGroupControl)) return () => {}
    this.root.register(control, namePath)
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
