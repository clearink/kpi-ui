/* eslint-disable @typescript-eslint/naming-convention */

import noop from './noop'

// 日志记录 仅提示一次
const cache = new Set<string>()
function logger(condition: boolean, ...message: string[]) {
  if (!condition) return

  const key = JSON.stringify(message)
  if (cache.has(key)) return

  cache.size > 10000 && cache.clear()
  cache.add(key)

  // eslint-disable-next-line no-console
  console.error(...message)
}
export default process.env.NODE_ENV !== 'production' ? logger : noop
