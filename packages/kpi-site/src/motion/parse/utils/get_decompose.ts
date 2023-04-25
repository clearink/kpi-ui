import { isNumber } from '@kpi/shared'

export default function getDecompose(input: number | string) {
  if (isNumber(input)) return { numbers: [input], strings: [], numeric: true }

  const rgx = /[+-]?\d*\.?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g // handles exponents notation

  const match = input.match(rgx)

  const numbers = match ? match.map(parseFloat) : [0]
  const strings = input.split(rgx)

  return { numbers, strings, numeric: false }
}
