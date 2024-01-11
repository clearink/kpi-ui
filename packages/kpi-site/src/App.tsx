import { Modal, Button, Checkbox } from '@kpi-ui/components'
import { useEffect, useRef, useState } from 'react'
import '@kpi-ui/components/src/style'

import './style.scss'

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
      <Modal open={open} container={ref.current!} forceRender destroyOnClose>
        <div>div</div>
      </Modal>
      <div className="container" ref={ref}></div>
    </div>
  )
}
