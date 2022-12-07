// form 内部类型声明

import type { FormFieldControl, InvalidField } from './control'

import type { FormInstance, FormFieldProps, NamePath, FieldData, FormProps } from './props'

export type InternalNamePath = (string | number)[]
export type WatchCallBack = (value: any) => void
export type ControlsByNameReturn<R extends boolean> = R extends true
  ? FormFieldControl[]
  : (FormFieldControl | InvalidField)[]

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
      cleanup: boolean
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
  dirty: boolean
  touched: boolean
  validating: boolean // 字段级别的校验
  errors: string[]
  warnings: string[]
}

export interface InternalFieldData extends FieldMeta {
  name: InternalNamePath
  value: any
}
export interface InternalFormFieldProps<S = any> extends Omit<FormFieldProps<S>, 'name'> {
  /**
   * @zh 字段路径
   */
  name: InternalNamePath

  /**
   * @zh 是否为列表项字段
   */
  isListField?: boolean
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

  /**
   * @private
   * @zh 表单名称，用于区分不同的表单
   */
  formName?: string
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
}

// export type GetIn<State extends any, Path extends PathItem[]> = Path extends [infer P, ...infer R]
//   ? P extends keyof State
//     ? R extends [any, ...any[]]
//       ? State[P] extends any
//         ? GetIn<State[P], R>
//         : undefined
//       : State[P]
//     : undefined
//   : undefined

// public getIn<N extends PathItem>(name: N): GetIn<State, [N]>
// public getIn<N extends PathItem, M extends [N, ...N[]]>(name: M): GetIn<State, M>
// public getIn<N extends Readonly<PathItem[]>>(name: N): GetIn<State, Writable<N>>
// public getIn<N extends PathItem | PathItem[]>(name: N) {
//   return getIn(this._state, toArray(name))
// }
