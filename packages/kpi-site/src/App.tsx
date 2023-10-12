import { forwardRef, useRef, useState } from 'react'
import { AnimatePresence, motion as m } from 'framer-motion'
import { CSSTransition, SwitchTransition } from './Transition'
import './style.css'

const Red = forwardRef((props: any, ref: any) => {
  return (
    <div
      ref={ref}
      style={{
        width: 200,
        borderRadius: '4px',
        backgroundColor: 'red',
      }}
    >
      <p style={{ height: 10 }} />
      <p style={{ height: 10 }} />
      <p style={{ height: 10 }} />
      <p style={{ height: 10 }} />
      <p style={{ height: 10 }} />
      <p style={{ height: 10 }} />
      <p style={{ height: 10 }} />
      <p style={{ height: 10 }} />
      <p style={{ height: 10 }} />
      <p style={{ height: 10 }} />
      <p style={{ height: 10 }} />
    </div>
  )
})
const Blue = forwardRef((props: any, ref: any) => {
  return (
    <div
      ref={ref}
      style={{
        width: 200,
        borderRadius: '4px',
        backgroundColor: 'blue',
      }}
    >
      <p style={{ height: 10 }} />
      <p style={{ height: 10 }} />
      <p style={{ height: 10 }} />
      <p style={{ height: 10 }} />
      <p style={{ height: 10 }} />
      <p style={{ height: 10 }} />
      <p style={{ height: 10 }} />
      <p style={{ height: 10 }} />
      <p style={{ height: 10 }} />
      <p style={{ height: 10 }} />
      <p style={{ height: 10 }} />
    </div>
  )
})
export default function App() {
  // const ref = useRef<HTMLDivElement>(null)
  const [val, set] = useState(true)
  const [val1, set1] = useState(true)

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          set((p) => !p)
        }}
      >
        start
      </button>
      <button
        type="button"
        onClick={() => {
          set1((p) => !p)
        }}
      >
        sta
      </button>

      {/* <CSSTransition when={val} name="fade">
        {
          (getInstance) => <Red ref={getInstance} />
          // (val ? <Red ref={getInstance} /> : <Blue ref={getInstance} />)
        }
      </CSSTransition> */}
      {/* <SwitchTransition mode="out-in">
      </SwitchTransition> */}

      {/* <AnimatePresence mode="popLayout"> */}
      {/* {val ? <Red /> : <Blue />} */}
      {/* </AnimatePresence> */}
    </div>
  )
}

/**
 * 场景1:
 * enter 时，变更属性需要执行exit
 * in-out: 立即执行
 * out-in
 * default
 *
 *
 * 场景2:
 * exit 时，变更属性需要执行 enter
 * in-out
 * out-in
 * default
 *
 */
