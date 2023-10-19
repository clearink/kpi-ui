/* eslint-disable no-param-reassign */
import { forwardRef, useEffect, useState } from 'react'
import { CSSTransition, SwitchTransition } from './transition'

import './style.css'

const Red = forwardRef((props: any, ref: any) => {
  return (
    <div
      ref={ref}
      className="a"
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
  const [val, set] = useState(!true)
  const [val1, set1] = useState(true)

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

      <CSSTransition name="fade" when={val} unmountOnExit={val1}>
        {(ref) => <Red ref={ref} />}
      </CSSTransition>

      {/* 转场 */}
      {/* <SwitchTransition mode="out-in">
        <CSSTransition name="fade" key={`${val}`}>
          {(ref) => (val ? <Red ref={ref} /> : <Blue ref={ref} />)}
        </CSSTransition>
      </SwitchTransition> */}

      {/* <AnimatePresence mode="wait">
        <motion.div
          key={`${val}`}
          initial={{ opacity: 0, x: 260 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 260, opacity: 0 }}
          transition={{ type: 'tween', duration: 2, ease: 'easeOut' }}
        >
          {val ? <Red /> : <Blue />}
        </motion.div>
      </AnimatePresence> */}
    </div>
  )
}
