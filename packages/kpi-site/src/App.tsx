import { Button, Tooltip } from '@kpi-ui/components'
import { useEffect } from 'react'

import '@kpi-ui/components/src/style'
import './style.scss'

const App: React.FC = () => {
  // useEffect(() => {
  //   const height = document.documentElement.clientHeight
  //   const width = document.documentElement.clientWidth
  //   const id = setTimeout(() => {
  //     document.documentElement.scrollTop = height
  //     document.documentElement.scrollLeft = width
  //   }, 300)
  //   return () => {
  //     clearTimeout(id)
  //   }
  // }, [])

  return (
    <div>
      <div
        style={{
          width: '300vw',
          height: '300vh',
          // display: 'flex',
          // alignItems: 'center',
          // justifyContent: 'center',
        }}
      >
        <Tooltip
          content={<div>AAAAAAAAAAAA for uasasdasdassing antd. Have a nice day!</div>}
          placement="topLeft"
          open
        >
          <div
            style={{
              width: 110,
              height: 10,
              margin: 300,
              backgroundColor: 'blue',
            }}
          ></div>
        </Tooltip>
      </div>
    </div>
  )
}

export default App
