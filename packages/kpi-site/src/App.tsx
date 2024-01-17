import { Modal, Drawer, Button, Collapse } from '@kpi-ui/components'
import { useRef, useState } from 'react'

import '@kpi-ui/components/src/style'
import './style.scss'

export default function App() {
  const [open, set] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const [d, setd] = useState('1')

  return (
    <div style={{ margin: 100 }}>
      <Button
        variant="filled"
        // 视为 classNames.root
        className="custom-class"
        // 视为 styles.root
        style={{ backdropFilter: 'initial' }}
        classNames={{
          root: 'btn-root',
          icon: 'btn-icon',
          text: 'btn-text',
        }}
        styles={{
          root: {
            backgroundColor: 'red',
          },
          icon: {
            color: 'blue',
          },
          text: {
            color: 'yellow',
          },
        }}
        onClick={() => {
          set((p) => !p)
        }}
      >
        minus
      </Button>
      <Modal title="我的Modal" open={open} onOpenChange={set}>
        <div>132123</div>
        <div>132123</div>
        <div>132123</div>
        <div>132123</div>
      </Modal>
      <Collapse
        expandedKey={d}
        onChange={(v) => {
          setd(v)
        }}
      ></Collapse>

      {/* <div className="container" ref={ref}></div> */}
    </div>
  )
}
