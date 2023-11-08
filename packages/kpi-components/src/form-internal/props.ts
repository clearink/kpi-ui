import type { FormFieldControl } from './components/field/control'

export type * from './components/form/props'
export type * from './components/form/control/props'
export type * from './components/field/props'
export type * from './components/list/props'
export type * from './components/list/control/props'
export type * from './components/provider/props'

export type InternalNamePath = (string | number)[]

export type ExternalNamePath = string | number | InternalNamePath

export interface InternalFieldMeta {
  name: InternalNamePath
  dirty: boolean
  touched: boolean
  validating: boolean // 字段级别的校验
  errors: string[]
  warnings: string[]
}

export type ExternalFieldMeta = InternalFieldMeta & { mounted: boolean }

export type InternalFieldData = InternalFieldMeta & { value: any }

export type ExternalFieldData = Partial<Omit<InternalFieldData, 'name'>> & {
  name: ExternalNamePath
}

export type WatchCallBack = () => void

export type FormActionType = FormAction['type']

export type FormAction =
  | {
      type: 'fieldEvent' // 用户调用事件主动触发
      control: FormFieldControl
      value: any
    }
  | {
      type: 'setFields' //  setFields
      fields: ExternalFieldData[]
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
      nameList?: ExternalNamePath[]
    }
