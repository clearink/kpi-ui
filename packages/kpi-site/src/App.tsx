import { RefObject, useState } from 'react'
import Transition from './transition'
import './style.css'

export default function App() {
  const [val, set] = useState(true)
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

      <Transition
        appear
        when={val}
        name="fade"
        onEnter={(el) => {
          console.log('enter')
          // eslint-disable-next-line no-param-reassign
          el.style.display = ''
        }}
        onEntering={() => {
          console.log('entering', performance.now())
        }}
        onExitCancel={(el) => {
          console.log('exit cancel', el)
        }}
      >
        {(ref: RefObject<HTMLDivElement>) => {
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
        }}
      </Transition>
    </div>
  )
}
// M = MT * MR * MH * MS
/**
 * m = [
 *  [1.23261,   -0.424421,  12],
 *  [0.351116,  0.0875432,  13],
 *  [0,         0,          1]
 * ]
 * const MT = [
 *  [1, 0, tx],
 *  [0, 1, ty],
 *  [0, 0, 1]
 * ]
 *
 * const MR = [
 *  [cos(θ),  -sin(θ),  0],
 *  [sin(θ),  cos(θ),   0],
 *  [0,       0,        1]
 * ]
 *
 * const MH = [
 *  [1,       tan(hx),  0],
 *  [tan(hy), 1,        0],
 *  [0,       0,        1]
 * ]
 *
 * const MS = [
 *  [sx,  0,  0],
 *  [0,   sy, 0],
 *  [0,   0,  1]
 * ]
 */
