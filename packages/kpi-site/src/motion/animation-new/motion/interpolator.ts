// 插值
export default function interpolator(
  value: number,
  input: [number, number],
  output: [number, number]
) {
  const percent = (value - input[0]) / (input[1] - input[0])

  return output[0] + (output[1] - output[0]) * percent
}
