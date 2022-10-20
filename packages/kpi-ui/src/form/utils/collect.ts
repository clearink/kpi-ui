import { hasOwn, isObjectLike, toArray } from '../../_utils'
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
// 数据转换函数
const defaultNormalize = (val: any) => val

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
    normalize = defaultNormalize,
    getValueProps: $getValueProps,
    onMetaChange,
  } = props
  return (childProps: AnyObject = {}) => {
    const value = context.getFieldValue(name)

    // 获取 event value 字段函数 getValueProps 与 valuePropName 互斥
    const getValueProps = $getValueProps || ((val: AnyObject) => ({ [valuePropName!]: val }))

    const injectProps = {
      ...childProps,
      ...getValueProps(value),
      onBlur: (...args: any[]) => {
        // 触发 blur 事件后才设置 touched
        internalHook?.setFieldMeta(name, { touched: true })(onMetaChange)
        childProps.onBlur?.(...args)
      },
      // 触发条件
      [trigger!]: (...args: any[]) => {
        // 设置所有所有同名字段的 meta 属性

        const nextValue = normalize(getValueFromEvent(...args), value, context.getFieldsValue())
        context.setFieldValue(name, nextValue)

        internalHook?.setFieldMeta(name, { dirty: true })(onMetaChange)

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
        // TODO: validateField
        // validateFieldLevelValidations
        // 不光是校验自身
        console.log('validateFieldLevelValidations')
      }
      return { ...res, [triggerName]: handler }
    }, injectProps)
  }
}
