import { useRef } from 'react'
import useIsomorphicEffect from '../use-isomorphic-effect'
import Wave from './wave'

export default function useWave<H extends HTMLElement>() {
  const ref = useRef<H>(null)
  useIsomorphicEffect(() => {
    const dom = ref.current
    if (!dom) return
    const wave = new Wave(dom)
    const handler = () => wave.createWave()
    dom.addEventListener('click', handler, true)
    return () => {
      dom.removeEventListener('click', handler, true)
      wave.destroy()
    }
  }, [])
  return ref
}
