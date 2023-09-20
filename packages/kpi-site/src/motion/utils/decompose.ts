import { isNumber } from '@kpi/shared'

export default function decompose(input: number | string) {
  if (isNumber(input)) return { numbers: [input], strings: [] as string[], numeric: true }

  // 拆分数字
  const rgx = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g

  const match = input.match(rgx)

  const numbers = match ? match.map(parseFloat) : []

  const strings = input.split(rgx)

  return { numbers, strings, numeric: false }
}
