export const EPSILON = 1e-6

export default function asZero(num: number) {
  return Math.abs(num) < EPSILON
}
