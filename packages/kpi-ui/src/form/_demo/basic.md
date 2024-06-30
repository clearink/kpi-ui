---
title: 
  zh-CN: 基本使用
  en-US: Basic
---

## zh-CN

基本的表单数据域控制展示，包含布局、初始化、验证、提交。

## en-US

Basic Form data control. Includes layout, initial values, validation and submit.

```tsx
import React from 'react';
import { Button, Form } from '@kpi/ui';
import kv from '@kpi/validate';

function Input(props){
  return <input {...props} value={props.value || ''} style={{height:32}} />
}

const App: React.FC = () => {
  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      onFinish={onFinish}
      onFailed={onFailed}
      autoComplete="off"
    >
      <Form.Item
        label="Username"
        name="username"
        rule={kv.string().required('Please input your username!')}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rule={kv.string().required('Please input your password!')}
      >
        <Input />
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default App;
```