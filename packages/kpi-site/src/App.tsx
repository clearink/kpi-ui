import { Modal, Button, Checkbox } from '@kpi-ui/components'
import { useEffect, useRef, useState } from 'react'
import '@kpi-ui/components/src/style'
import Overlay from '@kpi-ui/components/src/overlay-internal'

import './style.scss'
import { useConstant } from '../../kpi-hooks/src'

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
      <Overlay getContainer={() => ref.current}>
        <div>div</div>
      </Overlay>
      <div className="container" ref={ref}></div>
    </div>
  )
}
