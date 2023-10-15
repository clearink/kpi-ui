import { forwardRef, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CSSTransition, SwitchTransition } from './transition'

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
      <div style={{ height: 40 }} />
      <div style={{ height: 40 }} />
      <div style={{ height: 40 }} />
      <div style={{ height: 40 }} />
      <div style={{ height: 40 }} />
      <div style={{ height: 40 }} />
      <div style={{ height: 40 }} />
      <div style={{ height: 40 }} />
      <div style={{ height: 40 }} />
      <div style={{ height: 40 }} />
      <div style={{ height: 40 }} />
      <div style={{ height: 40 }} />
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
      <div style={{ height: 40 }} />
      <div style={{ height: 40 }} />
      <div style={{ height: 40 }} />
      <div style={{ height: 40 }} />
      <div style={{ height: 40 }} />
      <div style={{ height: 40 }} />
      <div style={{ height: 40 }} />
      <div style={{ height: 40 }} />
      <div style={{ height: 40 }} />
      <div style={{ height: 40 }} />
      <div style={{ height: 40 }} />
      <div style={{ height: 40 }} />
    </div>
  )
})
export default function App() {
  // const ref = useRef<HTMLDivElement>(null)
  const [val, set] = useState(true)
  const set1 = useState(true)[1]

  const a = [<div>123</div>]
  return (
    <div>
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
          set1
        </button>
      </div>

      <SwitchTransition mode="out-in">
        <CSSTransition key={`${val}`} appear name="fade">
          {(setInstance) => (val ? <Red ref={setInstance} /> : <Blue ref={setInstance} />)}
        </CSSTransition>
      </SwitchTransition>

      {/* <CSSTransition appear when={false} name="fade">
        {(setInstance) => <Red ref={setInstance} />}
      </CSSTransition> */}

      {/* {(setInstance) => (val ? <Red ref={setInstance} /> : <Blue ref={setInstance} />)} */}
    </div>
  )
}
