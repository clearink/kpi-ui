import { Badge, Button } from '@kpi-ui/components'
import { useRef, useState } from 'react'
import '@kpi-ui/components/src/style'

import './style.scss'

export default function App() {
  const [num, set] = useState(1)
  const ref = useRef(null)

  return (
    <div style={{ margin: 100 }}>
      <Button ref={ref} variant="filled" onClick={() => set((p) => p - 10)}>
        minus
      </Button>
      <Button onClick={() => set((p) => p + 10)}>plus</Button>
      <button
        onClick={() => {
          const newCount = Math.floor(Math.random() * 100)
          set(newCount)
        }}
      >
        random
      </button>

      <Badge count={num}>
        <div>123</div>
      </Badge>
    </div>
  )
}
