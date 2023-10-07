import { useEvent } from '@kpi/shared'
import { useEffect, useRef } from 'react'
import driver from '../animation/driver'

export type FrameCallback = (timestamp: number) => void

export default function useAnimationFrame(callback: FrameCallback) {
  const eventCallback = useEvent(callback)

  const startTime = useRef(0)

  useEffect(() => {
    return driver.loop((timestamp) => {
      if (!startTime.current) startTime.current = timestamp

      eventCallback(timestamp - startTime.current)

      return true
    })
  }, [eventCallback])
}
