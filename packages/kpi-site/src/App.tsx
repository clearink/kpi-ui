import { Button, Tooltip, Segmented } from '@kpi-ui/components'
import { useEffect, useReducer, useRef, useState } from 'react'

import '@kpi-ui/components/src/style'
import './style.scss'

const App: React.FC = () => {
  useEffect(() => {
    const height = document.documentElement.clientHeight
    const width = document.documentElement.clientWidth
    const id = setTimeout(() => {
      document.documentElement.scrollTop = height
      document.documentElement.scrollLeft = width
    }, 300)
    return () => {
      clearTimeout(id)
    }
  }, [])

  return (
    <div>
      <div
        style={{
          width: '300vw',
          height: '300vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Segmented options={['a', 'b', 'c']} />
      </div>
    </div>
  )
}

export default App
