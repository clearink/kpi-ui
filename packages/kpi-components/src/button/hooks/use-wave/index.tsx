import { useEffect, useRef } from 'react'
import Wave from './wave'

export default function useWave<H extends HTMLElement>() {
  const ref = useRef<H>(null)

  useEffect(() => {
    const dom = ref.current

    if (!dom) return

    const wave = new Wave(dom)
    const handler = () => wave.create()
    dom.addEventListener('click', handler, true)

    return () => {
      dom.removeEventListener('click', handler, true)
      wave.destroy()
    }
  }, [])
  return ref
}
