import { hasOwn, isFunction, isObjectLike, toArray } from '../../_utils'

import type { AnyObject } from '../../_types'
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
        const nextValue = (() => {
          const next = getValueFromEvent(...args)
          if (!isFunction(formatter)) return next
          return formatter(next, value, context.getFieldsValue())
        })()

        context.setFieldValue(name, nextValue)

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
