// form 内部类型声明

import type { FormFieldControl } from './control/control'
import type { FormInstance, FormFieldProps, NamePath } from './props'

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

export type InternalNamePath = (string | number)[]
export interface InternalFormFieldProps<S = any> extends Omit<FormFieldProps<S>, 'name'> {
  /**
   * @zh 字段路径
   */
  name: InternalNamePath

  /**
   *
   */
  onStatusChange?: () => void
}
export type WatchCallBack<S = any> = (value: any, state: S) => void

// export type GetIn<State extends any, Path extends PathItem[]> = Path extends [infer P, ...infer R]
//   ? P extends keyof State
//     ? R extends [any, ...any[]]
//       ? State[P] extends any
//         ? GetIn<State[P], R>
//         : undefined
//       : State[P]
//     : undefined
//   : undefined

export type FormControlStatus = 'VALID' | 'INVALID' | 'WARNING' | 'PENDING' | 'DISABLED'
// public getIn<N extends PathItem>(name: N): GetIn<State, [N]>
// public getIn<N extends PathItem, M extends [N, ...N[]]>(name: M): GetIn<State, M>
// public getIn<N extends Readonly<PathItem[]>>(name: N): GetIn<State, Writable<N>>
// public getIn<N extends PathItem | PathItem[]>(name: N) {
//   return getIn(this._state, toArray(name))
// }

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
  setInitialValues: (initial: Partial<State> | undefined, mounted: boolean) => void

  /**
   * @private
   * @zh 注册字段
   */
  registerField: (control: FormFieldControl, namePath?: NamePath) => (preserve?: boolean) => void
  /**
   * @private
   * @zh 注册监听事件
   */
  registerWatch: (namePath: NamePath | undefined, callback: WatchCallBack) => () => void

  /**
   * @private
   * @zh 订阅依赖字段
   */

  subscribe: (namePath?: NamePath, dependencies?: NamePath[]) => () => void

  /**
   * @private
   * @zh 设置字段初始值
   */
  ensureInitialized: (
    mounted: boolean,
    initialValue: any,
    namePath?: NamePath
  ) => FormFieldControl[] | undefined
}
