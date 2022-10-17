import type { ComponentType, FormEvent, FormHTMLAttributes, ReactNode } from 'react'
import { ArrowFunction } from '../_types'
import type { BaseSchema } from '../_utils/form_schema/schema'

export interface FormProps<S = any>
  extends Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit' | 'children'> {
  as?:
    | keyof Omit<HTMLElementTagNameMap, 'dir' | 'font' | 'frameset' | 'frame' | 'marquee'>
    | null
    | ComponentType
  /**
   * @zh 校验成功后的回调
   */
  onFinish?: (values: S) => void
  /**
   * @zh 校验失败后的回调
   */
  onFailed?: (values: S, errors: any) => void
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

  /**
   * @zh 字段初始化值，仅在字段挂载时生效
   */
  initialValues?: Partial<S>

  children?: ReactNode
}

/** useForm 向外暴露的实例 */

export interface FormInstance<S = any> {
  /**
   * @zh 表单收集的数据
   */
  getFieldsValue: () => S

  /**
   * @zh 参数校验
   */
  validate: () => Promise<void>

  /**
   * @zh 提交事件 自动调用 validate 方法
   */
  submit: (onFinish?: ArrowFunction, onFailed?: ArrowFunction) => void

  /**
   * @zh 重置一组字段到 `initialValues`
   */
  resetFields: (fields?: NamePath[]) => void
}

export type Forms = Record<string, FormInstance>

export type NamePath = string | number | (string | number)[]

export interface FormFieldProps<State = any> {
  /**
   * @zh 字段路径
   */
  name?: NamePath

  /**
   * @zh `label` 标签的文本
   */
  label?: ReactNode

  children?: ReactNode

  /**
   * @zh 为 `true` 时不带样式，作为纯字段控件使用
   */
  noStyle?: boolean
  /**
   * @zh 自定义字段更新逻辑，说明[见下](#shouldUpdate)
   * @default false
   */
  shouldUpdate?: boolean | ((prev: State, current: State) => boolean)

  /**
   * @zh 校验规则，设置字段的校验逻辑
   */
  rule?: BaseSchema<State>

  /**
   * @zh 字段删除时仍然保留数据
   */
  preserve?: boolean

  /**
   * @zh 设置依赖字段
   */
  dependencies?: NamePath[]

  /**
   * @zh 注入属性名称(名称待优化)
   * @default value
   */
  valuePropName?: string
  /**
   * @zh 收集字段时机
   * @default onChange
   */
  trigger?: string

  /**
   * @zh 必填样式设置。如不设置，则会根据校验规则自动生成
   * @default false
   */
  required?: boolean

  /**
   * @zh 当某一规则校验不通过时，是否停止剩下的规则的校验
   * @default false
   */
  validateFirst?: boolean

  /**
   * @zh 校验状态，如不设置，则会根据校验规则自动生成，可选：'success' 'warning' 'error' 'validating'
   */
  validateStatus?: 'success' | 'warning' | 'error' | 'validating'

  /**
   * @zh 设置字段校验的时机
   * @default onChange
   */
  validateTrigger?: string | string[]

  /**
   * @zh 设置子元素默认值，如果与 Form 的 initialValues 冲突则以 Form 为准
   */
  initialValue?: State
}
