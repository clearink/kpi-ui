export default function runCounter(counter: number, callback: (...args: any) => void) {
  let count = 0

  // prettier-ignore
  return (...args: any) => { ++count >= counter && callback(...args) }
}
