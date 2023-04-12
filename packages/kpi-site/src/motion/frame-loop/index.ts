/* eslint-disable no-return-assign */
import { isNull } from '@kpi/shared'
import Queue from './queue'
import { frameData, updateFrameDelta } from './delta'
import { raf as $raf, caf, now } from './driver'

const makeFrameLoopDriver = <T extends (t: number) => boolean>() => {
  let $id: null | number = null
  const $queue = new Queue<(t: number) => boolean>()

  // with measure frame delta
  const raf = (callback: FrameRequestCallback) => $raf((t) => updateFrameDelta(t, callback(t)))

  const update = () => ($id = raf((t) => ($queue.flush(t) ? update() : ($id = null))))

  const start = (fn: T) => $queue.add(fn) && isNull($id) && update()

  const cancel = (fn: T) => $queue.delete(fn)

  const loop = (callback: (timestamp: number, delta: number) => boolean) => {
    let id: number

    const tick = (t: number) => callback(t, frameData.delta) && (id = raf(tick))

    id = raf(tick)

    return () => caf(id)
  }

  return { now, raf, caf, start, cancel, loop }
}

export default makeFrameLoopDriver()
