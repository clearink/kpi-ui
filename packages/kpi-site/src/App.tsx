import { Button, Tooltip } from '@kpi-ui/components'

import '@kpi-ui/components/src/style'
import './style.scss'
import { useEffect } from 'react'

// export default function App() {
//   return (
//     <div
//       style={{
//         height: '100vh',
//         overflow: 'auto',
//       }}
//     >
//       <div style={{ overflow: 'auto', width: 640, margin: '100px auto', height: 400 }}>
//         <div style={{ overflow: 'auto', width: 620, margin: '100px auto', height: 600 }}>
//           <div style={{ overflow: 'auto', width: 600, margin: '100px auto', height: 800 }}>
//             {/* <div style={{ position: 'absolute', right: 400, top: 200 }}>
//         <div style={{ position: 'absolute', left: 400, top: 200 }}>*/}
//             <div style={{ overflow: 'auto', height: 300, border: '1px solid red' }}>
//               <div>
//                 <div style={{ height: 1000 }}></div>
//                 {(
//                   [
//                     'topLeft',
//                     // 'top',
//                     // 'topRight',
//                     // 'rightTop',
//                     // 'right',
//                     // 'rightBottom',
//                     // 'bottomLeft',
//                     // 'bottom',
//                     // 'bottomRight',
//                     // 'leftTop',
//                     // 'left',
//                     // 'leftBottom',
//                   ] as const
//                 ).map((pos) => (
//                   <Tooltip
//                     key={pos}
//                     placement={pos}
//                     open
//                     // arrow={false}
//                     // arrow={pos === 'topLeft'}
//                     content={<div style={{ width: 100 }}>12313211212</div>}
//                   >
//                     <Button variant="filled" style={{ margin: 10 }}>
//                       {pos}
//                     </Button>
//                   </Tooltip>
//                 ))}
//                 <div style={{ height: 1000 }}></div>
//                 {/* </div>
//             </div>*/}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
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
          content="Thanks for using antd. Have a nice day!"
          placement="topLeft"
          trigger="click"
          open
        >
          <Button
            style={{
              height: 32,
              width: 200,
              border: '1px solid',
              borderRadius: 4,
              padding: '6px 8px',
            }}
          >
            Scroll The Window
          </Button>
        </Tooltip>
      </div>
    </div>
  )
}

export default App
