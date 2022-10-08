import type { Message } from '../interface'
import type SchemaContext from '../context'

import { isFunction, isNumber } from '../../is'
import printValue from './print_value'

const pathToString = (path: (string | number)[]) => {
  return path.reduce((ret, item) => {
    if (isNumber(item)) return `${ret}[${item}]`
    return `${ret}.${item}`
  }, '')
}

export default function formatMessage(message: Message, context?: SchemaContext) {
  return (params: any = {}) => {
    const $params = { ...params, path: pathToString(context?.path ?? []) || 'this' }
    if (isFunction(message)) return message($params)
    return Object.entries($params).reduce((msg, [k, v]) => {
      const reg = new RegExp(`{#${k}}`, 'g')
      return msg.replace(reg, printValue(v))
    }, message)
  }
}
