import { forwardRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
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

      {/* 仅实现退场 */}
      <SwitchTransition mode="out-in">
        {!val && <CSSTransition name="fade">{(ref) => <Red ref={ref} />}</CSSTransition>}
      </SwitchTransition>
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
