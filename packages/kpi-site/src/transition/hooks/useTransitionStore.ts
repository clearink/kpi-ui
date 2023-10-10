import { useMemo, useRef } from 'react'

import type { TransitionProps } from '../props'

export default function useTransitionStore<E extends HTMLElement>(props: TransitionProps<E>) {
  const ref = useRef({ appearing: false, entering: false, exiting: false })
  return useMemo(() => {
    return {
      get: () => ref.current,
      add: () => {
        ref.current += 1
      },
    }
  }, [])
}
