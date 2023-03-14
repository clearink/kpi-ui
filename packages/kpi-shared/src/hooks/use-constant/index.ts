import { useMemo } from 'react'

export default function useConstant<T>(init: () => T): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(init, [])
}
