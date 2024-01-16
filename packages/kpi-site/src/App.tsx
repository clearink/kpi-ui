import { Modal, Drawer, Button } from '@kpi-ui/components'
import { useRef, useState } from 'react'

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
      <Drawer title="我的Drawer" open={open} onOpenChange={set}>
        <div>132123</div>
        <div>132123</div>
        <div>132123</div>
        <div>132123</div>
      </Drawer>

      {/* <div className="container" ref={ref}></div> */}
    </div>
  )
}
