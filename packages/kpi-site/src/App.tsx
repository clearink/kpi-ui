import { Badge, Button, Checkbox, Collapse, Modal, Segmented } from '@kpi-ui/components'
import { useEffect, useReducer, useRef, useState } from 'react'

import '@kpi-ui/components/src/style'
import './style.scss'

const App: React.FC = () => {
  const [a, set] = useState(12)
  return (
    <div>
      <Button
        variant="filled"
        onClick={() => {
          set((Math.random() * 100) | 0)
        }}
      >
        222
      </Button>
      <div style={{ margin: 100 }}>
        <Badge count={a} maxCount={99} />
      </div>
    </div>
  )
}

export default App
