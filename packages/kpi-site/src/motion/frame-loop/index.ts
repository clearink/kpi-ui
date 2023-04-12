/* eslint-disable no-return-assign */
import { isNull } from '@kpi/shared'
import { raf as Raf, caf as Caf } from '../utils/raf'
import now from '../utils/now'
import { frameData, updateFrameDelta } from './delta'
import makeQueue from './queue'

const makeFrameLoopDriver = <T extends (t: number) => boolean>() => {
  let raf = Raf
  let caf = Caf
  let $id: null | number = null
  const $queue = makeQueue<T>()

  const use = (customRaf: typeof Raf, customCaf?: typeof Caf) => {
    if (customRaf) raf = customRaf
    if (customCaf) caf = customCaf
  }

  // with measure frame delta
  const $raf = (callback: FrameRequestCallback) => raf((t) => updateFrameDelta(t, callback(t)))

  const update = () => ($id = $raf((t) => ($queue.flush(t) ? update() : ($id = null))))

  const start = (fn: T) => $queue.add(fn) && isNull($id) && update()

  const cancel = (fn: T) => $queue.delete(fn)

  const loop = (callback: (timestamp: number, delta: number) => boolean) => {
    let id: number

    const tick = (t: number) => callback(t, frameData.delta) && (id = $raf(tick))

    id = $raf(tick)

    return () => caf(id)
  }

  return { now, raf: $raf, caf, use, start, cancel, loop }
}

export default makeFrameLoopDriver()
