import { Collapse, Segmented } from '@kpi-ui/components'
import { useEffect, useReducer, useRef, useState } from 'react'

import '@kpi-ui/components/src/style'
import './style.scss'

const App: React.FC = () => {
  const [a, set] = useState('c')
  return (
    <div>
      <div
        style={{
          margin: 100,
        }}
      >
        <Collapse
          accordion
          size="small"
          items={[
            {
              name: '1',
              title: '1',
              children: <div>1212312</div>,
            },
            {
              name: '11',
              title: '11',
              children: <div>12123121212312</div>,
            },
          ]}
        ></Collapse>{' '}
        <Collapse
          accordion
          items={[
            {
              name: '1',
              title: '1',
              children: <div>1212312</div>,
            },
            {
              name: '11',
              title: '11',
              children: <div>12123121212312</div>,
            },
          ]}
        ></Collapse>{' '}
        <Collapse
          accordion
          size="large"
          items={[
            {
              name: '1',
              title: '1',
              children: <div>1212312</div>,
            },
            {
              name: '11',
              title: '11',
              children: <div>12123121212312</div>,
            },
          ]}
        ></Collapse>
        {/* <Pagination total={100} current={a} onChange={set} /> */}
      </div>
    </div>
  )
}

export default App
