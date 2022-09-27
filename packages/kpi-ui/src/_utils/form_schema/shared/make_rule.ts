import { isObjectLike } from '../..'

// 生成校验函数
export default function makeRule<T extends any>(handler: RuleHandler, message?: Message) {
  const $message = isObjectLike(message) ? message : { message }
  return async (value: T, context?: any): Promise<TestResult<T>> => {
    const res = await handler(value, context)
    if (!res) return { status: Invalid.status, ...$message, error: '' }
    return Valid(value)
  }
}
