import { forwardRef, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CSSTransition, SwitchTransition } from './Transition'

import './style.css'
import reflow from './Transition/CSSTransition/utils/reflow'
import nextFrame from './Transition/CSSTransition/utils/next_frame'

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

      {/* <SwitchTransition mode="out-in">
        <CSSTransition key={`${val}`} name="fade">
          {(setInstance) => <Red ref={setInstance} />}
        </CSSTransition>
      </SwitchTransition> */}

      {/* {(setInstance) => (val ? <Red ref={setInstance} /> : <Blue ref={setInstance} />)} */}

      {/* <AnimatePresence initial={false} mode="wait">
        {val ? (
          <motion.div
            initial={{ x: 260, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 260, opacity: 0 }}
            transition={{ duration: 2, type: 'tween', ease: 'easeOut' }}
          >
            <Red />
          </motion.div>
        ) : (
          <motion.section
            initial={{ x: 260, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 260, opacity: 0 }}
            transition={{ duration: 2, type: 'tween', ease: 'easeOut' }}
          >
            <Blue />
          </motion.section>
        )}
      </AnimatePresence> */}
    </div>
  )
}
