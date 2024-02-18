import { Button, Tooltip } from '@kpi-ui/components'
import { forwardRef, useEffect, useRef, useState } from 'react'

import '@kpi-ui/components/src/style'
import './style.scss'

export default function App() {
  const [open, set] = useState(false)
  const [cls, setCls] = useState('a')

  return (
    <div style={{ margin: 100, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Button
        variant="filled"
        onClick={() => {
          set((p) => !p)
        }}
      >
        open
      </Button>
      <Button
        variant="filled"
        onClick={() => {
          setCls((p) => (p === 'a' ? 'b' : 'a'))
        }}
      >
        change cls
      </Button>

      <div style={{ padding: 400 }}>
        adasdsa
        <div style={{ position: 'absolute', left: 400, top: 200 }}>
          <div style={{ position: 'absolute', left: 400, top: 200 }}>
            <div style={{ position: 'absolute', left: 400, top: 200 }}>
              <Tooltip content={<div>12313211212</div>}>
                <textarea style={{ position: 'relative', top: 20 }} />
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
