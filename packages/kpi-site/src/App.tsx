import { Badge, Button, Checkbox } from '@kpi-ui/components'
import { useRef, useState } from 'react'
import '@kpi-ui/components/src/style'

import './style.scss'

export default function App() {
  const [num, set] = useState(1)

  return (
    <div style={{ margin: 100 }}>
      <Button variant="filled" onClick={() => set((p) => p - 10)}>
        minus
      </Button>
    </div>
  )
}
