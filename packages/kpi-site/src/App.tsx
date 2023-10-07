import { useRef, useState } from 'react'
import Collapse from './Collapse'
import { animate, eases } from './motion'
import './style.css'

export default function App() {
  const ref = useRef<HTMLDivElement>(null)
  const [collapsed, set] = useState(false)
  return (
    <div>
      <button
        type="button"
        onClick={async () => {
          const dom = ref.current!

          const fade = (node: HTMLDivElement) => {
            const current = () => {}
            return {
              easing: eases.easeInBack,
              duration: 3000,
              times: [0, 0.4, 0.8, 1],
              repeat: 4,
              repeatType: 'mirror',
              init: (step: number) => {
                if (step === 0) return [0, 200]
                if (step === 1) return [200, 500]
                return [500, 800]
              },
              tick: (val, label: string) => {
                // label
              },
            }
          }
          animate(
            {
              x: [
                (step: number) => {
                  if (step === 0) return [0, 300]
                  if (step === 1) return [300, 500]
                  return [500, 1000]
                },
                (value: string, status: any) => {
                  dom.style.setProperty('transform', value)
                },
              ],
              y: [
                () => [0, 500],
                (value: string) => {
                  dom.style.setProperty('transform', value)
                },
              ],
              opacity: [
                () => [0, 1],
                (value) => {
                  dom.style.setProperty('opacity', value)
                },
              ],
            },
            {
              easing: eases.easeInBack,
              duration: 3000,
              times: [0, 0.4, 0.8, 1],
              repeat: 4,
              repeatType: 'mirror',
            }
          )
          animate(
            dom,
            {
              height: [0, 200, 500],
              opacity: [0, 1],
            },
            {
              duration: 1000,
              times: [0, 0.4, 0.8, 1],
              repeat: 4,
              repeatType: 'mirror',
            }
          )
        }}
      >
        start
      </button>
      <Collapse collapsed={collapsed}>
        <div
          ref={ref}
          style={{
            width: 200,
            height: 0,
            borderRadius: '4px',
            backgroundColor: 'red',
            // color: 'var(--primary-color)',
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
      </Collapse>
      {/* <div style={{ width: 100, height: 100, borderRadius: '50%', backgroundColor: 'red' }} /> */}
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
