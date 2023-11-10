import { Button, Form, Row, Col } from '@kpi-ui/components'
import { useState } from 'react'

import '@kpi-ui/components/src/style'
import './style.scss'

function Input(props: any) {
  // console.log(props)
  return <input {...props} value={props.value || ''} style={{ height: 32 }} />
}

export default function App() {
  const [inputNumber, setInputNumber] = useState(3000)
  return (
    <div>
      {/* <p style={{ fontSize: 20, textAlign: 'center', marginBottom: 20 }}>
        测试 {inputNumber || 0} 个 Col, Row 组件的性能
      </p> */}
      <Button>123</Button>
      <Button type="primary" size="large">
        123
      </Button>
      {/* {Array.from({ length: inputNumber }, (_, i) => (
        <Row key={i} className="row" gutter={10}>
          <Col className="col" span={4}>
            <div className="a"></div>
          </Col>
          <Col className="col" span={4}>
            <div className="a"></div>
          </Col>
          <Col className="col" span={4}>
            <div className="a"></div>
          </Col>
          <Col className="col" span={4}>
            <div className="a"></div>
          </Col>
          <Col className="col" span={4}>
            <div className="a"></div>
          </Col>
          <Col className="col" span={4}>
            <div className="a"></div>
          </Col>
        </Row>
      ))} */}
    </div>
  )
}
