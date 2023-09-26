import { useRef } from 'react'
import { animate, useMotionValue } from './motion'

import './style.css'

export default function App() {
  const ref = useRef<HTMLDivElement>(null)
  const v = useMotionValue(0)
  return (
    <div>
      <button
        type="button"
        onClick={async () => {
          // const a = animate(v, [300, 200, 500, null, 700], {
          //   duration: 2000,
          //   repeat: 1,
          //   repeatType: 'mirror',
          //   easing: ['easeInBack', 'linear'],
          //   onStart() {
          //     console.log('start', performance.now())
          //   },
          //   onRepeat() {
          //     console.log('repeat', performance.now())
          //   },
          //   onComplete() {
          //     console.log('complete', performance.now())
          //   },
          //   onUpdate(current) {
          //     // console.log(current)
          //     // ref.current!.style.setProperty('background-color', current)
          //     ref.current!.style.transform = `translate3d(${current}px, 0, 0)`
          //   },
          // })
          const a = animate(
            ref.current!,
            {
              x: [100, 300, 500],
              y: 20,
              // height: [null, 100, 300, '20vh', 'auto'],
              // y: 300,
            },
            {
              duration: 2000,
              onUpdate(current) {
                // console.log('current', current)
              },
              // x: {
              //   duration: 3000,
              //   delay: 1000,
              //   endDelay: 30,
              // },
            }
          )
          console.log(a)
          ;(window as any).a = a
          a.then(() => console.log('finish', performance.now()))
        }}
      >
        start
      </button>
      <div
        ref={ref}
        style={{
          width: 200,
          height: 200,
          borderRadius: '4px',
          backgroundColor: 'red',
          // color: 'var(--primary-color)',
        }}
      />
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
