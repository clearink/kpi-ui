import type { ReactElement } from 'react'
import type { AnyObject } from '../../../types'
import type {
  FormActionType,
  InternalFieldMeta,
  ExternalNamePath,
  InternalNamePath,
  ExternalFieldMeta,
} from '../../props'
import type { ExternalFormInstance } from '../form/control/props'

export interface InternalFormFieldProps<S = any> {
  /**
   * @zh 字段路径
   */
  name: InternalNamePath

  children?:
    | ReactElement
    | ((
        control: AnyObject,
        meta: InternalFieldMeta,
        formInstance: ExternalFormInstance<S>
      ) => React.ReactNode)

  /**
   * @zh 自定义字段更新逻辑，说明[见下](#shouldUpdate)
   * @default false
   */
  shouldUpdate?: boolean | ((prev: S, next: S, action: FormActionType) => boolean)

  /**
   * @zh 校验规则，设置字段的校验逻辑
   */
  rule?: any // BaseSchema<any>

  /**
   * @zh 字段删除时仍然保留数据
   */
  preserve?: boolean

  /**
   * @zh 设置依赖字段
   */
  dependencies?: ExternalNamePath[]

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
   * @zh 当某一规则校验不通过时，是否停止剩下的规则的校验
   * @default false
   */
  validateFirst?: boolean

  /**
   * @zh 设置字段校验的时机
   * @default onChange
   */
  validateTrigger?: string | string[] | false

  /**
   * @zh 设置子元素默认值，如果与 Form 的 initialValues 冲突则以 Form 为准
   */
  initialValue?: S

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
  formatter?: (next: any, prev: any, values: S) => any

  /**
   * @zh 字段状态变更通知
   */
  onMetaChange?: (meta: ExternalFieldMeta) => void

  /** @private 内部使用 */
  isListField?: boolean
}

export interface ExternalFormFieldProps<S = any> extends Omit<InternalFormFieldProps<S>, 'name'> {
  /**
   * @zh 字段路径
   */
  name?: ExternalNamePath
}
