import type { ExternalFormInstance, InternalFormProps } from '@comps/_shared/components'
import type { SizeType } from '@comps/_shared/contexts'
import type { ColProps } from '@comps/col/props'

import type { FormLabelAlign, FormLayout, NamePath, RequiredMark } from '../../props'

export interface FormInstance<S = any> extends ExternalFormInstance<S> {
  scrollToField: (namePath: NamePath) => void
}

export interface FormProps<S = any> extends Omit<InternalFormProps<S>, 'form'> {
  /**
   * @zh 是否显示 label 后面的冒号 (只有在属性 layout 为 horizontal 时有效)
   */
  colon?: boolean
  disabled?: boolean

  /**
   * @zh useForm 返回值，不传会自动创建
   */
  form?: FormInstance<S>

  labelAlign?: FormLabelAlign

  labelCol?: ColProps

  labelWrap?: boolean

  /**
   * @zh 表单布局
   */
  layout?: FormLayout

  /**
   * @zh 必选项标记
   */
  requiredMark?: RequiredMark

  // TODO: 待确定
  scrollToFirstError?: boolean

  size?: SizeType

  wrapperCol?: ColProps
}

/**
 * |---------------------------------------------------------|
 * |---------------------------------------------------------|
 * |                      default props                      |
 * |---------------------------------------------------------|
 * |---------------------------------------------------------|
 */

export const defaultFormProps: Partial<FormProps> = {
  colon: true,
  layout: 'horizontal',
  requiredMark: true,
}
