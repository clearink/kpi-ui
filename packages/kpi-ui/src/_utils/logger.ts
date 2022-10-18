/* eslint-disable class-methods-use-this, func-names, no-console */
function isDev(): MethodDecorator {
  return function (_, __, descriptor: TypedPropertyDescriptor<any>) {
    const { value } = descriptor
    descriptor.value = function (this: any, ...args: any[]) {
      if (process.env.NODE_ENV !== 'production') {
        return value?.apply(this, args)
      }
    }
    return descriptor
  }
}

// 日志记录
class Logger {
  @isDev()
  public info(condition: boolean, ...data: any[]) {
    condition && console.info(...data)
  }

  @isDev()
  public log(condition: boolean, ...data: any[]) {
    condition && console.log(...data)
  }

  @isDev()
  public warn(condition: boolean, ...data: any[]) {
    condition && console.warn(...data)
  }

  @isDev()
  public error(condition: boolean, ...data: any[]) {
    condition && console.error(...data)
  }
}

export default new Logger()
