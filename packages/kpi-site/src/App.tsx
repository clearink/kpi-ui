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
  const [active, setActive] = useState(0)
  return (
    <div className="window">
      <nav>
        <ul>
          {Array.from({ length: 3 }, (_, i) => {
            return (
              <li key={i} className={i === active ? 'selected' : ''} onClick={() => setActive(i)}>
                {i}
                {i === active ? (
                  <LayoutTransition id="underline">
                    <div className="underline"></div>
                  </LayoutTransition>
                ) : null}
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
