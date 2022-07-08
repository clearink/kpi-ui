import { useEffect, useRef } from 'react'
// import './style.scss'
import Wave from './wave'
// TODO: 待优化 对 mui 和 antd 的动画效果都不太满意
export default function useWave<H extends HTMLElement>() {
  const ref = useRef<H>(null)
  // 事件
  useEffect(() => {
    const dom = ref.current
    if (!dom) return
    const wave = new Wave(dom)
    dom.addEventListener('mouseup', () => wave.createWave())
    return () => wave.destroy()
  }, [])
  return ref
}
