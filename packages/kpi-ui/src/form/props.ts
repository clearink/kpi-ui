import type { CSSProperties, ReactNode } from 'react'
import type { ColProps } from '../col/props'
import type {
  FormInstance as $FormInstance,
  FormProps as $FormProps,
  FormFieldProps as $FormFieldProps,
  NamePath as $NamePath,
} from '../_internal/components/form/props'
import { SizeType } from '../_internal/types'

export type NamePath = $NamePath

export type FormLabelAlign = 'left' | 'right'
export type ValidateStatus = 'success' | 'warning' | 'error' | 'validating'
export type RequiredMark = boolean | 'optional'
export type FormLayout = 'horizontal' | 'inline' | 'vertical'

export interface FormProps<State = any> extends Omit<$FormProps<State>, 'form'> {
  /**
   * @zh 是否显示 label 后面的冒号 (只有在属性 layout 为 horizontal 时有效)
   */
  colon?: boolean

  /**
   * @zh 表单布局
   */
  layout?: FormLayout

  labelAlign?: FormLabelAlign

  labelWrap?: boolean

  labelCol?: ColProps

  wrapperCol?: ColProps

  form?: FormInstance<State>

  size?: SizeType

  disabled?: boolean

  // TODO: 待确定
  scrollToFirstError?: {} | boolean

  /**
   * @zh 必选项标记
   */
  requiredMark?: RequiredMark
}

export interface FormItemProps<State = any>
  extends FormItemLabelProps,
    FormItemInputProps,
    Omit<$FormFieldProps<State>, 'children' | 'onMetaChange'> {
  children?: ReactNode | ((form: FormInstance<State>) => ReactNode)

  /**
   * @zh `label` 标签的文本
   */
  label?: ReactNode

  /**
   * @zh 为 `true` 时不带样式，作为纯字段控件使用
   */
  noStyle?: boolean

  /**
   * @zh 必填样式设置。如不设置，则会根据校验规则自动生成
   * @default false
   */
  required?: boolean

  /**
   * @zh 校验状态，如不设置，则会根据校验规则自动生成，可选：'success' 'warning' 'error' 'validating'
   */
  validateStatus?: ValidateStatus

  className?: string

  style?: CSSProperties

  /**
   * @zh 隐藏控件
   */
  hidden?: boolean
}

export interface FormItemLabelProps {
  colon?: boolean
  htmlFor?: string
  label?: React.ReactNode
  labelAlign?: FormLabelAlign
  labelCol?: ColProps
  required?: boolean
  requiredMark?: RequiredMark
  // TODO: 待完善
  tooltip?: any
}

export interface FormItemLabelExtraProps {
  prefixCls: string
}

export interface FormItemInputProps {
  wrapperCol?: ColProps
  extra?: ReactNode
  help?: ReactNode
}

export interface FormItemInputExtraProps {
  prefixCls: string
  children?: ReactNode
}

export interface FormInstance<State = any> extends $FormInstance<State> {
  scrollToField: (namePath: NamePath) => void
}
