/* eslint-disable no-console, class-methods-use-this */

import type { AnyFunction } from '../types'

const isDev = process.env.NODE_ENV !== 'production'
// 日志记录 仅提示一次
class Logger {
  private cache = new Set<string>()

  private wrapper(condition: boolean, data: any[], callback: AnyFunction) {
    if (!isDev) return

    const key = JSON.stringify(data)
    const exist = this.cache.has(key)

    if (exist || !condition) return

    this.cache.add(key)
    callback.call(null, ...data)
  }

  public info(condition: boolean, ...data: any[]) {
    this.wrapper(condition, data, console.info)
  }

  public log(condition: boolean, ...data: any[]) {
    this.wrapper(condition, data, console.log)
  }

  public warn(condition: boolean, ...data: any[]) {
    this.wrapper(condition, data, console.warn)
  }

  public error(condition: boolean, ...data: any[]) {
    this.wrapper(condition, data, console.error)
  }
}

export default new Logger()
