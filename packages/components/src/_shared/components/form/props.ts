import type { FormFieldControl } from './components/field/control'

export type InternalNamePath = (number | string)[]

export type ExternalNamePath = InternalNamePath | number | string

export interface InternalFieldMeta {
  dirty: boolean
  errors: string[]
  name: InternalNamePath
  touched: boolean
  validating: boolean // 字段级别的校验
  warnings: string[]
}

export type ExternalFieldMeta = { mounted: boolean } & InternalFieldMeta

export type InternalFieldData = { value: any } & InternalFieldMeta

export type ExternalFieldData = {
  name: ExternalNamePath
} & Partial<Omit<InternalFieldData, 'name'>>

export type WatchCallBack = () => void

export type FormActionType = FormAction['type']

export type FormAction =
  | {
    control: FormFieldControl
    type: 'fieldEvent' // 用户调用事件主动触发
    value: any
  }
  | {
    control: FormFieldControl
    type: 'registerField'
  }
  | {
    control: FormFieldControl
    type: 'removeField' // 卸载字段时触发
  }
  | {
    fields: ExternalFieldData[]
    type: 'setFields' //  setFields
  }
  | {
    nameList?: ExternalNamePath[]
    type: 'resetFields'
  }
  | {
    state: any
    type: 'setFieldsValue' // setFieldsValue
  }

export interface RuleOptions {
  abortEarly?: boolean
  path: InternalNamePath
}
export interface RuleIssue {
  message: any
}
export interface RuleLike<T> {
  validate: (value: any, options?: RuleOptions) => Promise<T>
}
