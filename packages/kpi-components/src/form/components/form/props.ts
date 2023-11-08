import type { ColProps } from '../../../col/props'
import type { SizeType } from '../../../config-provider/props'
import type { ExternalFormInstance, InternalFormProps } from '../../../form-internal/props'
import type { FormLabelAlign, FormLayout, NamePath, RequiredMark } from '../../props'

export interface FormInstance<S = any> extends ExternalFormInstance<S> {
  scrollToField: (namePath: NamePath) => void
}

export interface FormProps<S = any> extends Omit<InternalFormProps<S>, 'form'> {
  /**
   * @zh useForm 返回值，不传会自动创建
   */
  form?: FormInstance<S>
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

  size?: SizeType

  disabled?: boolean

  // TODO: 待确定
  scrollToFirstError?: boolean

  /**
   * @zh 必选项标记
   */
  requiredMark?: RequiredMark
}
