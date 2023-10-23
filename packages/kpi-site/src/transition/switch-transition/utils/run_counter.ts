export default function runCounter<F extends (...args: any) => void>(counter: number, callback: F) {
  let count = 0
  return (...args: any) => {
    if (++count < counter) return
    callback(...args)
  }
}
