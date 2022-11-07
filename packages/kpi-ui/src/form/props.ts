import type { ComponentType, ReactElement, FormEvent, FormHTMLAttributes, ReactNode } from 'react'
import type { AnyObject, ArrowFunction } from '../_types'
import type { BaseSchema } from '../_utils/form_schema/schema'
import type {
  InternalFieldData,
  FieldMeta,
  UpdateFieldActionType as ActionType,
} from './internal_props'

export interface FieldData extends Partial<Omit<InternalFieldData, 'name'>> {
  name: NamePath
}
export interface FormProps<S = any>
  extends Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit' | 'children'> {
  /**
   * @zh 设置 Form 渲染元素，为 null 则不创建 DOM 节点
   * @default form
   */
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
  validationSchema?: BaseSchema<S>

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

  /**
   * @zh 统一设置字段触发验证的时机
   * @default onChange
   */
  validateTrigger?: string | string[] | false

  /**
   * @zh 通过状态管理（如 redux）控制表单字段，如非强需求不推荐使用
   */
  fields?: FieldData[]

  /**
   * @zh 字段变更时的回调
   */
  onFieldsChange?: () => void
}

/** useForm 向外暴露的实例 */

export interface FormInstance<S = any> {
  /**
   * @zh 表单收集的数据
   */
  getFieldsValue: () => S

  /**
   * @zh 表单收集的数据
   */
  getFieldValue: (namePath: NamePath) => any

  /**
   * @zh 设置表单字段数据
   */
  setFieldValue: (namePath: NamePath, value: any, shouldValidate?: boolean) => void

  /**
   * @zh 设置表单数据
   */
  setFieldsValue: (value: Partial<S>, shouldValidate?: boolean) => void

  /**
   * @zh 字段参数校验
   */
  validateField: (namePath: NamePath) => void

  /**
   * @zh 参数校验
   */
  validateFields: (namePath?: NamePath[]) => Promise<S>

  /**
   * @zh 提交事件 自动调用 validate 方法
   */
  submitForm: (onFinish?: (values: S) => void, onFailed?: ArrowFunction) => void

  /**
   * @zh 重置一组字段到 `initialValues`
   */
  resetFields: (fields?: NamePath[]) => void

  /**
   * @zh 字段是否都 touched 了
   */
  isFieldTouched: (namePath: NamePath) => boolean

  isFieldsTouched: (namePath?: NamePath[]) => boolean

  /**
   * @zh 滚动到对应字段
   */
  scrollToField: (NamePath?: NamePath) => void
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

  children?:
    | ReactElement
    | ((control: AnyObject, meta: FieldMeta, formInstance: FormInstance<State>) => React.ReactNode)

  // /**
  //  * @zh 为 `true` 时不带样式，作为纯字段控件使用
  //  */
  // noStyle?: boolean
  /**
   * @zh 自定义字段更新逻辑，说明[见下](#shouldUpdate)
   * @default false
   */
  shouldUpdate?: boolean | ((prev: State, next: State, action: ActionType) => boolean)

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

  // /**
  //  * @zh 必填样式设置。如不设置，则会根据校验规则自动生成
  //  * @default false
  //  */
  // required?: boolean

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
  validateTrigger?: string | string[] | false

  /**
   * @zh 设置子元素默认值，如果与 Form 的 initialValues 冲突则以 Form 为准
   */
  initialValue?: State

  /**
   * @zh 设置如何将 event 的值转换成字段值
   */
  getValueFromEvent?: (...args: any[]) => any

  /**
   * @zh 为子元素添加额外的属性
   */
  getValueProps?: (value: any) => any

  /**
   * @zh 组件获取值后进行转换，再放入 Form 中。不支持异步
   */
  formatter?: (next: any, prev: any, values: State) => any

  /**
   * @zh 字段状态变更通知
   */
  onMetaChange?: (meta: FieldMeta) => void
}

export interface ListField {
  name: number
  key: number
  isListField: boolean
}
export interface FormArrayHelpers {
  append: (value?: any) => void
  prepend: (value?: any) => void
  remove: (index?: number | number[]) => void
  swap: (from: number, to: number) => void
  move: (from: number, to: number) => void
  replace: (index: number, value: any) => void
  insert: (index: number, value: any) => void
}
export interface FormListProps {
  name: NamePath
  children?: (
    fields: ListField[],
    arrayHelpers: FormArrayHelpers,
    meta: FieldMeta
  ) => JSX.Element | React.ReactNode
  /**
   * @zh 校验规则，设置字段的校验逻辑
   */
  rule?: BaseSchema
  /**
   * @zh 设置字段校验的时机
   * @default onChange
   */
  validateTrigger?: string | string[] | false

  /**
   * @zh 设置子元素默认值，如果与 Form 的 initialValues 冲突则以 Form 为准
   */
  initialValue?: any[]
}
