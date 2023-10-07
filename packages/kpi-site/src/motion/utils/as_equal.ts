export default function asEqual(a: number, b: number) {
  return a - b < Number.EPSILON
}
