import { max } from '../../../utils/math'

const ms = (s: string) => (parseFloat(s) || 0) * 1e3

export default function collectTimeoutInfo(
  collection: CSSStyleDeclaration,
  type: 'transition' | 'animation'
) {
  const style = (property: string): string[] => `${collection[property] || ''}`.split(', ')

  const delays = style(`${type}Delay`)
  const durations = style(`${type}Duration`)

  const len = delays.length
  const timeout = max(durations.map((d, i) => ms(d) + ms(delays[i % len])))

  return { timeout, count: durations.length }
}
