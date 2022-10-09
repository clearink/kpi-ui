import type { ComponentType, FormEvent, FormHTMLAttributes, ReactNode } from 'react'
import type { ArrowFunction } from '../_types'
import type { BaseSchema } from '../_utils/form_schema/schema'
import type FormControl from './form_control'

export interface FormProps<S = any>
  extends Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit' | 'children'> {
  as?:
    | keyof Omit<HTMLElementTagNameMap, 'dir' | 'font' | 'frameset' | 'frame' | 'marquee'>
    | null
    | ComponentType
  /**
   * @zh 校验成功后的回调
   */
  onFinish: (values: S) => void
  /**
   * @zh 校验失败后的回调
   */
  onFailed: (values: S, errors: any) => void
  /**
   * @zh 表单重置回调
   */
  onReset?: (e: FormEvent) => void
  /**
   * @zh useForm 返回值，不传会自动创建
   */
  form?: FormInstance<S>

  /**
   * @zh 数据校验规则，根据字段名分配给不同的 field
   */
  schema?: BaseSchema<S>

  /**
   * @zh 字段删除时仍然保留数据
   * @default true
   */
  preserve?: boolean

  children?: ReactNode
}

export interface FormInstance<S = any> {
  state: S
  validate: () => Promise<void>
  submit: (onFinish: ArrowFunction, onFailed: ArrowFunction) => void

  /**
   * @zh 重置一组字段到 `initialValues`
   */
  resetFields: (fields?: NamePath[]) => void
}

export interface InternalFormInstance<S = any> extends FormInstance<S> {
  getInternalHooks: (secret: string) => FormControl | null
}

export type Forms = Record<string, FormInstance>

export type PathItem = string | number
export type NamePath = PathItem | PathItem[]

export type NotEmptyArray = [any, ...any[]]
export type GetIn<State extends any, Path extends PathItem[]> = Path extends [infer P, ...infer R]
  ? P extends keyof State
    ? R extends NotEmptyArray
      ? State[P] extends any
        ? GetIn<State[P], R>
        : undefined
      : State[P]
    : undefined
  : undefined

export interface FormItemProps<State = any> {
  /**
   * @zh 字段路径
   */
  name?: NamePath
  children?: ReactNode

  /**
   * @zh 为 `true` 时不带样式，作为纯字段控件使用
   */
  noStyle?: boolean
  /**
   * @zh 自定义字段更新逻辑，说明[见下](#shouldUpdate)。
   */
  shouldUpdate?: true | ((prev: State, current: State) => boolean)

  /**
   * @zh 校验规则，设置字段的校验逻辑
   */
  rules?: BaseSchema<State>

  /**
   * @zh 字段删除时仍然保留数据
   * @default true
   */
  preserve?: boolean
}
