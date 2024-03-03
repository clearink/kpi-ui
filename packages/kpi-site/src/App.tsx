import { Button, Form, Tooltip } from '@kpi-ui/components'
import { useMemo, useState } from 'react'
import kv from '@kpi-ui/validator'
import GroupTransition from '@kpi-ui/components/src/_internal/transition/components/group-transition'

import '@kpi-ui/components/src/style'
import './style.scss'
import Modal from '@kpi-ui/components/src/modal'

export default function App() {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ margin: 100, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ padding: 400 }}>
        {/* <div style={{ position: 'absolute', left: 400, top: 200 }}>
          <div style={{ position: 'absolute', left: 400, top: 200 }}>
            <div style={{ position: 'absolute', left: 400, top: 200 }}> */}
        <Tooltip content={<div>12313211212</div>}>
          <textarea style={{ position: 'relative', top: 20 }} />
        </Tooltip>
        {/* </div>
          </div>
        </div> */}
        <Button
          onClick={() => {
            setOpen((p) => !p)
          }}
        >
          123
        </Button>
        <Modal open={open} onCancel={() => setOpen(false)} onOk={() => setOpen(false)}>
          <div>12231</div>
        </Modal>
      </div>
    </div>
  )
}
