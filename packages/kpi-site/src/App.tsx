import { Modal, Button } from '@kpi-ui/components'
import { useRef, useState } from 'react'

import '@kpi-ui/components/src/style'
import './style.scss'
import { CSSTransition } from '@kpi-ui/components/src/_internal/transition'

export default function App() {
  const [open, set] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div style={{ margin: 100 }}>
      <Button
        variant="filled"
        onClick={() => {
          set((p) => !p)
        }}
      >
        minus
      </Button>
      <Modal open={open} unmountOnExit onOpenChange={set}>
        <div>div</div>
      </Modal>

      {/* <div className="container" ref={ref}></div> */}
    </div>
  )
}
