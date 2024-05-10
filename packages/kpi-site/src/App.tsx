import { Button, Tooltip } from '@kpi-ui/components'
import { useEffect } from 'react'

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
          content={<div>AAAAAAAAAAAA for uasasdasdassing antd. Have a nice day!</div>}
          // content="AAAAAAAAAAAA for uasasdasdassing antd. Have a nice day!"
          placement="topLeft"
          // placement="top"
          // placement="topRight"
          // placement="rightTop"
          // placement="right"
          // placement="rightBottom"
          arrow={{ pointAtCenter: true }}
          open
        >
          <div
            style={{
              width: 110,
              height: 10,
              backgroundColor: 'blue',
            }}
          ></div>
        </Tooltip>
        {/* <Tooltip
          content={<div>AAAAAAAAAAAA for uasasdasdassing antd. Have a nice day!</div>}
          placement="topLeft"
          // placement="top"
          // placement="topRight"
          // placement="rightTop"
          // placement="right"
          // placement="rightBottom"
          arrow={{ pointAtCenter: !true }}
          // open
        >
          <div
            style={{
              width: 110,
              height: 10,
              backgroundColor: 'blue',
              // borderRadius: '50%',
              marginTop: 200,
            }}
          ></div>
        </Tooltip> */}
        {/* <iframe src="http://localhost:5173" width="1000px" height="500px"></iframe> */}
      </div>
    </div>
  )
}

export default App
