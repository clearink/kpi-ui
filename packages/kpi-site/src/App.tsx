// /* eslint-disable import/no-extraneous-dependencies */
// import { Form, Button, Space } from '@kpi/ui'
// import kv from '@kpi/validate'
// import { useEffect, useLayoutEffect, useState } from 'react'

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
//         <Form.List name="username" initialValue={Array(3000).fill(1)}>
//           {(fields, helpers) => {
//             return (
//               <>
//                 <Button
//                   onClick={() => {
//                     ;(window as any).a = 0
//                     helpers.insert(0, Math.random() * 100)
//                     setTimeout(() => {
//                       console.log((window as any).a)
//                     })
//                   }}
//                 >
//                   insert
//                 </Button>
//                 {fields.map((field) => (
//                   <Form.Item
//                     {...field}
//                     label="123123"
//                     noStyle={noStyle}
//                     rule={noRule ? undefined : kv.string().required()}
//                   >
//                     <Input placeholder={`username-${field.name}`} />
//                   </Form.Item>
//                 ))}
//               </>
//             )
//           }}
//         </Form.List>
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
          // const a = animate(v, 800, {
          //   duration: 2000,
          //   easing: 'easeInSine',
          //   repeat: 3,
          //   repeatType: 'mirror',
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
          //     ref.current!.style.transform = `translate3d(${current}px, 0, 0)`
          //   },
          // })
          const a = animate(
            ref.current!,
            {
              x: [null, 100, 300, '20vh', '40px', '20vw'],
              // y: 300,
            },
            {
              duration: 1000,
              repeat: 2,
              delay: 2000,
              easing: 'easeInOutQuad',
              repeatType: 'mirror',
              onUpdate(current) {
                console.log('current', current)
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
