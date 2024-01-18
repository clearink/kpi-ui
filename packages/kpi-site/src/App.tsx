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
      <div style={{ width: 400, margin: 120 }}>
        <Collapse
          expandedKeys={d}
          onChange={(v) => {
            setd(v)
          }}
          // items={[
          //   {
          //     key: '1',
          //     title: 'name-1',
          //     children: (
          //       <div>
          //         Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          //         incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
          //         exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          //       </div>
          //     ),
          //   },
          //   {
          //     key: '2',
          //     title: 'name-2',
          //     children: (
          //       <div>
          //         Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          //         incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
          //         exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum
          //         dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
          //         labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          //         ullamco laboris nisi ut aliquip ex ea commodo consequat.
          //       </div>
          //     ),
          //   },
          //   {
          //     key: '3',
          //     title: 'name-3',
          //     children: (
          //       <div>
          //         Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          //         incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
          //         incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
          //         exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          //       </div>
          //     ),
          //   },
          // ]}
        >
          <div>1231</div>
          <div>1231</div>
          <Collapse.Item name="1" title="name-1">
            <div>1231</div>
          </Collapse.Item>
          <div>some custom</div>
          <Collapse.Item name="2" title="name-2">
            <div>1231</div>
          </Collapse.Item>
          <Collapse.Item name="2" title="name-2">
            <div>1231</div>
          </Collapse.Item>
          <div>some custom</div>
        </Collapse>
      </div>
      {/* <div className="container" ref={ref}></div> */}
    </div>
  )
}
