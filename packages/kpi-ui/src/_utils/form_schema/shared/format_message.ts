import { Context, Message } from '../interface'
import { isFunction, isNumber } from '../../is'

import printValue from './print_value'

export default function formatMessage(message: Message) {
  return (params: any = {}, context?: Context) => {
    const path = (context?.path || []).reduce((ret, item) => {
      if (isNumber(item)) return `${ret}[${item}]`
      return `${ret}.${item}`
    }, '')
    const $params = { ...params, path: path || 'this' }
    if (isFunction(message)) return message($params)
    return Object.entries($params).reduce((msg, [k, v]) => {
      const reg = new RegExp(`{#${k}}`, 'g')
      return msg.replace(reg, printValue(v))
    }, message)
  }
}
