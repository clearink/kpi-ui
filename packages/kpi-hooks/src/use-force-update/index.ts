import { useReducer } from 'react'

export default function useForceUpdate() {
  return useReducer((c: number) => c + 1, 0)[1]
}
