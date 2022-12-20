import { isFunction, isNullish, isNumber, isString } from '../is'

import type { Context, Message, Name, SchemaIssue } from './interface'

const pathToString = (path: Name[] = []) => {
  return path.reduce((ret: string, item) => {
    if (isNumber(item)) return `${ret}[${item}]`
    if (item.includes('.')) return `${ret}['${item}']`
    return ret.length ? `${ret}.${item}` : `${item}`
  }, '')
}

export default class SchemaContext extends TypeError {
  static ensure(ctx?: Partial<Context>, name?: Name | Name[]): Context {
    const path = ctx?.path || []
    return {
      abortEarly: ctx?.abortEarly ?? false,
      path: isNullish(name) ? path : path.concat(name),
      issue: ctx?.issue ?? new SchemaContext(),
    }
  }

  static format(message: Message, path: Name[] = []) {
    return (params: any = {}) => {
      if (isFunction(message)) return message({ ...params, path })

      if (!isString(message)) return message

      const $params = { ...params, path: pathToString(path) || 'this' }

      return Object.entries($params).reduce((msg, [k, v]) => {
        const reg = new RegExp(`{#${k}}`, 'g')
        return msg.replace(reg, String(v))
      }, message)
    }
  }

  issues: SchemaIssue[] = []

  get isEmpty() {
    return this.issues.length === 0
  }

  addIssue(message: Message, path: Name[], params?: any) {
    const msg = SchemaContext.format(message, path)(params)
    this.issues.push({ path, message: msg })
  }

  addIssues(issues: SchemaIssue[]) {
    this.issues = this.issues.concat(issues)
    return this
  }

  get message() {
    const issues = this.issues.map((issue) => {
      try {
        JSON.stringify(issue.message)
        return issue.message
      } catch (error) {
        return `error can not stringify`
      }
    })

    return JSON.stringify(issues, null, 2)
  }
}
