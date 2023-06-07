// /* eslint-disable import/no-extraneous-dependencies */
// // import { Form, Button, Space } from '@kpi/ui'··
// // import kv from '@kpi/validate'
// // import { useEffect, useLayoutEffect, useReducer, useState } from 'react'

// import { Button } from '@kpi/ui'
// import { useEffect, useLayoutEffect, useRef, useState } from 'react'
// import useAnimationFrame from './motion/hooks/use_animation_frame'
// import cubicBezier from './motion/tween/cubic_bezier'
// import easing from './motion/tween/easing'
// import steps from './motion/tween/steps'
// import { clamp } from './motion/utils'
// import { frameData } from './motion/utils/frame_data'
// import raf from './motion/utils/raf'
// import './style.css'

// function Input(props: any) {
//   return <input {...props} value={props.value || ''} style={{ height: 32 }} />
// }

// export default function App() {
//   const [noStyle, setNoStyle] = useState(true)
//   const [noRule, setNoRule] = useState(true)
//   const [inputNumber, setInputNumber] = useState(3000)

//   const start = performance.now()
//   setTimeout(() => {
//     console.log('diff:setTimeout', performance.now() - start)
//   })
//   useLayoutEffect(() => {
//     console.log('diff:useLayoutEffect', performance.now() - start)
//   }, [start])
//   useEffect(() => {
//     console.log('diff:useEffect', performance.now() - start)
//   }, [start])

//   return (
//     <div>
//       <p style={{ fontSize: 20, textAlign: 'center', marginBottom: 20 }}>
//         测试 {inputNumber || 0} 个输入框场景下 Form 组件的性能
//       </p>
//       <Space style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
//         <Button type="primary" onClick={() => setNoStyle((p) => !p)}>
//           NoStyle: {noStyle ? 'true' : 'false'}
//         </Button>
//         <Button type="primary" onClick={() => setNoRule((p) => !p)}>
//           NoRule: {noRule ? 'true' : 'false'}
//         </Button>
//         <span>input number</span>
//         <Input value={inputNumber} onChange={(e) => setInputNumber(parseInt(e.target.value, 10))} />
//       </Space>
//       <Form
//         as="div"
//         style={{
//           display: 'flex',
//           flexWrap: 'wrap',
//           justifyContent: 'center',
//           width: 600,
//           margin: '0 auto',
//         }}
//       >
//         {Array.from({ length: inputNumber }, (_, i) => (
//           <Form.Item
//             key={i}
//             label="123123"
//             noStyle={noStyle}
//             name={['username', i]}
//             rule={noRule ? undefined : kv.string().required()}
//           >
//             <Input placeholder={`username-${i}`} />
//           </Form.Item>
//         ))}
//       </Form>
//     </div>
//   )
// }

// // simple animate function

// interface AnimateOptions {
//   duration?: number
//   type?: any
// }

// function animate(target: HTMLElement, from: number, to: number, options: AnimateOptions = {}) {
//   const { duration = 300, type = easing.linear } = options

//   const frameCount = Math.ceil(duration / frameData.delta)
//   let frame = 0

//   function tick(t) {
//     frame += 1

//     const elapsed = clamp(frame, 0, frameCount) / frameCount
//     const next = from + type(elapsed) * (to - from)

//     target.style.setProperty('transform', `translate3d(${next}px,0,0)`)

//     return frame < frameCount
//   }

//   return raf(tick)
// }
// export default function App() {
//   const ref = useRef<HTMLDivElement>(null)
//   const cancel = useRef(() => {})
//   return (
//     <div>
//       <Button
//         onClick={() => {
//           cancel.current()
//           cancel.current = animate(ref.current!, 0, 200, {
//             type: easing.easeInBack,
//             duration: 500,
//           })
//         }}
//       >
//         start
//       </Button>

//       <Button
//         onClick={() => {
//           cancel.current()
//         }}
//       >
//         stop
//       </Button>

//       {/* <Collapse open={open} timeout={300}> */}
//       <div className="container" ref={ref}>
//         {/* <div className="cube" ref={ref}>
//           <div className="side front" />
//           <div className="side left" />
//           <div className="side right" />
//           <div className="side top" />
//           <div className="side bottom" />
//           <div className="side back" />
//         </div> */}
//       </div>
//     </div>
//   )
// }
import { useRef } from 'react'
import { animate, useMotionValue } from './motion'

import './style.css'
// import { animate, useMotionValue } from 'framer-motion'

export default function App() {
  const ref = useRef<HTMLDivElement>(null)
  const v = useMotionValue(0)
  return (
    <div>
      <button
        type="button"
        onClick={() => {
          const a = animate(v, [null, 200, 600], {
            duration: 2000,
            repeat: 4,
            repeatDelay: 200,
            onStart() {
              console.log('onStart')
            },
            onRepeat() {
              console.log('onRepeat')
            },
            onUpdate(current) {
              ref.current!.style.transform = `translate3d(${current}px, 0, 0)`
            },
            onComplete() {
              console.log('onComplete')
            },
          })

          // animate(
          //   ref.current!,
          //   {
          //     x: [200, 300, 100, null, 200],
          //     y: [300, 100, 0, 10],
          //   },
          //   {
          //     x: { duration: 2000, delay: 1000 },
          //     y: { duration: 5000, delay: 200 },
          //   }
          // )
          // 生成2个tween tween 的 start，end 不一致，是否要生成2个 controller 呢？
          // 貌似不用吧
        }}
      >
        start
      </button>
      <div
        ref={ref}
        style={{
          width: 23,
          height: 23,
          borderRadius: '4px',
          backgroundColor: 'red',
          // color: 'var(--primary-color)',
        }}
      />
      {/* <div style={{ width: 100, height: 100, borderRadius: '50%', backgroundColor: 'red' }} /> */}
    </div>
  )
}

/**
 * animate(motion,[
 *  { to: null, duration: 1000, easing: '' },
 *  { to: 300, duration: 1000, easing: '' },
 *  { to: 500, duration: 1000, easing: '' },
 *  { to: 1000, duration: 1000, easing: '' },
 *  { to: 1000, duration: 1000, easing: '' },
 * ]) 对于单个 数据来说,这种是完全正常的
 * ,是否需要使用null 进行占位呢?
 */
