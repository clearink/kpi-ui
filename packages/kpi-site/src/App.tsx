import { Button, Tooltip } from '@kpi-ui/components'
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
        <Tooltip
          content={
            <Tooltip
              trigger="click"
              content={
                <div
                  style={{ height: 100, width: 200, overflow: 'auto' }}
                  onMouseDown={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                  }}
                >
                  <div style={{ height: 200 }}> 12312312 不冒泡</div>
                </div>
              }
            >
              <span>inner tooltip</span>
            </Tooltip>
          }
          placement="topLeft"
          trigger="click"
        >
          <Button
            style={
              {
                // width: 110,
              }
            }
          >
            Tooltip Trigger
          </Button>
        </Tooltip>
        <Button
          onMouseDown={(e) => {
            e.stopPropagation()
            e.preventDefault()
          }}
        >
          outer
        </Button>
      </div>
    </div>
  )
}

export default App
