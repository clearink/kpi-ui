import type { CSSProperties, ReactNode } from 'react'
import type { ExternalFormFieldProps } from '../../../_internal/form/_shared/props'
import type { ValidateStatus } from '../../props'
import type { FormInstance } from '../form/props'
import type { FormItemInputProps } from '../item-input/props'
import type { FormItemLabelProps } from '../item-label/props'

export interface FormItemProps<State = any>
  extends Omit<FormItemLabelProps, 'required'>,
    Pick<FormItemInputProps, 'wrapperCol' | 'extra' | 'help'>,
    Omit<ExternalFormFieldProps<State>, 'children' | 'onMetaChange'> {
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
