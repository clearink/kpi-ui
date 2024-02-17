import { Modal, Drawer, Button } from '@kpi-ui/components'
import { useRef, useState } from 'react'
import Tooltip from '@kpi-ui/components/src/_internal/tooltip'
import CSSTransition from '@kpi-ui/components/src/_internal/transition/components/css-transition'

import '@kpi-ui/components/src/style'
import './style.scss'
import ForwardFunctional from '@kpi-ui/components/src/_internal/overlay/components/forward_functional'

export default function App() {
  const [open, set] = useState(!false)
  const [cls, setCls] = useState('a')
  const [display, setDisplay] = useState('flex')

  const ref = useRef<HTMLTextAreaElement>(null)

  return (
    <div style={{ margin: 100, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Button
        variant="filled"
        onClick={() => {
          set((p) => !p)
        }}
      >
        open
      </Button>
      <Button
        variant="filled"
        onClick={() => {
          setCls((p) => (p === 'a' ? 'b' : 'a'))
          setDisplay((p) => (p === 'flex' ? 'block' : 'flex'))
        }}
      >
        change cls
      </Button>

      {/* <div style={{ position: 'absolute', left: 400, top: 200 }}>
        <Tooltip content={<div>12313211212</div>}>
          <textarea ref={ref} style={{ position: 'relative', top: 20 }} />
        </Tooltip>
      </div> */}
    </div>
  )
}
