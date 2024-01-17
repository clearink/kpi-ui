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
        expandedKeys={d}
        onChange={(v) => {
          setd(v)
        }}
        items={[
          {
            key: '1',
            title: '',
            children: <div>123</div>,
          },
          {
            key: '2',
            title: '',
            children: <div>456</div>,
          },
        ]}
      ></Collapse>

      {/* <div className="container" ref={ref}></div> */}
    </div>
  )
}
