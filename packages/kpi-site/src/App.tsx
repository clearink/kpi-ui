import { Modal, Tooltip } from '@kpi-ui/components'

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
      <div style={{ width: 600, margin: '100px auto', height: 1000 }}>
        {/* <div style={{ position: 'absolute', right: 400, top: 200 }}>
          <div style={{ position: 'absolute', left: 400, top: 200 }}> */}
        <div style={{ overflow: 'auto', height: 400 }}>
          <div>
            <div style={{ height: 1000 }}></div>
            {(
              [
                'topLeft',
                'top',
                'topRight',
                // 'rightTop',
                // 'right',
                // 'rightBottom',
                // 'bottomLeft',
                // 'bottom',
                // 'bottomRight',
                // 'leftTop',
                // 'left',
                // 'leftBottom',
              ] as const
            ).map((pos) => (
              <Tooltip
                key={pos}
                placement={pos}
                open
                // arrow={pos === 'topLeft'}
                content={<div style={{ width: 100 }}>12313211212</div>}
              >
                <textarea style={{ margin: '10px' }} placeholder={pos} />
              </Tooltip>
            ))}
          </div>
        </div>
        {/* </div>
        </div> */}
      </div>
    </div>
  )
}
