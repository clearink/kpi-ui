// form 内部类型声明

import type { FormFieldControl } from './control'
import type { FormInstance, FormFieldProps, NamePath } from './props'

export type InternalNamePath = (string | number)[]
export type FormControlStatus = 'VALID' | 'INVALID' | 'WARNING' | 'PENDING' | 'DISABLED'
export type WatchCallBack<S = any> = (value: any, state: S) => void
export type UpdateFilterCallback = (control: FormFieldControl) => boolean
export type FieldHandlers = Pick<InternalFormFieldProps, 'rule' | 'shouldUpdate' | 'onMetaChange'>
export type InternalFieldMeta = {
  dirty: boolean
  touched: boolean
  pending: boolean // 字段级别的校验
  errors: string[]
  warnings: string[]
}

export interface InternalFormFieldProps<S = any> extends Omit<FormFieldProps<S>, 'name'> {
  /**
   * @zh 字段路径
   */
  name: InternalNamePath
}

export interface InternalFormInstance<S = any> extends FormInstance<S> {
  /**
   * @private
   * @zh 内部方法，外部禁止使用
   */
  getInternalHooks: (secret: string) => InternalHookReturn | undefined

  /**
   * @private
   * @zh FormList 使用 TOD: 是否要额外增加一个 context 呢？
   */
  parentNamePath?: InternalNamePath

  /**
   * @private
   * @zh 设置字段校验时的时机
   */
  validateTrigger?: string | string[] | false
}

export interface InternalHookReturn<State = any> {
  /**
   * @private
   * @zh 设置字段删除时是否保留数据
   */
  setPreserve: (preserve?: boolean) => void

  /**
   * @private
   * @zh 设置默认值
   */
  setInitialValues: (initial: Partial<State> | undefined) => void

  /**
   * @private
   * @zh 注册字段
   */
  registerField: (namePath: NamePath, control: FormFieldControl) => (preserve?: boolean) => void
  /**
   * @private
   * @zh 注册监听事件
   */
  registerWatch: (namePath: NamePath, callback: WatchCallBack) => () => void

  /**
   * @private
   * @zh 订阅依赖字段
   */

  subscribe: (namePath: NamePath, dependencies?: NamePath[]) => () => void

  /**
   * @private
   * @zh 设置字段初始值
   */
  ensureInitialized: (namePath: NamePath, initialValue: any) => void

  /**
   * @private
   * @zh 根据名称设置 fieldMeta 属性
   */
  setFieldMeta: (namePath: NamePath, meta: Partial<InternalFieldMeta>) => void

  /**
   * @private
   * @zh 更新 FormFieldControl
   */
  // updateControl: (namePath?: NamePath, filter?: UpdateFilterCallback | boolean) => void
}

// export type GetIn<State extends any, Path extends PathItem[]> = Path extends [infer P, ...infer R]
//   ? P extends keyof State
//     ? R extends [any, ...any[]]
//       ? State[P] extends any
//         ? GetIn<State[P], R>
//         : undefined
//       : State[P]
//     : undefined
//   : undefined

// public getIn<N extends PathItem>(name: N): GetIn<State, [N]>
// public getIn<N extends PathItem, M extends [N, ...N[]]>(name: M): GetIn<State, M>
// public getIn<N extends Readonly<PathItem[]>>(name: N): GetIn<State, Writable<N>>
// public getIn<N extends PathItem | PathItem[]>(name: N) {
//   return getIn(this._state, toArray(name))
// }
