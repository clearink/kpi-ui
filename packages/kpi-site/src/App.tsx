import { Button, Form, Tooltip } from '@kpi-ui/components'
import { useState } from 'react'
import kv from '@kpi-ui/validator'
import GroupTransition from '@kpi-ui/components/src/_internal/transition/components/group-transition'

import '@kpi-ui/components/src/style'
import './style.scss'

const Input = (props: any) => {
  return <input {...props} value={props.value || ''} />
}

export default function App() {
  return (
    <div style={{ margin: 100, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ padding: 400 }}>
        {/* <div style={{ position: 'absolute', left: 400, top: 200 }}>
          <div style={{ position: 'absolute', left: 400, top: 200 }}>
            <div style={{ position: 'absolute', left: 400, top: 200 }}> */}
        <Tooltip open content={<div>12313211212</div>}>
          <textarea style={{ position: 'relative', top: 20 }} />
        </Tooltip>
        {/* </div>
          </div>
        </div> */}
      </div>
    </div>
  )
}
