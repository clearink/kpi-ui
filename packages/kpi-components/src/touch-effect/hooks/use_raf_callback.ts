import { useConstant, useEvent, useUnmountEffect } from '@kpi-ui/hooks'

export default function useRafCallback<F extends (...args: any[]) => void>(fn: F) {
  const config = useConstant(() => ({ id: -1 }))

  useUnmountEffect(() => cancelAnimationFrame(config.id))

  return useEvent((...args: any[]) => {
    cancelAnimationFrame(config.id)

    config.id = requestAnimationFrame(() => fn(...args))
  })
}
