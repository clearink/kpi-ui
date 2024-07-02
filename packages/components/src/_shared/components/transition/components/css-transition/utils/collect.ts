const ms = (s: string) => (Number.parseFloat(s) || 0) * 1e3

export default function collectTimeoutInfo(
  collection: CSSStyleDeclaration,
  type: 'animation' | 'transition',
) {
  const style = (property: string): string[] => `${collection[property] || ''}`.split(', ')

  const delays = style(`${type}Delay`)

  const len = delays.length

  const durations = style(`${type}Duration`).map<number>((d, i) => ms(d) + ms(delays[i % len]))

  const timeout = Math.max.apply(null, durations)

  return { count: durations.length, timeout }
}
