// import { Col, Row } from '@kpi/ui'
// import { forwardRef, Profiler, useEffect, useLayoutEffect, useState } from 'react'
// import { AnimatePresence, motion } from 'framer-motion'
// import { CSSTransition, SwitchTransition } from './transition'

// import './style.css'

// const Red = forwardRef((props: any, ref: any) => {
//   return (
//     <div
//       ref={ref}
//       className="a"
//       style={{
//         width: 200,
//         borderRadius: '4px',
//         backgroundColor: 'red',
//       }}
//     >
//       <div style={{ height: 40 }} />
//       <div style={{ height: 40 }} />
//       <div style={{ height: 40 }} />
//       <div style={{ height: 40 }} />
//       <div style={{ height: 40 }} />
//       <div style={{ height: 40 }} />
//       <div style={{ height: 40 }} />
//       <div style={{ height: 40 }} />
//       <div style={{ height: 40 }} />
//       <div style={{ height: 40 }} />
//       <div style={{ height: 40 }} />
//       <div style={{ height: 40 }} />
//     </div>
//   )
// })
// const Blue = forwardRef((props: any, ref: any) => {
//   return (
//     <div
//       ref={ref}
//       style={{
//         width: 200,
//         borderRadius: '4px',
//         backgroundColor: 'blue',
//       }}
//     >
//       <div style={{ height: 40 }} />
//       <div style={{ height: 40 }} />
//       <div style={{ height: 40 }} />
//       <div style={{ height: 40 }} />
//       <div style={{ height: 40 }} />
//       <div style={{ height: 40 }} />
//       <div style={{ height: 40 }} />
//       <div style={{ height: 40 }} />
//       <div style={{ height: 40 }} />
//       <div style={{ height: 40 }} />
//       <div style={{ height: 40 }} />
//       <div style={{ height: 40 }} />
//     </div>
//   )
// })

// export default function App() {
//   const [val, set] = useState(true)
//   const set1 = useState(true)[1]

//   return (
//     <div>
//       <div>
//         <button
//           type="button"
//           onClick={() => {
//             set((p) => !p)
//           }}
//         >
//           start
//         </button>
//         <button
//           type="button"
//           onClick={() => {
//             set1((p) => !p)
//           }}
//         >
//           set1
//         </button>
//       </div>

//       <CSSTransition name="fade" when={val}>
//         {(ref) => <Red ref={ref} />}
//       </CSSTransition>

//       {/* 仅实现退场 */}
//       {/* <SwitchTransition mode="out-in">
//         {!val && <CSSTransition name="fade">{(ref) => <Red ref={ref} />}</CSSTransition>}
//       </SwitchTransition> */}
//       {/* 转场 */}
//       {/* <SwitchTransition mode="out-in">
//         <CSSTransition name="fade" key={`${val}`}>
//           {(ref) => (val ? <Red ref={ref} /> : <Blue ref={ref} />)}
//         </CSSTransition>
//       </SwitchTransition> */}

//       {/* <AnimatePresence mode="wait">
//         <motion.div
//           key={`${val}`}
//           initial={{ opacity: 0, x: 260 }}
//           animate={{ x: 0, opacity: 1 }}
//           exit={{ x: 260, opacity: 0 }}
//           transition={{ type: 'tween', duration: 2, ease: 'easeOut' }}
//         >
//           {val ? <Red /> : <Blue />}
//         </motion.div>
//       </AnimatePresence> */}
//     </div>
//   )
// }

import { Button, Space, Form, Row, Col } from '@kpi/ui'
import kv from '@kpi/validate'
import { useEffect, useLayoutEffect, useState } from 'react'
import './style.css'

function Input(props: any) {
  return <input {...props} value={props.value || ''} style={{ height: 32 }} />
}

function SSS() {
  const [noStyle, setNoStyle] = useState(!true)
  const [noRule, setNoRule] = useState(true)
  const [inputNumber, setInputNumber] = useState(3000)

  const start = performance.now()
  console.log('start', start)
  setTimeout(() => {
    console.log('diff:setTimeout', performance.now() - start)
  })
  useLayoutEffect(() => {
    console.log('diff:useLayoutEffect', performance.now() - start)
  }, [start])
  useEffect(() => {
    console.log('diff:useEffect', performance.now() - start)
  }, [start])

  return (
    <div>
      <p style={{ fontSize: 20, textAlign: 'center', marginBottom: 20 }}>
        测试 {inputNumber || 0} 个输入框场景下 Form 组件的性能
      </p>
      <Space style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        <Button type="primary" onClick={() => setNoStyle((p) => !p)}>
          NoStyle: {noStyle ? 'true' : 'false'}
        </Button>
        <Button type="primary" onClick={() => setNoRule((p) => !p)}>
          NoRule: {noRule ? 'true' : 'false'}
        </Button>
        <span>input number</span>
        <Input value={inputNumber} onChange={(e) => setInputNumber(parseInt(e.target.value, 10))} />
      </Space>
      <Form
        as="div"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          width: 600,
          margin: '0 auto',
        }}
      >
        {Array.from({ length: inputNumber }, (_, i) => (
          <Form.Item
            key={i}
            label="123123"
            noStyle={noStyle}
            name={['username', i]}
            rule={noRule ? undefined : kv.string().required()}
          >
            <Input placeholder={`username-${i}`} />
          </Form.Item>
        ))}
      </Form>
    </div>
  )
}
export default function App() {
  const [show, set] = useState(false)
  console.log('render', performance.now())
  return (
    <div>
      <button type="button" onClick={() => set(!show)}>
        change
      </button>
      {show && <SSS />}
    </div>
  )
}
