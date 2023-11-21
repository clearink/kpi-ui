/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Button, LayoutTransition, SwitchTransition } from '@kpi-ui/components'
import { useState } from 'react'

import '@kpi-ui/components/src/style'
import './style.scss'

function Input(props: any) {
  // console.log(props)
  return <input {...props} value={props.value || ''} style={{ height: 32 }} />
}

export default function App() {
  const [active, setActive] = useState(1)
  return (
    <div className="window">
      <div className="left">
        {active === 1 && (
          <LayoutTransition id="underline">
            <div className="underline"></div>
          </LayoutTransition>
        )}
      </div>
      <div className="center">
        <Button
          onClick={() => {
            setActive(active === 1 ? 2 : 1)
          }}
        >
          change
        </Button>
      </div>
      <div className="right">
        {active === 2 && (
          <LayoutTransition id="underline">
            <div className="underline"></div>
          </LayoutTransition>
        )}
      </div>
    </div>
  )
}
