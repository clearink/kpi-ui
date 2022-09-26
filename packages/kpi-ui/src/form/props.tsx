import React, { ComponentType, FormEvent, FormHTMLAttributes, ReactNode } from 'react'

export interface FormProps<S = any>
  extends Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit' | 'children'> {
  as?: keyof HTMLElementTagNameMap | null | ComponentType
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
  form?: FormInstance

  children?: ReactNode
}

export interface FormInstance<S = any> {
  state: S
  validate: () => Promise<void>
  submit: () => void
  /**
   * @zh 重置一组字段到 `initialValues`
   */
  resetFields: (fields?: NamePath[]) => void
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

export interface FormFieldProps<State = any> {
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
}
