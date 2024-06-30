import { Badge, Button, Segmented } from '@kpi-ui/components'
import { useState } from 'react'

import '@kpi-ui/components/src/style/css'
import './style.scss'

const random = (min: number, max: number) => {
  return min + Math.floor(Math.random() * (max - min))
}

const App: React.FC = () => {
  const [a, set] = useState(12)
  return (
    <div>
      <div style={{ margin: 100, display: 'flex' }}>
        <Badge count={a} maxCount={999}>
          <Button
            variant="filled"
            onClick={() => {
              const l = [random(0, 10), random(10, 100), random(100, 1000), random(1000, 10000)]

              const factor = Math.random() > 0.5 ? 1 : -1
              set(l[random(0, 4)] * factor)
            }}
          >
            random
          </Button>
        </Badge>
      </div>
      <div>{a}</div>
      <div>
        <Segmented options={['a', 'b', 'c', 'd']} />
      </div>
    </div>
  )
}

export default App
