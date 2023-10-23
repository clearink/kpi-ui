/* eslint-disable no-param-reassign */
import { forwardRef, useState } from 'react'
import { CSSTransition, GroupTransition, SwitchTransition } from './transition'

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
  const [val1, set1] = useState(true)
  const [list, setList] = useState(() => [1, 2, 3])
  return (
    <div>
      <div>
        <button
          type="button"
          onClick={() => {
            set((p) => !p)
          }}
        >
          set
        </button>
        <button
          type="button"
          onClick={() => {
            set1((p) => !p)
          }}
        >
          set1
        </button>
        <button
          type="button"
          onClick={() => {
            setList(list.length === 3 ? [2, 3, 4, 5] : [1, 2, 3])
          }}
        >
          setList
        </button>
      </div>

      {/* 转场 */}
      <SwitchTransition name="fade">{val ? <Red key="red" /> : <Blue />}</SwitchTransition>

      {/* 列表 */}
      {/* <GroupTransition name="fade">
        {list.map((id) => (
          <div key={id} style={{ width: 200, height: 50, background: 'red' }} />
        ))}
      </GroupTransition> */}

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
