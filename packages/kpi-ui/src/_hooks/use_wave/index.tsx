import { useEffect, useRef } from 'react'
import Wave from './wave'

import './style.scss'
import usePrefix from '../use_prefix'

export default function useWave<H extends HTMLElement>() {
  const ref = useRef<H>(null)
  const name = usePrefix('wave')
  useEffect(() => {
    const dom = ref.current
    if (!dom) return
    const wave = new Wave(name, dom)
    const handler = () => wave.createWave()
    dom.addEventListener('click', handler, true)
    return () => {
      dom.removeEventListener('click', handler, true)
      wave.destroy()
    }
  }, [name])
  return ref
}
