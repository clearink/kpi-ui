import { Segmented } from '@kpi-ui/components'
import { useEffect, useReducer, useRef, useState } from 'react'

import '@kpi-ui/components/src/style'
import './style.scss'

const App: React.FC = () => {
  const [a, set] = useState('c')
  return (
    <div>
      <div
        style={{
          width: '100vw',
          height: '100vh',
        }}
      >
        <Segmented block={!false} options={['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly']} />
        {/* <Pagination total={100} current={a} onChange={set} /> */}
      </div>
    </div>
  )
}

export default App
