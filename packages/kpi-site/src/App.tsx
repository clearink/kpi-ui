import { Tooltip } from '@kpi-ui/components'

import '@kpi-ui/components/src/style'
import './style.scss'

export default function App() {
  return (
    <div
      style={{
        height: '100vh',
        overflow: 'auto',
      }}
    >
      <div style={{ width: 300, margin: '100px auto', height: 1000 }}>
        {/* <div style={{ position: 'absolute', right: 400, top: 200 }}>
          <div style={{ position: 'absolute', left: 400, top: 200 }}> */}
        <div style={{ overflow: 'auto', height: 400 }}>
          <div>
            <div style={{ height: 1000 }}></div>
            <Tooltip open content={<div>12313211212</div>}>
              <textarea style={{ position: 'relative', top: 20 }} />
            </Tooltip>
          </div>
        </div>
        {/* </div>
        </div> */}
      </div>
    </div>
  )
}
