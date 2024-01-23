// import { Modal, Drawer, Button, Collapse } from '@kpi-ui/components'
// import { useState } from 'react'

// import '@kpi-ui/components/src/style'
// import './style.scss'
// import { CSSTransition } from '@kpi-ui/components/src/_internal/transition'
// import FocusTrap from '@kpi-ui/components/src/_internal/focus-trap'

// const items = [
//   {
//     name: '1',
//     title: 'name-1',
//     extra: <div>123</div>,
//     children: (
//       <div>
//         Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
//         labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud incididunt ut labore et
//         dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
//         ut aliquip ex ea commodo consequat.
//       </div>
//     ),
//   },
//   {
//     name: '2',
//     title: 'name-2',
//     extra: <div>123</div>,
//     children: (
//       <div>
//         Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
//         labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud incididunt ut labore et
//         dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
//         ut aliquip ex ea commodo consequat.
//       </div>
//     ),
//   },
//   {
//     name: '3',
//     title: 'name-3',
//     extra: <div>123</div>,
//     children: (
//       <div>
//         Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
//         labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud incididunt ut labore et
//         dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
//         ut aliquip ex ea commodo consequat.
//       </div>
//     ),
//   },
// ]

// export default function App() {
//   const [open, set] = useState(false)

//   const [d, setd] = useState(['1', '3'])

//   return (
//     <div style={{ margin: 100 }}>
//       <Button
//         variant="filled"
//         onClick={() => {
//           set((p) => !p)
//         }}
//       >
//         minus
//       </Button>
//       <Modal title="我的Modal" open={open} onOpenChange={set}>
//         <div>132123</div>
//         <div>132123</div>
//         <div>132123</div>
//         <div>132123</div>
//       </Modal>
//       <FocusTrap open>
//         <div>
//           <input />
//           <button>btn</button>
//         </div>
//       </FocusTrap>

//       <div style={{ width: 400, margin: 120 }}>
//         <Collapse
//           accordion
//           expandedNames={d}
//           onChange={(name, names) => {
//             console.log(name, names)
//             setd(names)
//           }}
//           items={items}
//         />
//       </div>
//     </div>
//   )
// }
import { Button, Form, Space } from '@kpi-ui/components'
import { useState } from 'react'
import kv from '@kpi-ui/validator'
import '@kpi-ui/components/src/style'

function Input(props: any) {
  // console.log(props)
  return <input {...props} value={props.value || ''} style={{ height: 32 }} />
}

export default function App() {
  const [noStyle, setNoStyle] = useState(false)
  const [noRule, setNoRule] = useState(false)
  const [inputNumber, setInputNumber] = useState(3000)
  return (
    <div>
      <p style={{ fontSize: 20, textAlign: 'center', marginBottom: 20 }}>
        测试 {inputNumber || 0} 个输入框场景下 Form 组件的性能
      </p>
      <Space style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        <Button variant="filled" onClick={() => setNoStyle((p) => !p)}>
          NoStyle: {noStyle ? 'true' : 'false'}
        </Button>
        <Button onClick={() => setNoRule((p) => !p)}>NoRule: {noRule ? 'true' : 'false'}</Button>
        <span>input number</span>
        <Input
          value={inputNumber}
          onChange={(e: any) => setInputNumber(parseInt(e.target.value, 10))}
        />
      </Space>
      <Form
        tag="div"
        style={{
          width: 600,
          margin: '0 auto',
        }}
      >
        {Array.from({ length: inputNumber }, (_, i) => (
          <Form.Item
            key={i}
            label={`username_${i}`}
            noStyle={noStyle}
            name={['username', i]}
            rule={
              noRule
                ? undefined
                : kv
                    .string()
                    // .min(3, <div style={{ height: 40 }}>12312123123</div>)
                    .min(3)
                    .max(6)
                    .required()
            }
          >
            <Input placeholder={`username-${i}`} />
          </Form.Item>
        ))}
      </Form>
    </div>
  )
}
