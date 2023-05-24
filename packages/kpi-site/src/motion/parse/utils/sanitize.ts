export default function sanitize(num: number, base = 100000) {
  return Math.round(num * base) / base
}
