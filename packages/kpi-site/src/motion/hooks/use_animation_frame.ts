import { useEvent } from '@kpi/shared'
import { useEffect, useRef } from 'react'
import { caf, raf } from '../utils/raf'

export default function useAnimationFrame(callback: FrameRequestCallback) {
  const timestamp = useRef(0)

  const eventCallback = useEvent(callback)

  useEffect(() => {
    // const id = raf((t) => {
    //   if (!timestamp.current) timestamp.current = t
    //   eventCallback(t - timestamp.current)
    //   return true
    // })
    // return () => caf(id)
  }, [eventCallback])
}
