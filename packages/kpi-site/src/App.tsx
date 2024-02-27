import { Button, Form, Tooltip } from '@kpi-ui/components'

import '@kpi-ui/components/src/style'
import './style.scss'
import { useEffect, useLayoutEffect, useState } from 'react'
import { CSSTransition } from '@kpi-ui/components/src/_internal/transition'
import Overlay from '@kpi-ui/components/src/_internal/overlay'
import kv from '@kpi-ui/validator'

const Input = (props: any) => {
  return <input {...props} value={props.value || ''} />
}

export default function App() {
  const [open, set] = useState(!false)
  const [d, setD] = useState('block')

  return (
    <div style={{ margin: 100, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ padding: 400 }}>
        adasdsa
        {/* <div style={{ position: 'absolute', left: 400, top: 200 }}>
          <div style={{ position: 'absolute', left: 400, top: 200 }}>
            <div style={{ position: 'absolute', left: 400, top: 200 }}> */}
        <Tooltip content={<div>12313211212</div>}>
          <textarea style={{ position: 'relative', top: 20 }} />
        </Tooltip>
        {/* </div>
          </div>
        </div> */}
      </div>
    </div>
  )
}
