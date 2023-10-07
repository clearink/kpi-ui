import { useEvent } from '@kpi/shared'
import { ReactNode, useEffect, useRef } from 'react'
import { animate } from 'framer-motion'

export interface CollapseProps {
  collapsed: boolean
  children?: ReactNode
}
function Collapse(props: CollapseProps) {
  const { collapsed, children } = props

  const ref = useRef<HTMLDivElement>(null)
  const appear = useRef(true)

  useEffect(() => {
    const dom = ref.current

    if (!dom || appear.current) return

    appear.current = true

    if (collapsed) {
      // auto => 0
      // auto => 200 => 0
    } else {
      // 0 => auto
      // 0 => auto=>200
    }
  }, [collapsed])

  return (
    <div ref={ref} style={{ overflow: 'hidden' }}>
      {children}
    </div>
  )
}

export default Collapse
