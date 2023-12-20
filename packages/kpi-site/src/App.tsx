import { Modal, Button, Checkbox } from '@kpi-ui/components'
import { useRef, useState } from 'react'
import '@kpi-ui/components/src/style'

import './style.scss'

export default function App() {
  const [open, set] = useState(false)

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
      <Modal open={open} />
    </div>
  )
}
