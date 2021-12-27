import { readFileSync } from 'fs'
import { ensureFileSync, outputFileSync } from 'fs-extra'

export function outputFileOnChangeSync(path: string, code: string) {
  ensureFileSync(path)
  const content = readFileSync(path, 'utf-8')
  if (code !== content) outputFileSync(path, code)
}

const upperCase = (str: string) => str.toUpperCase()
export function camelCase(name: string, pascal = false) {
  const normalized = name
    .replace(/(?<=[-_\s])(\w)/g, upperCase) /* 转换成大写 */
    .replace(/[-_\s]/g, '') /* 去除额外的符号 */

  return pascal ? normalized.replace(/^\w/g, upperCase) : normalized
}
