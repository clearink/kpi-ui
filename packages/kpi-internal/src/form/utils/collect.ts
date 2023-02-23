/* eslint-disable no-param-reassign */
import { hasOwn, isFunction, isObjectLike, toArray } from '@kpi/shared'

import type { AnyObject } from '../../types'
import type { FormFieldControl } from '../control'
import type {
  InternalFormFieldProps,
  InternalFormInstance,
  InternalHookReturn,
} from '../internal_props'

// 从event中获取字段值函数
function defaultGetValueFromEvent(valuePropName: string) {
  return (event: any) => {
    if (!event || !isObjectLike(event.target)) return event
    if (!hasOwn(event.target, valuePropName)) return event
    return (event.target as HTMLInputElement)[valuePropName]
  }
}

/** 收集注入到Form.Field children 的属性 */
export default function collectInjectProps(
  props: InternalFormFieldProps,
  formInstance: InternalFormInstance,
  control: FormFieldControl,
  internalHook?: InternalHookReturn
) {
  const {
    name,
    trigger = 'onChange',
    validateTrigger,
    valuePropName = 'value',
    getValueFromEvent = defaultGetValueFromEvent(valuePropName),
    formatter,
    getValueProps: $getValueProps,
  } = props
  return (childProps: AnyObject = {}) => {
    // name 不合法不应该提供下列数据
    if (!control._key) return childProps

    const value = formInstance.getFieldValue(name)

    // 获取 event value 字段函数 getValueProps 与 valuePropName 互斥
    const getValueProps = $getValueProps || ((val: AnyObject) => ({ [valuePropName]: val }))

    const injectProps = {
      ...childProps,
      ...getValueProps(value),
      // 触发条件
      [trigger]: (...args: any[]) => {
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

    const init = { ...injectProps }

    return triggerList.reduce((result, triggerName) => {
      result[triggerName] = (...args: any[]) => {
        injectProps[triggerName]?.(...args)
        props.rule && formInstance.validateField(name)
      }

      return result
    }, init)
  }
}
