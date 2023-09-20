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
          // const a = animate(v, [null, 300, 500], {
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
          //     console.log(current)
          //     // ref.current!.style.setProperty('background-color', current)
          //     ref.current!.style.transform = `translate3d(${current}px, 0, 0)`
          //   },
          // })
          const a = animate(
            ref.current!,
            {
              height: [100, 300, 500],
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
