import { useReducer } from 'react'

export function useForceUpdate() {
  return useReducer((c: number) => c + 1, 0)[1]
}
