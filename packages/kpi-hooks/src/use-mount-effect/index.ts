import { useEffect } from 'react'

export default function useMountEffect(callback: VoidFunction) {
  // eslint-disable-next-line react-hooks/exhaustive-deps, no-sequences
  useEffect(() => (callback(), undefined), [])
}
