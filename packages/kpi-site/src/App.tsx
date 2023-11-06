import { Button, Form, Space } from '@kpi-ui/components'
import { useState } from 'react'
import kv from '@kpi-ui/validator'

function Input(props: any) {
  return <input {...props} value={props.value || ''} style={{ height: 32 }} />
}

export default function App() {
  const [noStyle, setNoStyle] = useState(false)
  const [noRule, setNoRule] = useState(false)
  const [inputNumber, setInputNumber] = useState(300)

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
        tag="div"
        style={{
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
            rule={kv
              .string()
              // .min(3, <div style={{ height: 40 }}>12312123123</div>)
              .min(3)
              .max(6)
              .required()}
          >
            <Input placeholder={`username-${i}`} />
          </Form.Item>
        ))}
      </Form>
    </div>
  )
}
