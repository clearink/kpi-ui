export default function sanitize(num: number, base = 10000) {
  return Math.round(num * base) / base
}
