export default function clamp(value: number, min: number, max: number) {
  const $max = Math.max(min, max)
  const $min = Math.min(min, max)
  return Math.min(Math.max(value, $min), $max)
}
