import { Modal, Drawer, Button, Collapse } from '@kpi-ui/components'
import { useRef, useState } from 'react'

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
  const [open1, set1] = useState(false)

  const ref = useRef<HTMLButtonElement>(null)
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
      <Button variant="filled">minus</Button>
      <Button variant="filled">minus</Button>
      <Button variant="filled">minus</Button>
      <Button variant="filled">minus</Button>
      <Button variant="filled">minus</Button>
      <Button variant="filled">minus</Button>
      <Button variant="filled">minus</Button>
      <Modal
        title="我的Modal"
        maskClosable={false}
        open={open}
        onCancel={() => set(false)}
        onOk={() => set(false)}
      >
        <Collapse
          accordion
          expandedNames={d}
          onChange={(name, names) => {
            console.log(name, names)
            setd(names)
          }}
          items={items}
        />
        <Button
          variant="filled"
          onClick={() => {
            set1((p) => !p)
          }}
        >
          op1
        </Button>
        <Modal
          title="我的Modal"
          maskClosable={false}
          open={open1}
          onCancel={() => set1(false)}
          onOk={() => set1(false)}
        >
          <Collapse
            accordion
            expandedNames={d}
            onChange={(name, names) => {
              console.log(name, names)
              setd(names)
            }}
            items={items}
          />
          <div>132123</div>
          <div>132123</div>
        </Modal>
      </Modal>

      <input />
    </div>
  )
}
