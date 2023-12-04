import { LayoutGroup, LayoutTransition, CSSTransition, Button } from '@kpi-ui/components'
import { useState } from 'react'

import '@kpi-ui/components/src/style'
import './style.scss'

const files = [
  {
    id: 1,
    style: {
      width: 200,
      height: 200,
      backgroundColor: 'red',
    },
  },
  {
    id: 2,
    style: {
      width: 200,
      height: 200,
      backgroundColor: 'blue',
    },
  },
]

export default function App() {
  const [selected, setSelected] = useState<number | false>(false)
  const item = selected !== false ? files[selected] : null

  return (
    <main>
      <LayoutGroup
        tag="div"
        className="items"
        onReady={({ el, offset, scale }) => {
          console.log('onready', offset, scale)
          el.style.transform = `translate3d(${offset[0]}px, ${offset[1]}px, 0) scale(${scale[0]}, ${scale[1]})`
        }}
        onRunning={(el) => {
          el.style.transform = `translate3d(0, 0, 0) scale(1, 1)`
          el.style.transition = `transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)`
        }}
        onFinish={(el) => {
          el.style.transform = ''
          el.style.transition = ''
        }}
      >
        <div>
          {files.map((file, i) => (
            <LayoutTransition key={file.id} id={`file-${file.id}`}>
              <div className="thumb" onClick={() => setSelected(i)} style={file.style}></div>
            </LayoutTransition>
          ))}
        </div>

        <CSSTransition
          when={!!item}
          unmountOnExit
          onEnter={(el) => {
            el.style.backgroundColor = 'rgba( 255, 255, 255, 0 )'
          }}
          onEntering={(el) => {
            el.style.backgroundColor = 'rgba( 255, 255, 255, 1 )'
            el.style.transition = 'all 0.3s ease-in-out'
          }}
          onEntered={(el) => {
            el.style.backgroundColor = 'rgba( 255, 255, 255, 1 )'
            el.style.transition = ''
          }}
          onExit={(el) => {
            el.style.backgroundColor = 'rgba( 255, 255, 255, 1 )'
          }}
          onExiting={(el) => {
            el.style.backgroundColor = 'rgba( 255, 255, 255, 0 )'
            el.style.transition = 'all 0.3s ease-in-out'
          }}
          onExited={(el) => {
            el.style.backgroundColor = ''
            el.style.transition = ''
          }}
        >
          <div
            className="item"
            data-id="item"
            onClick={(e) => {
              e.target === e.currentTarget && setSelected(false)
            }}
          >
            <LayoutTransition id={`file-${selected}`}>
              <div
                key={`file-${selected}`}
                className="container"
                style={{
                  borderRadius: 0,
                  height: item?.style.height,
                  width: item?.style.width,
                  backgroundColor: item?.style.backgroundColor,
                }}
              ></div>
            </LayoutTransition>
          </div>
        </CSSTransition>
      </LayoutGroup>
    </main>
  )
}

// export default function App() {
//   const [cur, set] = useState(!true)

//   return (
//     <div className="aaa">
//       <Button
//         onClick={() => {
//           set((p) => !p)
//         }}
//       >
//         set
//       </Button>
//       <CSSTransition name="fade" appear when={cur}>
//         <div className="a"></div>
//       </CSSTransition>
//     </div>
//     // <div className="window">
//     //   <Pagination current={cur} total={50} onChange={(next) => set(next)}></Pagination>
//     // </div>
//   )
// }
