import { Badge, Button, Checkbox } from '@kpi-ui/components'
import { useRef, useState } from 'react'
import '@kpi-ui/components/src/style'

import './style.scss'

export default function App() {
  const [num, set] = useState(1)

  return (
    <div style={{ margin: 100 }}>
      <Button
        onClick={() => {
          const root = document.documentElement
          root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark'
        }}
      >
        theme
      </Button>
      <Button variant="filled" theme="danger" onClick={() => set((p) => p - 10)}>
        minus
      </Button>
      <Button disabled variant="filled" theme="danger">
        filled disabled
      </Button>
      <Button disabled variant="link" theme="success">
        success text
      </Button>
      <Button disabled theme="warning">
        minus
      </Button>
      <Button disabled theme="danger">
        minus
      </Button>
      <Button disabled theme="info">
        minus
      </Button>
      <Checkbox>123312</Checkbox>
    </div>
  )
}
