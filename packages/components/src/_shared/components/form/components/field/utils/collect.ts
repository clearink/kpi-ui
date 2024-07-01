import type { AnyObject } from '@kpi-ui/types'
import { hasOwn, isFunction, isObjectLike, toArray } from '@kpi-ui/utils'

import type { InternalFormInstance, InternalHookReturn } from '../../form/control/props'
import type { FormFieldControl } from '../control'
import type { InternalFormFieldProps } from '../props'

// 从event中获取字段值函数
function defaultGetValueFromEvent(valuePropName: string) {
  return (event: any) => {
    if (!event || !isObjectLike(event.target)) return event
    if (!hasOwn(event.target, valuePropName)) return event
    return (event.target as HTMLInputElement)[valuePropName]
  }
}

function defaultGetValueProps(valuePropName: string) {
  return (value: any) => ({ [valuePropName]: value })
}
/** 收集注入到Form.Field children 的属性 */
export default function collectInjectProps(
  props: InternalFormFieldProps,
  instance: InternalFormInstance,
  control: FormFieldControl,
  internalHooks?: InternalHookReturn,
) {
  const {
    name,
    rule,
    trigger,
    validateTrigger,
    valuePropName,
    getValueFromEvent = defaultGetValueFromEvent(valuePropName!),
    formatter,
    // 获取 event value 字段函数 getValueProps 与 valuePropName 互斥
    getValueProps = defaultGetValueProps(valuePropName!),
  } = props

  return (childProps: AnyObject = {}) => {
    // name 不合法不应该提供下列数据
    if (!control._key) return childProps

    const value = instance.getFieldValue(name)

    const injectProps = {
      ...childProps,
      ...getValueProps(value),
      // 触发条件
      [trigger!]: (...args: any[]) => {
        let next = getValueFromEvent(...args)

        if (isFunction(formatter)) next = formatter(next, value, () => instance.getFieldsValue())

        internalHooks?.metaUpdate(name, { touched: true, dirty: true })

        internalHooks?.dispatch({ type: 'fieldEvent', control, value: next })

        trigger && childProps[trigger]?.(...args)
      },
    }

    // 校验触发时机
    const triggerList = toArray(validateTrigger ?? instance.validateTrigger)

    // prettier-ignore
    return triggerList.reduce((result, triggerName) => {
      if (triggerName === false) return result

      result[triggerName] = (...args: any[]) => {
        injectProps[triggerName]?.(...args)
        rule && instance.validateField(name)
      }

      return result
    }, { ...injectProps })
  }
}
