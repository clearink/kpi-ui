/* eslint-disable no-return-assign */
import { isNull } from '@kpi/shared'
import { frameData, updateFrameDelta } from './delta'
import makeQueue from './queue'

type FrameLoopFn = (t: number) => boolean

const $queue = makeQueue<FrameLoopFn>()

const $raf = requestAnimationFrame

const caf = cancelAnimationFrame

const now = () => performance.now()

// with update frame delta
const raf: typeof $raf = (callback) => $raf((t) => updateFrameDelta(t) || callback(t))

let $id: null | number = null
const update = () => ($id = raf((t) => ($queue.flush(t) ? update() : ($id = null))))

const start = (fn: FrameLoopFn) => $queue.add(fn) && isNull($id) && update()

const cancel = (fn: FrameLoopFn) => $queue.delete(fn)

const loop = (callback: (timestamp: number, delta: number) => boolean) => {
  let id: number

  const tick = (t: number) => callback(t, frameData.delta) && (id = raf(tick))

  id = raf(tick)

  return () => caf(id)
}

// TODO: 为了解决布局抖动, 应当使读，写分离
const driver = { now, raf, caf, start, cancel, loop }

export default driver
