import { GroupTransition, SwitchTransition } from '@kpi-ui/components'
import { useState } from 'react'
import '@kpi-ui/components/src/style'

import './style.scss'
import Badge from '@kpi-ui/components/src/badge/components/badge'

export default function App() {
  const [num, set] = useState(1)
  return (
    <div>
      <button onClick={() => set((p) => p - 10)}>minus</button>
      <button onClick={() => set((p) => p + 10)}>plus</button>
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
