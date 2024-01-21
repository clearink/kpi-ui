import { Modal, Drawer, Button, Collapse } from '@kpi-ui/components'
import { useReducer, useRef, useState } from 'react'

import '@kpi-ui/components/src/style'
import './style.scss'

const items = [
  {
    name: '1',
    title: 'name-1',
    extra: <div>123</div>,
    children: (
      <div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud incididunt ut labore et
        dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
        ut aliquip ex ea commodo consequat.
      </div>
    ),
  },
  {
    name: '2',
    title: 'name-2',
    extra: <div>123</div>,
    children: (
      <div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud incididunt ut labore et
        dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
        ut aliquip ex ea commodo consequat.
      </div>
    ),
  },
  {
    name: '3',
    title: 'name-3',
    extra: <div>123</div>,
    children: (
      <div>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud incididunt ut labore et
        dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
        ut aliquip ex ea commodo consequat.
      </div>
    ),
  },
]

export default function App() {
  const [open, set] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const [d, setd] = useState(['1', '3'])

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
      <button
        type="button"
        aria-label="close"
        onClick={() => {
          console.log('close')
        }}
      >
        X
      </button>
      <div style={{ width: 400, margin: 120 }}>
        <Collapse
          accordion
          expandedNames={d}
          onChange={(name, names) => {
            console.log(name, names)
            setd(names)
          }}
          items={items}
        />
      </div>
      {/* <div className="container" ref={ref}></div> */}
    </div>
  )
}
