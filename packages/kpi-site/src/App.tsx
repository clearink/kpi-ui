import { Badge, Button, Checkbox, Collapse, Modal, Segmented } from '@kpi-ui/components'
import { useEffect, useReducer, useRef, useState } from 'react'

import '@kpi-ui/components/src/style'
import './style.scss'

const App: React.FC = () => {
  const [a, set] = useState(12)
  return (
    <div>
      <div
        style={{
          margin: 100,
        }}
      >
        <Button variant="filled">11231223</Button>
        <div style={{ margin: 100 }}>
          <Badge count={a} maxCount={999} />
        </div>
        <Checkbox>12321</Checkbox>

        <div>
          <Segmented options={['Map', 'Transit', 'Satellite']} disabled />
        </div>
        <div>
          <Segmented
            options={[
              'Daily',
              { label: 'Weekly', value: 'Weekly', disabled: true },
              'Monthly',
              { label: 'Quarterly', value: 'Quarterly', disabled: true },
              'Yearly',
            ]}
          />
        </div>
      </div>
    </div>
  )
}

export default App
