import { useConstant } from '@kpi/shared'

import type { RefObject } from 'react'

export default function useTransitionStore<E extends HTMLElement>() {
  return useConstant(() => {
    const state = {
      count: 0,
      running: false,
      ref: { current: null } as RefObject<E>,
    }

    return {
      get ref() {
        return state.ref
      },
      get count() {
        return state.count
      },
      get appearing() {
        return state.count === 1
      },
      get running() {
        return state.running
      },
      setRunning(running: boolean) {
        state.running = running
      },
      update: () => {
        state.count += 1
      },
    }
  })
}
