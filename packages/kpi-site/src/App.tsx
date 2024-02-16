import { Modal, Drawer, Button } from '@kpi-ui/components'
import { useRef, useState } from 'react'
import Tooltip from '@kpi-ui/components/src/_internal/tooltip'

import '@kpi-ui/components/src/style'
import './style.scss'
import { CSSTransition } from '@kpi-ui/components/src/_internal/transition'

export default function App() {
  const [open, set] = useState(!false)
  const [open1, set1] = useState('flex')
  const [d, setd] = useState(false)

  const ref = useRef<HTMLTextAreaElement>(null)

  return (
    <div style={{ margin: 100, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Button
        variant="filled"
        onClick={() => {
          set((p) => !p)
        }}
      >
        minus
      </Button>
      <Button
        variant="filled"
        onClick={() => {
          setd((p) => !p)
        }}
      >
        setd
      </Button>
      <Button
        variant="filled"
        onClick={() => {
          set1((p) => (p === 'flex' ? 'block' : 'flex'))
        }}
      >
        {open1}
      </Button>
      <CSSTransition name="fade" appear when={open}>
        <div style={{ display: `${open1}` }}>asdsadas</div>
      </CSSTransition>

      {/* <div style={{ position: 'absolute', left: 400, top: 200 }}>
        <Tooltip content={<div>12313211212</div>}>
          <textarea ref={ref} style={{ position: 'relative', top: 20 }} />
        </Tooltip>
      </div> */}
    </div>
  )
}
