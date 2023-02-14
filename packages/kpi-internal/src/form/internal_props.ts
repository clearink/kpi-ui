// form 内部类型声明

import type { ReactNode } from 'react'
import type { FormFieldControl, InvalidField } from './control'

import type { FormInstance, FormFieldProps, NamePath, FieldData, FormProps } from './props'

export type InternalNamePath = (string | number)[]
export type WatchCallBack = (value: any) => void
export type ControlsByNameReturn<R extends boolean> = R extends true
  ? FormFieldControl[]
  : (FormFieldControl | InvalidField)[]

export interface InnerReturn {
  functional?: true
  valid?: boolean
  children: ReactNode
}

export type UpdateFieldAction =
  | {
      type: 'fieldEvent' // 用户调用事件主动触发
      name: InternalNamePath
      value: any
    }
  | {
      type: 'setFields' //  setFields
      fields: FieldData[]
    }
  | {
      type: 'setFieldsValue' // setFieldsValue
      state: any
    }
  | {
      type: 'removeField' // 卸载字段时触发
      control: FormFieldControl
    }
  | {
      type: 'registerField'
      control: FormFieldControl
    }
  | {
      type: 'resetFields'
      nameList?: NamePath[]
    }

export type UpdateFieldActionType = UpdateFieldAction['type']

export interface FieldMeta {
  name: InternalNamePath
  dirty: boolean
  touched: boolean
  validating: boolean // 字段级别的校验
  errors: string[]
  warnings: string[]
}

export interface InternalFieldData extends FieldMeta {
  value: any
}
export interface InternalFormFieldProps<S = any> extends Omit<FormFieldProps<S>, 'name'> {
  /**
   * @zh 字段路径
   */
  name: InternalNamePath
}

export interface InternalFormInstance<S = any> extends FormInstance<S> {
  /**
   * @private
   * @zh 内部方法，外部禁止使用
   */
  getInternalHooks: (secret: string) => InternalHookReturn | undefined

  /**
   * @private
   * @zh FormList 使用
   */
  parentNamePath?: InternalNamePath

  /**
   * @private
   * @zh 设置字段校验时的时机
   */
  validateTrigger?: string | string[] | false
}

export interface InternalHookReturn<State = any> {
  /**
   * @private
   * @zh 同步 form 参数
   */
  setFormProps: (props: FormProps) => void

  /**
   * @private
   * @zh 设置默认值
   */
  setInitialValues: (initial: Partial<State> | undefined) => void

  /**
   * @private
   * @zh 注册字段
   */
  registerField: (control: FormFieldControl) => (preserve?: boolean) => void
  /**
   * @private
   * @zh 注册监听事件
   */
  registerWatch: (namePath: NamePath, callback: WatchCallBack) => () => void

  /**
   * @private
   * @zh 根据名称设置 fieldMeta 属性
   */
  setFieldMeta: (namePath: NamePath, meta: Partial<FieldMeta>) => void

  /**
   * @private
   * @zh 订阅依赖字段
   */

  registerSubscribe: (control: FormFieldControl) => () => void

  /**
   * @private
   * @zh 设置字段状态
   */
  setFields: (fields: FieldData[]) => void

  /**
   * @private
   * @zh 字段需要更新时需要发布的事件
   */
  dispatch: (action: UpdateFieldAction) => void

  /**
   * @private
   * @zh 更新字段默认值
   */
  ensureInitialized: (control: FormFieldControl) => void
}
