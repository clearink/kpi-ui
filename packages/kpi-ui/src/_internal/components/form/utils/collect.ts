/* eslint-disable react/function-component-definition */
/* eslint-disable func-names */
import { hasOwn, isArray, isFunction, isObjectLike, logger, toArray } from '../../../utils'
import { FormArrayControl, FormFieldControl } from '../control'

import type { AnyObject } from '../../../types'
import type {
  InternalFormFieldProps,
  InternalFormInstance,
  InternalHookReturn,
  InternalNamePath,
} from '../internal_props'
import type { FormInstance, FormListProps, ListField, FieldData } from '../props'

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
  formInstance: InternalFormInstance,
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

    const value = formInstance.getFieldValue(name)

    // 获取 event value 字段函数 getValueProps 与 valuePropName 互斥
    const getValueProps = $getValueProps || ((val: AnyObject) => ({ [valuePropName!]: val }))

    const injectProps = {
      ...childProps,
      ...getValueProps(value),
      // 触发条件
      [trigger!]: (...args: any[]) => {
        let next = getValueFromEvent(...args)

        if (isFunction(formatter)) next = formatter(next, value, formInstance.getFieldsValue())

        internalHook?.setFieldMeta(name, { touched: true, dirty: true })

        internalHook?.dispatch({ name, value: next, type: 'fieldEvent' })

        // originTrigger
        childProps[trigger!]?.(...args)
      },
    }

    // 校验触发时机
    const triggerList = toArray((validateTrigger ?? formInstance.validateTrigger) || [])

    return triggerList.reduce((res, triggerName) => {
      const handler = (...args: any[]) => {
        // 执行原始值
        injectProps[triggerName]?.(...args)
        props.rule && formInstance.validateField(name)
      }
      return { ...res, [triggerName]: handler }
    }, injectProps)
  }
}

/** 收集注入到Form.List children 的属性 */
export function collectListInjectProps(
  props: FormListProps,
  listPath: InternalNamePath,
  control: FormArrayControl
) {
  const { children } = props
  if (!isFunction(children)) {
    logger.error(true, 'Form.List only accepts function as children.')
    return () => null
  }

  return (_, meta: FieldData, form: FormInstance) => {
    const value = form.getFieldValue(listPath) || []
    const helpers = control._getFeatures()

    if (!isArray(value)) {
      logger.error(true, `Current value of '${listPath.join(' > ')}' is not an array type.`)
      return children([], helpers, meta)
    }

    const listValue: ListField[] = value.map((__, index) => {
      return {
        key: control.ensureFieldKey(index),
        name: index,
        isListField: true,
      }
    })

    return children(listValue, helpers, meta)
  }
}
