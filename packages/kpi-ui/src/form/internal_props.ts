// form 内部类型声明

import type { ArrowFunction } from '../_types'
import type FormGroupControl from './control/form_group'
import type { NamePath, PathItem } from './props'

export interface InternalFormInstance<S = any> {
  /**
   * @zh 表单收集的数据
   */
  state: S

  /**
   * @zh 参数校验
   */
  validate: () => Promise<void>

  /**
   * @zh 提交事件 自动调用 validate 方法
   */
  submit: (onFinish: ArrowFunction, onFailed: ArrowFunction) => void

  /**
   * @zh 重置一组字段到 `initialValues`
   */
  resetFields: (fields?: NamePath[]) => void

  /**
   * @private
   * @zh 内部方法，外部禁止使用
   */
  getInternalHooks: (secret: string) => FormGroupControl<S> | undefined
}

export type GetIn<State extends any, Path extends PathItem[]> = Path extends [infer P, ...infer R]
  ? P extends keyof State
    ? R extends [any, ...any[]]
      ? State[P] extends any
        ? GetIn<State[P], R>
        : undefined
      : State[P]
    : undefined
  : undefined

export type FormControlStatus = 'VALID' | 'INVALID' | 'WARNING' | 'PENDING' | 'DISABLED'
