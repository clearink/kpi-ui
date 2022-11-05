/* eslint-disable react/function-component-definition */
/* eslint-disable func-names */
import { hasOwn, isArray, isFunction, isObjectLike, logger, toArray } from '../../_utils'

import type { AnyObject } from '../../_types'
import { FormArrayControl, FormFieldControl } from '../control'
import type {
  FieldMeta,
  InternalFormFieldProps,
  InternalFormInstance,
  InternalHookReturn,
  InternalNamePath,
} from '../internal_props'
import type { FormInstance, FormArrayHelpers, FormListProps, ListField } from '../props'

// 从event中获取字段值函数
function defaultGetValueFromEvent(valuePropName: string) {
  return (event: any) => {
    if (!event || !isObjectLike(event.target)) return event
    if (!hasOwn(event.target, valuePropName)) return event
    return (event.target as HTMLInputElement)[valuePropName]
  }
}

/** 收集注入到Form.Field children 的属性 */
export function collectFieldInjectProps(
  props: InternalFormFieldProps,
  context: InternalFormInstance,
  control: FormFieldControl,
  internalHook?: InternalHookReturn
) {
  const {
    name,
    trigger,
    validateTrigger,
    valuePropName,
    getValueFromEvent = defaultGetValueFromEvent(valuePropName!),
    formatter,
    getValueProps: $getValueProps,
  } = props
  return (childProps: AnyObject = {}) => {
    // name 不合法不应该提供下列数据
    if (!control._key) return childProps

    const value = context.getFieldValue(name)

    // 获取 event value 字段函数 getValueProps 与 valuePropName 互斥
    const getValueProps = $getValueProps || ((val: AnyObject) => ({ [valuePropName!]: val }))

    const injectProps = {
      ...childProps,
      ...getValueProps(value),
      // id 不知道有啥用 难不成用来 scrollError ?
      id: control._getId(context.formName),
      // 触发条件
      [trigger!]: (...args: any[]) => {
        // 设置所有所有同名字段的 meta 属性

        let next = getValueFromEvent(...args)
        if (isFunction(formatter)) {
          const formValues = context.getFieldsValue()
          next = formatter(next, value, formValues)
        }

        internalHook?.dispatch({ name, value: next, type: 'fieldEvent' })

        internalHook?.setFieldMeta(name, { touched: true, dirty: true })

        // originTrigger
        childProps[trigger!]?.(...args)
      },
    }

    // 校验触发时机
    const triggerList = toArray((validateTrigger ?? context.validateTrigger) || [])
    return triggerList.reduce((res, triggerName) => {
      const handler = (...args: any[]) => {
        // 执行原始值
        injectProps[triggerName]?.(...args)
        context.validateField(name)
      }
      return { ...res, [triggerName]: handler }
    }, injectProps)
  }
}

/** 收集注入到Form.List children 的属性 */
export function collectListInjectProps(
  props: FormListProps,
  listPath: InternalNamePath,
  control: FormArrayControl,
  operations: FormArrayHelpers
) {
  const { children } = props
  if (!isFunction(children)) {
    logger.error(true, 'Form.List only accepts function as children.')
    return () => null
  }

  return (_: any, meta: FieldMeta, form: FormInstance) => {
    const value = form.getFieldValue(listPath) || []
    if (!isArray(value)) {
      logger.error(true, `Current value of '${listPath.join(' > ')}' is not an array type.`)
      return children([], operations, meta)
    }
    const listValue: ListField[] = value.map((item, index) => {
      return {
        key: control.ensureFieldKey(index),
        name: index,
        isListField: true,
      }
    })
    return children(listValue, operations, meta)
  }
}
