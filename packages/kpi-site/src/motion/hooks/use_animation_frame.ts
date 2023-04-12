import { useEvent } from '@kpi/shared'
import { useEffect, useRef } from 'react'
import driver from '../frame-loop'

export type FrameCallback = (timestamp: number, delta: number) => void

export default function useAnimationFrame(callback: FrameCallback) {
  const eventCallback = useEvent(callback)

  const startTime = useRef(0)

  useEffect(() => {
    return driver.loop((timestamp, delta) => {
      if (!startTime.current) startTime.current = timestamp

      eventCallback(timestamp - startTime.current, delta)

      return true
    })
  }, [eventCallback])
}
