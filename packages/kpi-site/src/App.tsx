import { Form, Button } from '@kpi/ui'
import kv from '@kpi/validate'
import { useEffect } from 'react'

function Input(props: any) {
  return <input {...props} value={props.value || ''} style={{ height: 32 }} />
}

export default function App() {
  const start = performance.now()
  useEffect(() => {
    console.log('diff', performance.now() - start)
  }, [start])
  const form = Form.useForm()
  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          form.validateFields()
        }}
      >
        validate
      </Button>
      <Form as="div" form={form}>
        {/* <Form.Item label="label a" name="a" rule={kv.string().required()}>
          <Input />
        </Form.Item>
        <Form.Item label="label b" name="b" rule={kv.string().required()}>
          <Input />
        </Form.Item> */}
        {Array.from({ length: 2 }, (_, i) => (
          <Form.Item
            style={{ marginBottom: 49 }}
            label="123123"
            key={i}
            name={['name', i]}
            rule={kv.string().required()}
          >
            <Input placeholder={`name-${i}`} />
          </Form.Item>
        ))}
      </Form>
    </div>
  )
}
