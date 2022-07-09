import { useEffect, useRef } from 'react'
import { usePrefix } from '@hooks'
import Wave from './wave'

import './style.scss'

export default function useWave<H extends HTMLElement>() {
  const name = usePrefix('wave')
  const ref = useRef<H>(null)
  const destroy = useRef(() => {})
  // 事件
  useEffect(() => {
    const dom = ref.current
    if (!dom) return
    const wave = new Wave(name, dom)
    dom.addEventListener('mouseup', () => wave.createWave())
    destroy.current = () => wave.destroy()
    return () => wave.destroy()
  }, [name])
  return [ref, destroy] as const
}
