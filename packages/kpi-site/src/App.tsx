// /* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
// /* eslint-disable jsx-a11y/click-events-have-key-events */
// import { Button, LayoutTransition } from '@kpi-ui/components'
// import { useState } from 'react'

// import '@kpi-ui/components/src/style'
// import './style.scss'

// function Input(props: any) {
//   // console.log(props)
//   return <input {...props} value={props.value || ''} style={{ height: 32 }} />
// }

// export default function App() {
//   const [active, setActive] = useState(1)
//   return (
//     <div className="window">
//       <div className="left">
//         {active === 1 && (
//           <LayoutTransition
//             id="underline"
//             onLayout={(el, old) => {
//               if (!old) return

//               const rect = el.getBoundingClientRect()

//               // scale 为固定值
//               const scaleX = old.rect.width / rect.width
//               const scaleY = old.rect.height / rect.height

//               // 加上额外的值，中心点 /2
//               const offsetX = old.rect.x - rect.x + (old.rect.width - rect.width) / 2
//               const offsetY = old.rect.y - rect.y + (old.rect.height - rect.height) / 2

//               el.style.transform = `translate3d(${offsetX}px,${offsetY}px,0) scale(${scaleX},${scaleY})`
//             }}
//             onEntering={(el) => {
//               el.style.transform = `translate3d(0px,0px,0) scale(1, 1)`
//               el.style.transition = 'transform 0.3s ease-in-out'
//             }}
//             onEntered={(el) => {
//               el.style.transform = ''
//               el.style.transition = ''
//             }}
//           >
//             <div className="underline"></div>
//           </LayoutTransition>
//         )}
//       </div>
//       <div className="center">
//         <Button
//           onClick={() => {
//             setActive(active === 1 ? 2 : 1)
//           }}
//         >
//           change
//         </Button>
//       </div>
//       <div className="right">
//         {active === 2 && (
//           <LayoutTransition
//             id="underline"
//             onLayout={(el, old) => {
//               if (!old) return

//               const rect = el.getBoundingClientRect()

//               const scaleX = old.rect.width / rect.width
//               const scaleY = old.rect.height / rect.height

//               const offsetX = old.rect.x - rect.x + (old.rect.width - rect.width) / 2
//               const offsetY = old.rect.y - rect.y + (old.rect.height - rect.height) / 2

//               el.style.transform = `translate3d(${offsetX}px,${offsetY}px,0) scale(${scaleX},${scaleY})`
//             }}
//             onEntering={(el) => {
//               el.style.transform = `translate3d(0px,0px,0) scale(1, 1)`
//               el.style.transition = 'transform 0.3s ease-in-out'
//             }}
//             onEntered={(el) => {
//               el.style.transform = ''
//               el.style.transition = ''
//             }}
//           >
//             <div className="underline"></div>
//           </LayoutTransition>
//         )}
//       </div>
//     </div>
//   )
// }
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Button, LayoutGroup, LayoutTransition, SwitchTransition } from '@kpi-ui/components'
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
        <LayoutGroup
          onReady={(el, old) => {
            console.log('onReady')
            if (!old) return

            const rect = el.getBoundingClientRect()

            const scaleX = old.rect.width / rect.width
            const scaleY = old.rect.height / rect.height

            const offsetX = old.rect.x - rect.x + (old.rect.width - rect.width) / 2
            const offsetY = old.rect.y - rect.y + (old.rect.height - rect.height) / 2

            el.style.transform = `translate3d(${offsetX}px,${offsetY}px,0) scale(${scaleX},${scaleY})`
          }}
          onRunning={(el) => {
            console.log('onRunning')
            el.style.transform = `translate3d(0,0,0) scale(1,1)`
            el.style.transition = `transform 0.3s ease-in-out`
          }}
          onFinish={(el) => {
            console.log('onFinish')
            el.style.transform = ''
            el.style.transition = ''
          }}
        >
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
        </LayoutGroup>
      </nav>
    </div>
  )
}
