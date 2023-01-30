/* eslint-disable @typescript-eslint/naming-convention */

const __DEV__ = process.env.NODE_ENV !== 'production'

// 日志记录 仅提示一次
const cache = new Set<string>()
export default function logger(condition: boolean, ...message: string[]) {
  if (!condition || !__DEV__) return

  const key = JSON.stringify(message)
  if (cache.has(key)) return

  cache.size > 10000 && cache.clear()
  cache.add(key)

  // eslint-disable-next-line no-console
  console.error(...message)
}
