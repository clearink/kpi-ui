import { ComponentType, FormEvent, FormHTMLAttributes, ReactNode } from 'react'

export interface FormInstance<S = any> {
  /**
   * @zh 表单收集的数据
   */
  getFieldsValue: (fields?: NamePath[] | true) => S

  /**
   * @zh 表单收集的数据
   */
  getFieldValue: (namePath: NamePath) => any

  /**
   * @zh 设置表单字段数据
   */
  setFieldValue: (namePath: NamePath, value: any, shouldValidate?: boolean) => void

  /**
   * @zh 设置表单数据
   */
  setFieldsValue: (value: Partial<S>, shouldValidate?: boolean) => void

  /**
   * @zh 字段参数校验
   */
  validateField: (namePath: NamePath) => void

  /**
   * @zh 参数校验
   */
  validateFields: (namePath?: NamePath[]) => Promise<S>

  /**
   * @zh 提交事件 自动调用 validate 方法
   */
  submitForm: () => void

  /**
   * @zh 重置一组字段到 `initialValues`
   */
  resetFields: (fields?: NamePath[]) => void

  /**
   * @zh 字段是否 touched 了
   */
  isFieldTouched: (field: NamePath) => boolean

  /**
   * @zh 字段是否都 touched 了
   */
  isFieldsTouched: (fields?: NamePath[]) => boolean

  /**
   * @zh 字段是否处于校验中
   */
  isFieldValidating: (field: NamePath) => boolean

  /**
   * @zh 字段是否都处于校验中
   */
  isFieldsValidating: (fields?: NamePath[]) => boolean

  /**
   * @zh 获取字段错误信息
   *
   */
  getFieldError: (field: NamePath) => string[]

  /**
   * @zh 获取一组字段错误信息
   */
  getFieldsError: (fields?: NamePath[]) => Pick<InternalFieldData, 'errors' | 'name' | 'warnings'>[]

  /**
   * @private
   * @zh 内部方法，外部禁止使用
   */
  getInternalHooks: (secret: symbol) => InternalHookReturn<S> | undefined

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

export interface FormProps<S = any>
  extends Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit' | 'children'> {
  /**
   * @zh 设置 Form 渲染元素，为 null 则不创建 DOM 节点
   * @default form
   */
  tag?: string | null | ComponentType

  /**
   * @zh 校验成功后的回调
   */
  onFinish?: (values: S) => void

  /**
   * @zh 校验失败后的回调
   */
  onFailed?: (errors: any) => void

  /**
   * @zh 表单重置回调
   */
  onReset?: (e: FormEvent) => void

  /**
   * @zh useForm 返回值，不传会自动创建
   */
  form?: FormInstance<S>

  /**
   * @zh 数据校验规则，根据字段名分配给不同的 field
   */
  validationSchema?: BaseSchema<S>

  /**
   * @zh 字段删除时仍然保留数据
   * @default true
   */
  preserve?: boolean

  /**
   * @zh 字段初始化值，仅在字段挂载时生效
   */
  initialValues?: Partial<S>

  children?: ReactNode | ((values: S, form: FormInstance) => ReactNode)

  /**
   * @zh 统一设置字段触发验证的时机
   * @default onChange
   */
  validateTrigger?: string | string[] | false

  /**
   * @zh 通过状态管理（如 redux）控制表单字段，如非强需求不推荐使用
   */
  fields?: FieldData[]

  /**
   * @zh 字段变更时的回调, 仅在用户操作表单项时触发
   */
  onFieldsChange?: (changedFields: FieldData[], getAllFields: () => FieldData[]) => void

  /**
   * @zh 字段值更时的回调, 仅在用户操作表单时触发
   */
  onValuesChange?: (changedValues: any, getAllValues: () => S) => void
}
