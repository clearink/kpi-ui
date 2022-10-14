// form 内部类型声明

import type { FormGroupControl } from './control/control'
import type { FormInstance } from './props'

export interface InternalFormInstance<S = any> extends FormInstance<S> {
  /**
   * @private
   * @zh 内部方法，外部禁止使用
   */
  getInternalHooks: (secret: string) => FormGroupControl<S> | undefined

  /**
   * @private
   * @zh 设置字段删除时是否保留数据
   */
  setPreserve: (preserve?: boolean) => void
}

export type InternalNamePath = (string | number)[]
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
