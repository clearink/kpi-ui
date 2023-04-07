export default function createFinishedPromise() {
  const expose = {} as { resolve: VoidFunction; promise: Promise<void> }

  const update = () => {
    expose.resolve?.()
    expose.promise = new Promise<void>((resolve) => {
      expose.resolve = resolve
    })
  }

  return { get: () => expose.promise, update }
}
