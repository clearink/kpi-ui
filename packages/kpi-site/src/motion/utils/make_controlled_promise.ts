export default function makeControlledPromise() {
  let $resolve: VoidFunction
  let $promise: Promise<void>

  const update = () => {
    $resolve && $resolve()
    $promise = new Promise<void>((resolve) => {
      $resolve = resolve
    })
  }

  return { get: () => $promise, update }
}
