import type { InternalFieldMeta, ExternalNamePath } from '../../props'
import type { ExternalFormFieldProps } from '../field/props'
import type { FormListHelpers, InternalListField } from './control/props'

export interface InternalFormListProps extends Pick<ExternalFormFieldProps, 'rule' | 'preserve'> {
  name: ExternalNamePath
  children?: (
    fields: InternalListField[],
    helpers: FormListHelpers,
    meta: InternalFieldMeta
  ) => JSX.Element | React.ReactNode

  /**
   * @zh 设置子元素默认值，如果与 Form 的 initialValues 冲突则以 Form 为准
   */
  initialValue?: any[]
}
