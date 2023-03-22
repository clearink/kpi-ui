import { useEvent } from '@kpi/shared'
import { useEffect, useRef } from 'react'
import raf from '../utils/raf'

/**
 * timestamp    首次调用以来的总持续时间
 * delta        上一个动画帧以来的总持续时间
 */
export type FrameCallback = (timestamp: number, delta: number) => void

const delta = 0

export default function useAnimationFrame(callback: FrameCallback) {
  const timestamp = useRef(0)

  const eventCallback = useEvent(callback)

  useEffect(() => {
    return raf((t) => {
      if (!timestamp.current) timestamp.current = t

      eventCallback(t - timestamp.current, delta)

      return true
    })
  }, [eventCallback])
}
