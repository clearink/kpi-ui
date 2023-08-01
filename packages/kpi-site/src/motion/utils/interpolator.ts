import clamp from './clamp'

export function percentage(value: number, range: [number, number]) {
  if (range[0] === range[1]) return 1

  return (value - range[0]) / (range[1] - range[0])
}

// 插值
export default function interpolator<V extends [number, number]>(value: V[0], range: V, output: V) {
  const transform = (percent: number) => output[0] + (output[1] - output[0]) * percent

  const percent = clamp(percentage(value, range), 0, 1)

  return [percent, transform] as const
}
