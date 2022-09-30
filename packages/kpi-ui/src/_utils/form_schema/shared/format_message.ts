import { AnyObject } from '../../../_types'
import { isFunction } from '../../is'
import { Message } from '../interface'
import printValue from './print_value'

export default function formatMessage(message: Message) {
  if (isFunction(message)) return message
  return (params: AnyObject = {}) => {
    return Object.entries(params).reduce((msg, [k, v]) => {
      const reg = new RegExp(`{#${k}}`, 'g')
      return msg.replace(reg, printValue(v))
    }, message)
  }
}
