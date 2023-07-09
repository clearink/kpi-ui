export default function makeControlledPromise() {
  let $resolve: VoidFunction
  let $promise: Promise<void>

  /**
   *
   * @param {boolean} clear 抛弃上次的 resolve 函数
   */
  const update = (clear = false) => {
    !clear && $resolve && $resolve()
    $promise = new Promise<void>((resolve) => {
      $resolve = resolve
    })
  }

  return { get: () => $promise, update }
}
