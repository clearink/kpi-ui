import { LayoutGroup, LayoutTransition, CSSTransition } from '@kpi-ui/components'
import { useState } from 'react'

import '@kpi-ui/components/src/style'
import './style.scss'

const files = [
  {
    name: 'DRJ_3407+(Small)+(2)+-+kopie.JPG',
    title: 'DRJ 3407+(Small)+(2)+ +kopie',
    type: 'image/jpeg',
    size: 82091,
    width: 300,
    height: 300,
    src: 'http://envoy-s3-irl.imgix.net/teamleader/andi-kruger/fuut-fuut/MaFnjF_DRJ_3407%2B(Small)%2B(2)%2B-%2Bkopie.JPG?w=1500&fit=max&auto=format&dpr=1&ixlib=react-9.0.2',
    ratio: 1,
  },
  {
    name: 'nike-sb-stefan-janoski-max.jpg',
    title: 'nike sb stefan janoski max',
    type: 'image/jpeg',
    size: 157902,
    width: 575,
    height: 390,
    src: 'http://envoy-s3-irl.imgix.net/teamleader/andi-kruger/fuut-fuut/QtQW2c_nike-sb-stefan-janoski-max.jpg?w=1500&fit=max&auto=format&dpr=1&ixlib=react-9.0.2',
    ratio: 1.4743589743589745,
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
          {files.map((_, i) => (
            <LayoutTransition key={i} id={`file-${i}`}>
              <div
                className="thumb"
                onClick={() => setSelected(i)}
                style={{
                  borderRadius: 20,
                  background: 'white',
                  height: '200px',
                  width: '200px',
                }}
              >
                <img src={files[i].src} />
              </div>
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
                  height: item?.height,
                  width: item?.width,
                  backgroundColor: 'mediumaquamarine',
                }}
              >
                <img src={item?.src} />
              </div>
            </LayoutTransition>
          </div>
        </CSSTransition>
      </LayoutGroup>
    </main>
  )
}
// import { Pagination } from '@kpi-ui/components'
// import { useState } from 'react'

// import '@kpi-ui/components/src/style'
// import './style.scss'

// export default function App() {
//   const [cur, set] = useState(1)

//   return (
//     <div className="window">
//       <Pagination current={cur} total={50} onChange={(next) => set(next)}></Pagination>
//     </div>
//   )
// }
